import { auth, docDB, fileDB } from "../firebase"
import { assignProspectScore } from "./ProspectScoreService"
import { assignDistanceFromLocalUser } from "./UserLocationService"

const MAX_DISTANCE_MI = 25

const users = docDB.collection("users")

var localUser = null
var sortedProspects = null

function getUserDataFromDoc(userDoc) {
    const userData = userDoc.data()
    userData.id = userDoc.id
    return userData
}

function loadLocalUserData(email, onCompletionFunc){
    users.where("email", "==", email).get().then((snapshot) => {
        if(snapshot.size === 1) {
            localUser = getUserDataFromDoc(snapshot.docs[0])
            assignPFP(localUser, () => {
                if(onCompletionFunc){
                    onCompletionFunc()
                }
            })
        } else if (snapshot.size > 1) {
            console.warn("Error: There are multiple users with the email: '" + email + "'")
        } else {
            console.warn("Error: We couldn't find a user with the email: '" + email + "'")
        }
    })
}

function getLocalUserData(){
    return localUser
}

function loadProspectsData(onCompletionFunc){
    if(localUser != null) {
        users.where("country", "==", localUser.country)
            .where("state", "==", localUser.state).get().then((snapshot) => {
                const validProspects = []

                snapshot.forEach((otherUserDoc) => {
                    const otherUser = getUserDataFromDoc(otherUserDoc)
                    assignDistanceFromLocalUser(localUser, otherUser)

                    if(otherUser.distance <= MAX_DISTANCE_MI) {
                        assignProspectScore(localUser, otherUser)

                        if(!isNaN(otherUser.score)) {
                            validProspects.push(otherUser)
                        }
                    }
                })
        
                sortedProspects = validProspects.sort((user1, user2) => user2.score - user1.score)

                let numPFPsLoaded = 0
                sortedProspects.forEach((prospect) => {
                    assignPFP(prospect, () => {
                        numPFPsLoaded++
                        if (numPFPsLoaded === sortedProspects.length && onCompletionFunc){
                            onCompletionFunc()
                        }
                    })
                })
            })
    } else {
        console.warn("Error: Trying to load prospects before loading the local user")
    }
}

function getProspectsData(){
    return sortedProspects
}

// Takes in a JSON from LoginScreen.js handleSignUp()
function registerUser(newData){
    return auth.createUserWithEmailAndPassword(newData.email, newData.password)
}

// Takes in a JSON from LoginScreen.js handleLogin()
function loginUser(data) {
    return auth.signInWithEmailAndPassword(data.email, data.password)
}

function updateLocalUserInDB(newData){
    for (let field in newData) {
        localUser[field] = newData[field]
    }
    users.doc(localUser.id).update(newData)
}

function getPFPRef(user){
    return fileDB.ref("pfps/pfp-" + user.id + ".png")
}

function uploadLocalUserPFP(newPFPFile, onCompletionFunc){
    getPFPRef(localUser).put(newPFPFile).then(() => {
        if(onCompletionFunc){
            onCompletionFunc()
        }
    })
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

export {
    loadLocalUserData, getLocalUserData, loadProspectsData, getProspectsData,
    registerUser, updateLocalUserInDB, uploadLocalUserPFP, loginUser
}