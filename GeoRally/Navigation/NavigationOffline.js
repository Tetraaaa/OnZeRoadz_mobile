import React from 'react';
import Color from "../Colors";
import Icon from 'react-native-vector-icons/FontAwesome';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs"
import Login from '../Views/Login';
import MainScreen from '../Views/MainScreen';
import Signup from "../Views/Signup";

const SigninSignupStackNavigator = createStackNavigator({
    Login:{
        screen:Login,
        navigationOptions:{
            header:null
        }
    },
    Signup:{
        screen:Signup,
        navigationOptions:{
            header:null
        }
    }
})

const MainStackNavigator = createMaterialBottomTabNavigator({
    MainScreen:
    {
        screen: MainScreen,
        navigationOptions: {
            tabBarLabel: "Carte",
            tabBarIcon: (infos) =>
            {
                return <Icon color={infos.tintColor} name="map" size={18} />
            }
        }
    },
    Login:
    {
        screen: SigninSignupStackNavigator,
        navigationOptions: {
            tabBarLabel: "Connexion/Inscription",
            tabBarIcon: (infos) =>
            {
                return <Icon color={infos.tintColor} name="user" size={18} />
            }
        }
    }
},
    {
        initialRouteName: "MainScreen",
        activeTintColor: "rgba(255,255,255,1)",
        inactiveTintColor: "rgba(255,255,255,0.5)",
        barStyle: { backgroundColor: Color.primary }
    })

export default createAppContainer(MainStackNavigator)