import React from 'react';
import {Text, View, Button, ActivityIndicator, TextInput} from "react-native";

class Login extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            login:"",
            password:""
        }
    }

    _login = () =>
    {
        this.props.navigation.navigate("MainScreen")
    }

    render()
    {
        return (
            <View style={{flex:1}}>
                <Text style={{fontSize:32, textAlign:"center", color:'black'}}>GeoRally</Text>
                <TextInput onChange={(login) => this.setState({login})}  placeholder="Login"/>
                <TextInput onChange={(password) => this.setState({password})} secureTextEntry={true} placeholder="Mot de passe"/>
                <Button title="Connexion" style={{margin:5}} onPress={this._login}/>
            </View>
        );
    }
}

export default Login;