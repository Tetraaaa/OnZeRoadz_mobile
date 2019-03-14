import React from "react";
import { View, Text, ScrollView, ActivityIndicator, Animated, TouchableOpacity } from "react-native";
import TextInput from "../../Components/TextInput";
import Colors from "../../Colors";
import FetchRequest from "../../Tools/FetchRequest";
import Url from "../../Resources/Url";
import Icon from 'react-native-vector-icons/MaterialIcons';

class Signup extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            currentStep: 0,
            firstname: "",
            lastname: "",
            email: "",
            password1: "",
            password2: "",
            username: "",
            fadeAnimation: new Animated.Value(1),
            errMess:""
        }
        this.requests = [];
    }

    _signup = () =>
    {
        Animated.timing(this.state.fadeAnimation, { toValue: 0, duration: 300 }).start(() =>
        {
            this.setState({ currentStep: this.state.currentStep + 1 }, () =>
            {
                Animated.timing(this.state.fadeAnimation, { toValue: 1, duration: 300 }).start()
            })
        })

        let body = {
            username: this.state.username,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            password: this.state.password1,
            email: this.state.email
        }
        let f = new FetchRequest(Url.signup, "POST", JSON.stringify(body));
        this.requests.push(f);
        f.open()
            .then(response =>
            {
                if (response.ok)
                {
                    this.props.navigation.navigate("Login")
                }
                else
                {
                    this.setState({ errMess:"Une erreur est survenue"})
                }
            })
            .catch(error => {
                this.setState({ errMess:"Une erreur est survenue"})
            })
    }

    _nextStep = () =>
    {
        if (this.state.currentStep < 3)
        {
            Animated.timing(this.state.fadeAnimation, { toValue: 0, duration: 300 }).start(() =>
            {
                this.setState({ currentStep: this.state.currentStep + 1 }, () =>
                {
                    Animated.timing(this.state.fadeAnimation, { toValue: 1, duration: 300 }).start()
                })
            })
        }
    }

    _previousStep = () =>
    {
        if (this.state.currentStep > 0)
        {
            Animated.timing(this.state.fadeAnimation, { toValue: 0, duration: 300 }).start(() =>
            {
                this.setState({ currentStep: this.state.currentStep - 1 }, () =>
                {
                    Animated.timing(this.state.fadeAnimation, { toValue: 1, duration: 300 }).start()
                })
            })
        }
    }

    render()
    {
        return (
            <ScrollView style={{ flex: 1 }} behavior={"position"} keyboardShouldPersistTaps={"handled"}>
                <Text style={{ fontSize: 48, textAlign: "center", color: Colors.secondary, fontFamily: "Billabong" }}>Inscription</Text>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1, margin: 5, alignItems: "flex-start" }}>
                        <TouchableOpacity style={{ backgroundColor: Colors.secondary, margin: 5, borderRadius: 3 }} onPress={this._previousStep}>
                            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", padding: 8 }}>{this.state.currentStep >= 2 ? "PRÉCÉDENT" : "PRÉCÉDENT"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, margin: 5, alignItems: "flex-end" }}>
                        <TouchableOpacity style={{ backgroundColor: Colors.secondary, margin: 5, borderRadius: 3 }} onPress={this.state.currentStep >= 2 ? this._signup : this._nextStep}>
                            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", padding: 8 }}>{this.state.currentStep >= 2 ? "TERMINÉ" : "SUIVANT"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {
                    this.state.currentStep === 0 ?
                        <Animated.View style={{ opacity: this.state.fadeAnimation }}>
                            <TextInput onChangeText={(firstname) => this.setState({ firstname })} placeholder="Prénom" />
                            <TextInput onChangeText={(lastname) => this.setState({ lastname })} placeholder="Nom" />
                        </Animated.View>
                        :
                        this.state.currentStep === 1 ?
                            <Animated.View style={{ opacity: this.state.fadeAnimation }}>
                                <TextInput onChangeText={(email) => this.setState({ email })} placeholder="Adresse email" />
                                <TextInput onChangeText={(password1) => this.setState({ password1 })} secureTextEntry={true} placeholder="Mot de passe" />
                                <TextInput onChangeText={(password2) => this.setState({ password2 })} secureTextEntry={true} placeholder="Répéter le mot de passe" />
                            </Animated.View>
                            :
                            this.state.currentStep === 2 ?
                                <Animated.View style={{ opacity: this.state.fadeAnimation }}>
                                    <TextInput onChangeText={(username) => this.setState({ username })} placeholder="Nom d'utilisateur" />
                                </Animated.View>
                                :
                                this.state.errMess ?
                                    <Animated.View style={{ opacity: this.state.fadeAnimation }}>
                                        <Icon name="clear" size={32} color={Colors.error}/>
                                        <Text>{this.state.errMess}</Text>
                                    </Animated.View>
                                    :
                                    <Animated.View style={{ opacity: this.state.fadeAnimation }}>
                                        <ActivityIndicator size="large" color={Colors.primary} />
                                    </Animated.View>
                }

            </ScrollView>
        )
    }
}

export default Signup;