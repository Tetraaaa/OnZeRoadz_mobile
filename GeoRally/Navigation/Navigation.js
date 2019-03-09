import React from "react";
import { PermissionsAndroid, Text, View } from "react-native";
import NavigationOffline from "../Navigation/NavigationOffline";
import NavigationOnline from "../Navigation/NavigationOnline";
import { connect } from 'react-redux'
import FetchRequest from "../Tools/FetchRequest";
import Url from "../Resources/Url";

class Navigation extends React.Component
{

    constructor(props)
    {
        super(props)
        this.permissionsGranted = false;
    }

    componentDidMount()
    {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS["ACCESS_FINE_LOCATION"])
            .then(granted =>
            {
                if (granted === "granted")
                {
                    this.permissionsGranted = true;
                    this._whoami();
                    this._fetchCircuits();
                }
                else
                {
                    this.permissionsGranted = false;
                }
            })
    }

    _whoami = () =>
    {
        new FetchRequest(Url.whoami).open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json().then(json =>
                    {
                        let action = { type: "LOGIN", value: json.username }
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

    _fetchCircuits = () =>
    {
        new FetchRequest(Url.publishedCircuits).open()
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



    render()
    {
        if (!this.permissionsGranted)
        {
            return (<View style={{alignItems:"center", justifyContent:"center"}}><Text style={{textAlign:"center"}}>Merci d'autoriser l'application à accéder à votre géolocalisation afin de pouvoir l'utiliser.</Text></View>)
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