let test = "http://51.77.244.23:8001/index.php/"


let domain = test;

export default URL = {
    signup:domain + "signup",
    login:domain + "login",
    whoami:domain + "whoami",
    googlePlaces:"https://maps.googleapis.com/maps/api/place/details/json?&placeid=",
    googleAutocompletion:"https://maps.googleapis.com/maps/api/place/autocomplete/json?&input="
}