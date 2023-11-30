import {auth, docDB, fileDB} from "../firebase"
import {assignProspectScore} from "./ProspectScoreService"
import {assignDistanceFromLocalUser} from "./UserLocationService"

const MAX_DISTANCE_MI = 25
const DONT_LOAD_ALREADY_SEEN_PROSPECTS = true; //for testing purposes

const users = docDB.collection("users")
const matches = docDB.collection("matches")

var localUser = null
var sortedProspects = null

async function registerUser(newData){
    try{
        await auth.createUserWithEmailAndPassword(newData.email, newData.password)
        return await users.add({
            email: newData.email.toLowerCase()
        })
    }catch(error){
        return await Promise.reject(error)
    }
}

function loginUser(data){
    return auth.signInWithEmailAndPassword(data.email, data.password)
}

function getUserDataFromDoc(userDoc){
    const userData = userDoc.data()
    userData.id = userDoc.id
    return userData
}

function loadLocalUserData(email, onCompletionFunc){
    users.where("email", "==", email).get().then((snapshot) => {
        if(snapshot.size === 1){
            localUser = getUserDataFromDoc(snapshot.docs[0])
            assignPFP(localUser, () => {
                if(onCompletionFunc){
                    onCompletionFunc()
                }
            })
        }else if(snapshot.size > 1){
            console.warn("Error: There are multiple users with the email: '" + email + "'")
        }else{
            console.warn("Error: We couldn't find a user with the email: '" + email + "'")
        }
    })
}

function getLocalUserData(){
    return localUser
}

function loadProspectsData(onCompletionFunc){
    if(localUser != null){
        const query = users.where("country", "==", localUser.country)
            .where("state", "==", localUser.state)
            .where("email", "!=", localUser.email)
        
        if(DONT_LOAD_ALREADY_SEEN_PROSPECTS){
            users.doc(localUser.id).collection("approvals").get().then(approvals => {
                const approvalEmails = approvals.map((approval) => approval.email) //TODO: map might not work here

                users.doc(localUser.id).collection("rejections").get.then(rejections => {
                    const rejectionEmails = rejections.map((rejection) => rejection.email)

                    query = query.where("email", "not-in", approvalEmails)
                        .where("email", "not-in", rejectionEmails)

                    loadProspectsDataFromQuery(query, onCompletionFunc)
                })
            })
        }else{
            loadProspectsDataFromQuery(query, onCompletionFunc)
        }
    } else {
        console.warn("Error: Trying to load prospects before loading the local user")
    }
}

function loadProspectsDataFromQuery(query, onCompletionFunc){
    query.get().then((snapshot) => {
        if(snapshot.empty){
            console.log("No users with local country or state")
            onCompletionFunc()
        }

        const validProspects = []

        snapshot.forEach((otherUserDoc) => {
            const otherUser = getUserDataFromDoc(otherUserDoc)
            console.log("Loaded prospect: " + otherUser.name)
            assignDistanceFromLocalUser(localUser, otherUser)

            if(otherUser.distance <= MAX_DISTANCE_MI){
                assignProspectScore(localUser, otherUser)
                console.log("  -Within distance")
                if(!isNaN(otherUser.score)) {
                    console.log("  -Acceptable score")
                    validProspects.push(otherUser)
                }
            }
        })

        if(validProspects.length > 0){
            sortedProspects = validProspects.sort((user1, user2) => user2.score - user1.score)

            let numPFPsLoaded = 0
            sortedProspects.forEach((prospect) => {
                assignPFP(prospect, () => {
                    numPFPsLoaded++
                    if(numPFPsLoaded === sortedProspects.length && onCompletionFunc){
                        onCompletionFunc()
                    }
                })
            })
        }else{
            sortedProspects = validProspects
            console.log("No valid prospective matches")
            onCompletionFunc()
        }
    })
}

function getProspectsData(){
    return sortedProspects
}

function updateLocalUserInDB(newData){
    for(let field in newData){
        localUser[field] = newData[field]
    }
    users.doc(localUser.id).update(newData)
}

function getPFPRef(user){
    return fileDB.ref("pfps/pfp-" + user.id + ".png")
}

function assignPFP(user, onCompletionFunc){
    getPFPRef(user).getDownloadURL().then(
        (url) => {
            user.pfp = url
            if(onCompletionFunc){
                onCompletionFunc(true)
            }
        },
        () => {
            user.pfp = ""
            console.warn("Failed to get PFP URL for " + user.name)
            if(onCompletionFunc){
                onCompletionFunc(false)
            }
        }
    )
}

function addProspectApprovalToDB(prospect){
    const localApprovalRef = users.doc(localUser.id).collection("approvals").doc(prospect.id)
    localApprovalRef.get().then((localApproval) => {
        if(!localApproval.exists){
            localApprovalRef.set({email: prospect.email})

            const prospectApprovalRef = users.doc(prospect.id).collection("approvals").doc(localUser.id)
            prospectApprovalRef.get().then((prospectApproval) => {
                if(prospectApproval.exists){
                    matches.add({
                        users: [localUser.id, prospect.id],
                        timestamp: serverTimestamp()
                    })
                }
            })
        }
    })
}

function addProspectRejectionToDB(){
    users.doc(localUser.id).collection("rejections").doc(prospect.id).set({email: prospect.email})
}

export {
    registerUser, loginUser, loadLocalUserData, getLocalUserData, loadProspectsData, getProspectsData,
    updateLocalUserInDB, addProspectApprovalToDB, addProspectRejectionToDB
}