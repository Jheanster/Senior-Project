import { validatePathConfig } from "@react-navigation/native"
import { docDB } from "./firebase"
import { calcProspectScore } from "./ProspectScoreService"
import { collection, getDoc, getDocs, query, where } from "firebase/compat/firestore"

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
        const qry = query(usersCol, where("country", "==", localUser.country), where("state", "==", localUser.state))
        const snapshot = await getDocs(qry)
        validProspects = []

        snapshot.foreach((otherUser) => {
            const score = calcProspectScore(localUser, otherUser)
            if(!isNaN(score)){
                otherUser.score = score
                validProspects.push(otherUser)
            }
        })

        validProspects.sort((user1, user2) => user2.score - user1.score)
        sortedProspects = validProspects
        return sortedProspects
    }else{
        console.warn("Don't load prospects before loading the local user")
    }
}

function getProspects(){
    return sortedProspects
}

export { loadLocalUser, getLocalUser, loadProspects, getProspects }