import React from 'react';
import { Text, View, ActivityIndicator } from "react-native";
import TextInput from "../../Components/TextInput";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../Colors';
import FetchRequest from "../../Tools/FetchRequest";
import Url from "../../Resources/Url";
import Button from "../Button"
import { connect } from 'react-redux'

class Login extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            login: "",
            password: "",
            loginFocused: false,
            passwordFocused: false,
            loading: false,
            errMess: ""
        }
        this.requests = [];
    }

    _login = () =>
    {
        this.setState({
            loading: true
        })
        let body = {
            username: this.state.login,
            password: this.state.password
        }
        let f = new FetchRequest(Url.login, "POST", JSON.stringify(body));
        this.requests.push(f);
        f.open().then(response =>
        {
            if (response.ok)
            {
                response.json().then(json =>
                {
                    this.setState({
                        loading: false
                    })
                    this.props.navigation.navigate("MainScreen")
                    let action = { type: "LOGIN", value: json.username }
                    this.props.dispatch(action)
                })
            }
            else
            {
                this.setState({
                    loading: false,
                    errMess: "Login ou mot de passe incorrect"
                }, () =>
                    {
                        setTimeout(() =>
                        {
                            this.setState({
                                errMess: ""
                            })
                        }, 1500)
                    })
            }
        })

    }

    render()
    {
        return (
            <View style={{ flex: 1 }}>
                {
                    this.state.loading ?
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height:"15%" }}>
                            <ActivityIndicator size="large" color={Colors.secondary} />
                        </View>
                        :
                        this.state.errMess ?
                            <View style={{alignItems: "center", justifyContent: "center", height:"15%" }}>
                                <Icon name="clear" size={32} color={Colors.error} />
                                <Text>{this.state.errMess}</Text>
                            </View>
                            :
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height:"15%" }}>
                                <Icon size={48} name="near-me" color={Colors.secondary} />
                                <Text style={{ fontSize: 48, textAlign: "center", color: Colors.secondary, fontFamily: "Billabong", marginTop: 5 }}>OnZeRoadz</Text>
                            </View>

                }
                <TextInput onChangeText={(login) => this.setState({ login })} placeholder="Login" />
                <TextInput onChangeText={(password) => this.setState({ password })} secureTextEntry={true} placeholder="Mot de passe" />
                <Button title="Connexion" onPress={this._login} color={Colors.secondaryDark} style={{ margin: 5 }} />
                <Text style={{ marginLeft: 5, marginTop: 15, fontSize: 16, color: "black" }}>Pas de compte ?</Text>
                <Button title="S'inscrire" onPress={() => { this.props.navigation.navigate("Signup") }} color={Colors.secondaryLight} style={{ margin: 5 }} />
            </View>
        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(Login)
