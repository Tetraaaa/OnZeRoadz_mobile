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
        
    }

    render()
    {
        return (
            <View style={{flex:1}}>
                <Text style={{fontSize:32, textAlign:"center", color:'black'}}>GeoRally</Text>
                <TextInput onChange={(login) => this.setState({login})}  placeholder="Login"/>
                <TextInput onChange={(password) => this.setState({password})} secureTextEntry={true} placeholder="Mot de passe"/>
                <Button title="Connexion" style={{margin:5}} onPress={this._login}/>
                <Text>Pas de compte ?</Text>
                <Button title="S'inscrire" style={{margin:5}} onPress={() => {this.props.navigation.navigate("Signup")}}/>
            </View>
        );
    }
}

export default Login;