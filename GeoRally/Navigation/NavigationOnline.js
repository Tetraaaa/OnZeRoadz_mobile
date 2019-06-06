import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Color from "../Colors";
import Account from "../Components/Views/Account";
import Friends from "../Components/Views/Friends";
import Circuits from "../Components/Views/Circuits";
import MainScreen from '../Components/Views/MainScreen';
import PlayScreen from "../Components/Views/PlayScreen";
import Favorites from "../Components/Views/Favorites";
import Strings from '../Resources/i18n';


const MainScreenStackNavigator = createStackNavigator({
    MainScreen:
    {
        screen: MainScreen,
        navigationOptions: {
            header: null
        }
    },
    PlayScreen:
    {
        screen: PlayScreen,
        navigationOptions: {
            header: null
        }
    }
})

const AccountStackNavigator = createStackNavigator({
    Account:
    {
        screen: Account,
        navigationOptions: {
            header:null
        }
    },
    Favorites:
    {
        screen: Favorites,
        navigationOptions: {
            header: null
        }
    }

})

const MainStackNavigator = createMaterialBottomTabNavigator({
    MainScreen:
    {
        screen: MainScreenStackNavigator,
        navigationOptions: {
            tabBarLabel: Strings("navigation", "map"),
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
            tabBarLabel: Strings("navigation", "circuits"),
            tabBarIcon: (infos) =>
            {
                return <Icon color={infos.tintColor} name="user" size={18} />
            }
        }
    },
    Friends:
    {
        screen: AccountStackNavigator,
        navigationOptions: {
            tabBarLabel: Strings("navigation", "account"),
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