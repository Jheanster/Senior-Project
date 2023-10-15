import { docDB } from "../firebase"
import { assignProspectScore } from "./ProspectScoreService"
import { assignDistanceFromLocalUser } from "./UserLocationService"
import { collection, doc, getDoc, getDocs, addDoc, setDoc, query, where } from "firebase/compat/firestore"

const MAX_DISTANCE_MI = 25

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
        console.log("WHUT DA HELLLLLL We couldn't find a user with the email'" + email + "' XDDDDD")
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

        validProspects.sort((user1, user2) => user2.score - user1.score)
        sortedProspects = validProspects
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

export { loadLocalUser, getLocalUser, loadProspects, getProspects, addLocalUserToDB, updateLocalUserInDB }