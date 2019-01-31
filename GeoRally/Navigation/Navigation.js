import { createStackNavigator, createAppContainer } from 'react-navigation';
import Login from '../Views/Login';
import MainScreen from '../Views/MainScreen';

const MainStackNavigator = createStackNavigator({
    Login:
    {
        screen: Login,
        navigationOptions: {
            header:null
        }
    },
    MainScreen:
    {
        screen: MainScreen,
        navigationOptions: {
            header:null
        }
    }
})

export default createAppContainer(MainStackNavigator)