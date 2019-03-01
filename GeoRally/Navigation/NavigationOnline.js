import React from 'react';
import Color from "../Colors";
import Icon from 'react-native-vector-icons/FontAwesome';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs"
import MainScreen from '../Views/MainScreen';
import Circuits from "../Views/Circuits";
import Friends from "../Views/Friends";
import PlayScreen from "../Views/PlayScreen";


const MainScreenStackNavigator = createStackNavigator({
    MainScreen:
    {
        screen: MainScreen,
        navigationOptions: {
            header:null
        }
    },
    PlayScreen:
    {
        screen: PlayScreen,
        navigationOptions: {
            header:null
        }
    }
})

const MainStackNavigator = createMaterialBottomTabNavigator({
    MainScreen:
    {
        screen: MainScreenStackNavigator,
        navigationOptions: {
            tabBarLabel: "Carte",
            tabBarIcon: (infos) =>
            {
                return <Icon color={infos.tintColor} name="map" size={18} />
            }
        }
    },
    Circuits:
    {
        screen: Circuits,
        navigationOptions: {
            tabBarLabel: "Mes circuits",
            tabBarIcon: (infos) =>
            {
                return <Icon color={infos.tintColor} name="user" size={18} />
            }
        }
    },
    Friends:
    {
        screen: Friends,
        navigationOptions: {
            tabBarLabel: "Mes amis",
            tabBarIcon: (infos) =>
            {
                return <Icon color={infos.tintColor} name="user" size={18} />
            }
        }
    },
},
    {
        initialRouteName: "MainScreen",
        activeTintColor: "rgba(255,255,255,1)",
        inactiveTintColor: "rgba(255,255,255,0.5)",
        barStyle: { backgroundColor: Color.primary }
    })

export default createAppContainer(MainStackNavigator)