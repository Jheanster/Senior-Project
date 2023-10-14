import { docDB } from "./firebase"
import { calcProspectScore } from "./ProspectScoreService"
import { collection, getDoc, getDocs, query, where } from "firebase/compat/firestore"

const usersCol = collection(docDB, "users")
var localUser = null

async function loadLocalUser(email){
    const qry = query(usersCol, where("email", "==", email))
    const snapshot = await getDoc(qry)
    if(snaphot.exists()){
        localUser = snapshot.data()
    }else{
        console.log("WHUT DA HELLLLLL We couldn't find a user with the email'" + email + "' XDDDDD")
    }
}

function getLocalUser(){
    return localUser
}

async function loadAndGetProspects(){
    if(localUser != null){
        const qry = query(usersCol, where("country", "==", localUser.country))
        const snapshot = await getDocs(qry)
        validProspects = []

        snapshot.foreach((otherUser) => {
            const score = calcProspectScore(localUser, otherUser)
            if(!isNaN(score)){
                otherUser.score = score
                validProspects.push(otherUser)
            }
        })
    }else{
        console.log("Don't load prospects before loading the local user")
    }
}

export { loadLocalUser, getLocalUser }