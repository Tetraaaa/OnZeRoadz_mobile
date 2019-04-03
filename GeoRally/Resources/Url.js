let test = "https://www.api.onzeroadz.fr/index.php/"


let domain = test;
let circuit = domain + "circuit/"
let user = domain + "user/"

export default URL = {
    signup:domain + "signup",
    login:domain + "login",
    whoami:domain + "whoami",
    circuit:circuit,
    checkCircuitsVersion: circuit+'checkVersion',
    filterCircuits:circuit + "published",
    publishedCircuits:circuit + "published/area",
    myCircuits: user+"myCircuits",
    updateProgress: circuit+"{idCircuit}/progress/",
    googlePlaces:"https://maps.googleapis.com/maps/api/place/details/json?&placeid=",
    googleAutocompletion:"https://maps.googleapis.com/maps/api/place/autocomplete/json?&input="
}