import docDB from "../../firebase"
import { collection, getDoc, getDocs, query, where } from "firebase/compat/firestore"

const usersCol = collection(docDB, "users")
var localUserDoc = null

async function loadLocalUserDoc(email){
    const qry = query(usersCol, where("email", "==", email))
    const snapshot = await getDoc(qry)
    if(snaphot.exists()){
        localUserDoc = snapshot.data()
    }else{
        console.log("WHUT DA HELLLLLL We couldn't find a user with the email'" + email + "' XDDDDD")
    }
}

function getLocalUserDoc(){
    return localUserDoc
}

export { loadLocalUserDoc, getLocalUserDoc }