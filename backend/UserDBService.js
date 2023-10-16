import { docDB, fileDB } from "../firebase"
import { assignProspectScore } from "./ProspectScoreService"
import { assignDistanceFromLocalUser } from "./UserLocationService"
import { collection, doc, getDoc, getDocs, addDoc, setDoc, query, where } from "firebase/compat/firestore"

const MAX_DISTANCE_MI = 25
const PFP_STORAGE_PATH = "pfps/pfp-{0}.png"

const usersCol = collection(docDB, "users")
var localUser = null
var sortedProspects = null

async function loadLocalUser(email){
    const qry = query(usersCol, where("email", "==", email))
    const snapshot = await getDoc(qry)
    if(snapshot.exists()){
        localUser = snapshot.data()
        return localUser
    }else{
        console.warn("WHUT DA HELLLLLL We couldn't find a user with the email'" + email + "' XDDDDD")
        return null
    }
}

function getLocalUser(){
    return localUser
}

async function loadProspects(){
    if(localUser != null){
        const qry = query(
            usersCol,
            where("country", "==", localUser.country)
                .where("state", "==", localUser.state)
                .where("id", "!=", localUser.id)
        )

        const snapshot = await getDocs(qry)
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
        return sortedProspects
    }else{
        console.warn("Don't load prospects before loading the local user")
        return null
    }
}

function getProspects(){
    return sortedProspects
}

async function addLocalUserToDB(newData){
    localUser = await addDoc(usersCol, newData)
}

async function updateLocalUserInDB(newData){
    localUser = await setDoc(doc(docDB, "users", localUser.id), newData)
}

function getPFPRef(user){
    return fileDB.ref(PFP_STORAGE_PATH.format(user.id))
}

function uploadPFP(user, newPFPFile, onCompletionFunc){
    getPFPRef(user).put(newPFPFile).then(() => {
        if(onCompletionFunc){
            onCompletionFunc()
        }
    })
}

function downloadPFP(user, imageElement){
    imageElement.setAttribute("src", getPFPRef(user).getDownloadURL())
}

export {
    loadLocalUser, getLocalUser, loadProspects, getProspects,
    addLocalUserToDB, updateLocalUserInDB, uploadPFP, downloadPFP
}