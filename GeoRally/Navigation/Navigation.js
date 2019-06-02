import React from "react";
import { PermissionsAndroid, Text, View, Image } from "react-native";
import NavigationOffline from "../Navigation/NavigationOffline";
import NavigationOnline from "../Navigation/NavigationOnline";
import { connect } from 'react-redux'
import FetchRequest from "../Tools/FetchRequest";
import Url from "../Resources/Url";
import Colors from "../Colors";
import Strings from "../Resources/i18n";
import ActivityIndicator from "../Components/ActivityIndicator";

class Navigation extends React.Component
{

    constructor(props)
    {
        super(props)
        this.state = {
            permissionsAsked: false,
            permissionsGranted: false
        }
    }

    componentDidMount()
    {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS["ACCESS_FINE_LOCATION"])
            .then(granted =>
            {
                if (granted === "granted")
                {
                    this.setState({
                        permissionsAsked: true,
                        permissionsGranted: true
                    })
                    navigator.geolocation.getCurrentPosition(
                        (position) =>
                        {
                            let northeast = {
                                latitude: position.coords.latitude + 0.005 / 2,
                                longitude: position.coords.longitude + 0.005 / 2,
                            };
                            let southwest = {
                                latitude: position.coords.latitude - 0.005 / 2,
                                longitude: position.coords.longitude - 0.005 / 2,
                            };


                            this._fetchCircuits(northeast, southwest);
                            this._whoami();
                            this._fetchMyCircuits();
                        }
                    );
                }
                else
                {
                    this.setState({
                        permissionsAsked: true,
                        permissionsGranted: false
                    })
                }
            })
    }

    _whoami = () =>
    {
        if (!this.props.connectionReducer.lastConnectedUser) return;

        new FetchRequest(Url.whoami).open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json().then(json =>
                    {
                        let action = { type: "LOGIN", value: json.user }
                        this.props.dispatch(action)
                    })
                }
                else
                {
                    let action = { type: "LOGOUT" }
                    this.props.dispatch(action)
                }
            })
            .catch(error =>
            {
                let action = { type: "LOGOUT" }
                this.props.dispatch(action)
            })
    }

    _fetchCircuits = (northeast, southwest) =>
    {
        let body = {
            "NElongitude": northeast.longitude,
            "NElatitude": northeast.latitude,
            "SOlongitude": southwest.longitude,
            "SOlatitude": southwest.latitude,
        }
        new FetchRequest(Url.publishedCircuits, "POST", JSON.stringify(body)).open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json().then(json =>
                    {
                        let action = { type: "SET_CIRCUITS", value: json }
                        this.props.dispatch(action)
                    })
                }
            })
    }

    _fetchMyCircuits = () =>
    {
        this.setState({ isLoadingCircuits: true })
        let f = new FetchRequest(Url.myCircuits);
        f.open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json()
                        .then(json =>
                        {
                            let action = { type: "SET_MY_CIRCUITS", value: json };
                            this.props.dispatch(action);
                        });
                }
                else
                {
                    throw new Error("Erreur lors de la récupération des circuits de l'utilisateur")
                }
            })
            .catch(error =>
            {
                throw new Error("Erreur lors de la récupération des circuits de l'utilisateur")
            })
    }



    render()
    {
        if (!this.state.permissionsAsked)
        {
            return <View><ActivityIndicator/></View>
        }
        else if (!this.state.permissionsGranted)
        {
            return (
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                    <Image style={{ width: 64, height: 64, margin: 5 }} source={require("../Resources/Images/sad.png")} />
                    <Text style={{ textAlign: "center", color: "black", fontSize: 16 }}>{Strings("init", "allow")}</Text>
                </View>
            )
        }
        else
        {
            return (
                this.props.connectionReducer.connected ? <NavigationOnline /> : <NavigationOffline />
            )
        }

    }
}



const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(Navigation)