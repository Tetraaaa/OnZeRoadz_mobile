import React from "react";
import { PermissionsAndroid, Text, View, Image, ActivityIndicator } from "react-native";
import NavigationOffline from "../Navigation/NavigationOffline";
import NavigationOnline from "../Navigation/NavigationOnline";
import { connect } from 'react-redux'
import FetchRequest from "../Tools/FetchRequest";
import Url from "../Resources/Url";
import Colors from "../Colors";

class Navigation extends React.Component
{

    constructor(props)
    {
        super(props)
        this.state = {
            permissionsAsked:false,
            permissionsGranted:false
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
                        permissionsAsked:true,
                        permissionsGranted:true
                    })
                    this._whoami();
                    this._fetchCircuits();
                }
                else
                {
                    this.setState({
                        permissionsAsked:true,
                        permissionsGranted:false
                    })
                }
            })
    }

    _whoami = () =>
    {
        if(!this.props.connectionReducer.lastConnectedUser) return;
        
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
        if(!this.state.permissionsAsked)
        {
            return <View>
                <ActivityIndicator color={Colors.primary} size="large"/>
            </View>;
        }
        else if (!this.state.permissionsGranted)
        {
            return (
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                    <Image style={{width:64, height:64, margin:5}} source={require("../Resources/Images/sad.png")}/>
                    <Text style={{ textAlign: "center", color: "black", fontSize: 16 }}>Merci d'autoriser l'application à accéder à votre géolocalisation afin de pouvoir l'utiliser.</Text>
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