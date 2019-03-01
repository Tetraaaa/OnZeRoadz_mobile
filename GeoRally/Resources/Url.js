let test = "https://www.api.onzeroadz.fr/index.php/"


let domain = test;
let circuit = domain + "circuit/"

export default URL = {
    signup:domain + "signup",
    login:domain + "login",
    whoami:domain + "whoami",
    circuit:circuit,
    publishedCircuits:circuit + "published",
    googlePlaces:"https://maps.googleapis.com/maps/api/place/details/json?&placeid=",
    googleAutocompletion:"https://maps.googleapis.com/maps/api/place/autocomplete/json?&input="
}