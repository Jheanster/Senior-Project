import { docDB, fileDB } from "../firebase"
import { assignProspectScore } from "./ProspectScoreService"
import { assignDistanceFromLocalUser } from "./UserLocationService"

const MAX_DISTANCE_MI = 25
const PFP_STORAGE_PATH = "pfps/pfp-{0}.png"

const usersCol = docDB.collection("users")
var localUser = null
var sortedProspects = null

function loadLocalUserData(email, onCompletionFunc){
    usersCol.where("email", "==", email).get().then((snapshot) => {
        if(snapshot.size == 1){
            localUser = snapshot.docs[0]

            if(onCompletionFunc){
                onCompletionFunc()
            }
        }else if(snapshot.size > 1){
            console.warn("WHUT DA HELLLLLL There are multiple users with the email '" + email + "' XDDDDD")
        }else{
            console.warn("WHUT DA HELLLLLL We couldn't find a user with the email '" + email + "' XDDDDD")
        }
    })
}

function getLocalUserData(){
    return localUser
}

function loadProspectsData(onCompletionFunc){
    if(localUser != null){
        usersCol.where("country", "==", localUser.country)
            .where("state", "==", localUser.state)
            .where("id", "!=", localUser.id).get().then((snapshot) => {
                const validProspects = []

                snapshot.foreach((otherUser) => {
                    assignDistanceFromLocalUser(localUser, otherUser)
        
                    if(otherUser.distance <= MAX_DISTANCE_MI){
                        assignProspectScore(localUser, otherUser)
                        
                        if(!isNaN(otherUser.score)){
                            validProspects.push(otherUser)
                        }
                    }
                })
        
                sortedProspects = validProspects.sort((user1, user2) => user2.score - user1.score)

                if(onCompletionFunc){
                    onCompletionFunc()
                }
            })
    }else{
        console.warn("Don't load prospects before loading the local user")
    }
}

function getProspectsData(){
    return sortedProspects
}

function addLocalUserToDB(newData){
    localUser = newData
    usersCol.add(newData)
}

function updateLocalUserInDB(newData){
    for(let field in newData){
        localUser[field] = newData[field]
    }
    usersCol.doc(localUser.id).update(newData)
}

function getPFPRef(user){
    return fileDB.ref(PFP_STORAGE_PATH.format(user.id))
}

function uploadLocalUserPFP(newPFPFile, onCompletionFunc){
    getPFPRef(localUser).put(newPFPFile).then(() => {
        if(onCompletionFunc){
            onCompletionFunc()
        }
    })
}

function downloadPFPToImage(user, imageElement){
    imageElement.setAttribute("src", getPFPRef(user).getDownloadURL())
}

export {
    loadLocalUserData, getLocalUserData, loadProspectsData, getProspectsData,
    addLocalUserToDB, updateLocalUserInDB, uploadLocalUserPFP, downloadPFPToImage
}