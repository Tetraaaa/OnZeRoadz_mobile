import React from "react";
import { connect } from "react-redux"
import { View, Text, Image, TouchableOpacity } from "react-native";
import BetterPicker from "../BetterPicker";
import { StackActions, NavigationActions } from "react-navigation";
import Button from "../Button"
import Colors from "../../Colors";
import Strings from "../../Resources/i18n";

class Accounts extends React.Component
{

    _logout = () => 
    {
        let action = { type: "LOGOUT" };
        this.props.dispatch(action);

        const reset = StackActions.reset({
            key: null,
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        })
        this.props.navigation.dispatch(reset);
    }

    _changeLanguage = (lang) =>
    {
        let action = { type: "LANGUAGE", value: lang.id };
        this.props.dispatch(action)
    }

    render()
    {
        let items = [{ id: 'fr', value: "Français" }, { id: "en", value: "English" }];
        let privacy = [{ id: 0, value: Strings("account", "public") }, { id: 1, value: Strings("account", "friendsOnly") }, { id: 2, value: Strings("account", "private") }];
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ backgroundColor: Colors.primary, margin: 5, fontSize: 25, borderRadius: 3, color: 'rgba(255,255,255,1)', fontFamily: 'Billabong', textAlign: 'center', textAlignVertical: 'center' }}>{Strings("account", "account")}</Text>
                <View style={{ flex: 1, margin:5 }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ flex: 1, margin: 8, marginRight: 25 }}>
                            <Image style={{ width: 96, height: 96, margin: 5, borderRadius: 48 }} source={this.props.connectionReducer.lastConnectedUser.profilePicture ? { uri: this.props.connectionReducer.lastConnectedUser.profilePicture } : require("../../Resources/Images/user.png")} />
                        </View>
                        <View style={{ flex: 3, margin: 15 }}>
                            <Text style={{ color: "black", fontSize: 24, textAlign: "left" }}>{this.props.connectionReducer.lastConnectedUser.username}</Text>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <Text style={{ color: "black", fontSize: 16 }}>{this.props.connectionReducer.lastConnectedUser.firstname + " "}</Text>
                                <Text style={{ color: "black", fontSize: 16 }}>{this.props.connectionReducer.lastConnectedUser.lastname}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ flex: 1 }}>{"Inscrit depuis le " + this.props.connectionReducer.lastConnectedUser.creationDate}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, borderColor:Colors.primary, borderWidth:1, borderRadius:3, margin:5 }}>
                        <Text style={{ color: "black", textAlign: "left" }}>{this.props.connectionReducer.lastConnectedUser.description || Strings("account", "noDescription")}</Text>
                    </View>
                    <TouchableOpacity style={{ borderRadius: 3, backgroundColor: Colors.primary, padding: 8, elevation:4, margin:5 }} onPress={() => { this.props.navigation.navigate("Favorites") }}>
                        <Text style={{ color: "white", fontSize: 16 }}>{Strings("account", "favorites")}</Text>
                    </TouchableOpacity>
                    <View style={{flex:1}}>
                        <View style={{ flex: 1 }}>
                            <Text>{Strings("account", "language")}</Text>
                            <BetterPicker onValueChange={this._changeLanguage} style={{ flex: 1, margin: 5 }} keyMember="id" displayMember="value" selected={items.find(item => item.id === this.props.connectionReducer.locale)} items={items} title={Strings("account", "language")} />
                        </View>
                    </View>
                </View>

                <Button style={{ margin: 5 }} onPress={this._logout} color={Colors.secondary} title={Strings("account", "logout")} />
            </View>

        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(Accounts)