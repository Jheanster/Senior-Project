const GOOGLE_MAPS_API_KEY = "AIzaSyDumVQymOyGdL2cLDRjiq-9lO2kMRdEgTE"

const GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json"
const GEOCODING_PARAMS = "address={0}&key=" + GOOGLE_MAPS_API_KEY

const EARTH_RADIUS_MI = 3963.19

function assignCoordsFromAddress(user, onCompletionFunc){
    const streetAddress = user.address.replace(" ", "%20")
    const fullAddress = `${streetAddress}%20${user.city}%20${user.state}%20${user.country}`

    const http = new XMLHttpRequest()
    http.open("GET", GEOCODING_URL, true)

    http.onreadystatechange = function(){
        const success = this.readyState == 4 && this.status == 200

        if(success){
            geoData = JSON.parse(this.responseText);
            user.latitude = parseFloat(geoData.results.geometry.location.lat)
            user.longitude = parseFloat(geoData.results.geometry.location.lng)
        }else{
            user.latitude = NaN
            user.longitude = NaN
        }

        if(onCompletionFunc){
            onCompletionFunc(success)
        }
    };

    http.send(GEOCODING_PARAMS.format(fullAddress))
}

function degToRad(x){
    return x*Math.PI/180
}

function assignDistanceFromLocalUser(localUser, otherUser){
    latDiff = Math.abs(localUser.latitude - otherUser.latitude)
    longDiff = Math.abs(localUser.longitude - otherUser.longitude)
    latDist = degToRad(latDiff)*EARTH_RADIUS_MI
    longDist = degToRad(longDiff)*EARTH_RADIUS_MI
    otherUser.distance = Math.sqrt(Math.pow(latDist, 2) + Math.pow(longDist, 2))
}

export { assignCoordsFromAddress, assignDistanceFromLocalUser }