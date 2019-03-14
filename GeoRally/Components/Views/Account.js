import React from "react";
import {connect} from "react-redux"
import { View, Text, Button } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import Colors from "../../Colors";

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

    render()
    {
        return (
            <View>
                <Text style={{ backgroundColor: Colors.primary, margin: 5, fontSize: 25, borderRadius: 3, color: 'rgba(255,255,255,1)', fontFamily: 'Billabong', textAlign: 'center', textAlignVertical: 'center' }}>Mon compte</Text>
                <Button onPress={this._logout} color={Colors.secondary} title="Déconnexion" />
            </View>
            
        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(Accounts)