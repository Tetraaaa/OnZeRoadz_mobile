import React from 'react';
import { Text, View, Image } from "react-native";
import TextInput from "../../Components/TextInput";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../Colors';
import FetchRequest from "../../Tools/FetchRequest";
import Url from "../../Resources/Url";
import Button from "../Button"
import { connect } from 'react-redux'
import Strings from '../../Resources/i18n';

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
                    this._whoami();
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
                        }, 4500)
                    })
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
                        let action = { type: "LOGIN", value: json.user }
                        this.props.dispatch(action)
                        this.setState({
                            loading: false
                        })
                        this.props.navigation.navigate("MainScreen")
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

    render()
    {
        return (
            <View style={{ flex: 1 }}>


                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "15%" }}>
                    {
                        this.state.loading ?
                            <Image source={require("../../Resources/Images/loading.gif")} style={{ height: 96, width: 96 }} />
                            :
                            <Image source={require("../../Resources/Images/logo.png")} style={{ height: 128, width: 128 }} />
                    }

                </View>


                <TextInput onChangeText={(login) => this.setState({ login })} placeholder={Strings("login", "username")} />
                <TextInput onChangeText={(password) => this.setState({ password })} secureTextEntry={true} placeholder={Strings("login", "password")} />
                <Button title={Strings("login", "login")} onPress={this._login} color={Colors.secondaryDark} style={{ margin: 5 }} />
                <Text style={{ marginLeft: 5, marginTop: 15, fontSize: 16 }}>{Strings("login", "noAcc")}</Text>
                <Button title={Strings("login", "signup")} onPress={() => { this.props.navigation.navigate("Signup") }} color={Colors.secondaryLight} style={{ margin: 5 }} />
                {
                    this.state.errMess ?
                        <View style={{ alignItems: "center", justifyContent: "center", height: "15%" }}>
                            <Icon name="clear" size={32} color={Colors.error} />
                            <Text>{this.state.errMess}</Text>
                        </View>
                        :
                        null
                }
            </View>
        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(Login)
