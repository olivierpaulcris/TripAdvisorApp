import React from "react";
import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator
} from "react-navigation";
import { Icon } from "react-native-elements";

// Screens
import HomeScreen from "../screens/Home";
import TopFiveScreen from "../screens/TopFive";
import SearchScreen from "../screens/Search";

// Screens My Account
import MyAccountScreen from "../screens/MyAccount/MyAccount";
import RegisterScreen from "../screens/MyAccount/Register";
import LoginScreen from "../screens/MyAccount/Login";

const HomeScreenStack = createStackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Home"
        })
    }
});

const TopFiveScreenStack = createStackNavigator({
    TopFive: {
        screen: TopFiveScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Top 5 Restaurantes"
        })
    }
});

const SearchScreenStack = createStackNavigator({
    Search: {
        screen: SearchScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Buscar"
        })
    }
});

const MyAccountStack = createStackNavigator({
    MyAccount: {
        screen: MyAccountScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Mi Cuenta"
        })
    },
    Register: {
        screen: RegisterScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Registro"
        })
    },
    Login: {
        screen: LoginScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Login"
        })
    }
});

const RootStack = createBottomTabNavigator(
    {
        Home: {
            screen: HomeScreenStack,
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: "Home",
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name="compass-outline"
                        type="material-community"
                        size={22}
                        color={tintColor}
                    />
                )
            })
        },
        TopFive: {
            screen: TopFiveScreenStack,
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: "Top 5",
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name="star-outline"
                        type="material-community"
                        size={22}
                        color={tintColor}
                    />
                )
            })
        },
        Search: {
            screen: SearchScreenStack,
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: "Buscar",
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name="magnify"
                        type="material-community"
                        size={22}
                        color={tintColor}
                    />
                )
            })
        },
        MyAccount: {
            screen: MyAccountStack,
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: "Mi Cuenta",
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name="home-outline"
                        type="material-community"
                        size={22}
                        color={tintColor}
                    />
                )
            })
        }
    },
    {
        initialRouteName: "Home",
        order: ["Home", "TopFive", "Search", "MyAccount"],
        tabBarOptions: {
            inactiveTintColor: "#646464",
            activeTintColor: "#00a680"
        }
    }
);

export default createAppContainer(RootStack);
