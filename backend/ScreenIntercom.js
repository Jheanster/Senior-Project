import { serverTimestamp } from "@firebase/firestore";

let homeScreenUpdater = null

function setHomeScreenUpdater(func){
    homeScreenUpdater = func
}

function updateHomeScreen(){
    if(homeScreenUpdater){
        homeScreenUpdater(serverTimestamp())
    }else{
        console.error("Home screen updater not set")
    }
}

export {
    setHomeScreenUpdater, updateHomeScreen
}