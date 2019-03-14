import React from 'react';
import { Text, View, Button} from "react-native";
import TextInput from "../Components/TextInput";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Colors';
import FetchRequest from "../Tools/FetchRequest";
import Url from "../Resources/Url";
import { connect } from 'react-redux'

class Login extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            login: "",
            password: "",
            loginFocused:false,
            passwordFocused:false
        }
        this.requests = [];
    }

    _login = () =>
    {
        let body = {
            username:this.state.login,
            password:this.state.password
        }
        let f = new FetchRequest(Url.login, "POST", JSON.stringify(body));
        this.requests.push(f);
        f.open().then(response => {
            if(response.ok)
            {
                response.json().then(json => {
                    this.props.navigation.navigate("MainScreen")
                    let action = {type:"LOGIN", value:json.username}
                    this.props.dispatch(action)
                })
            }
            else
            {

            }
        })

    }

    render()
    {
        return (
            <View style={{ flex: 1 }}>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={48} name="near-me" color={Colors.secondary} />
                    <Text style={{ fontSize: 48, textAlign: "center", color: Colors.secondary, fontFamily: "Billabong" }}>OnZeRoadz</Text>
                </View>

                <TextInput onChangeText={(login) => this.setState({ login })} placeholder="Login" />
                <TextInput onChangeText={(password) => this.setState({ password })} secureTextEntry={true} placeholder="Mot de passe" />
                <Button title="Connexion" style={{ margin: 5 }} onPress={this._login} color={Colors.secondaryDark}/>
                <Text>Pas de compte ?</Text>
                <Button title="S'inscrire" style={{ margin: 5 }} onPress={() => { this.props.navigation.navigate("Signup") }} color={Colors.secondaryLight}/>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return state
  }
  
  export default connect(mapStateToProps)(Login)
