import React from "react";
import { connect } from "react-redux"
import { View, Text, Picker } from "react-native";
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
        let action = {type:"LANGUAGE", value:lang.id};
        this.props.dispatch(action)
    }

    render()
    {
        let items = [{id:'fr', value:"Français"}, {id:"en", value:"English"}]
        return (
            <View style={{flex:1}}>
                <Text style={{ backgroundColor: Colors.primary, margin: 5, fontSize: 25, borderRadius: 3, color: 'rgba(255,255,255,1)', fontFamily: 'Billabong', textAlign: 'center', textAlignVertical: 'center' }}>{Strings("account", "account")}</Text>
                <View style={{flex: 1, flexDirection:"row", alignItems:"center"}}>
                    <Text>{Strings("account", "language")}</Text>
                    <BetterPicker onValueChange={this._changeLanguage} style={{flex:1, margin: 5}} keyMember="id" displayMember="value" selected={items.find(item => item.id === this.props.connectionReducer.locale)} items={items} title={Strings("account", "language")}/>
                </View>
                <Button style={{margin:5}} onPress={this._logout} color={Colors.secondary} title={Strings("account", "logout")} />
            </View>

        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(Accounts)