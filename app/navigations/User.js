import React from "react";
import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator
} from "react-navigation";
import { Icon } from "react-native-elements";

// Screens
import TopFiveScreen from "../screens/TopFive";
import SearchScreen from "../screens/Search";

// Screens My Account
import MyAccountScreen from "../screens/MyAccount/MyAccount";
import RegisterScreen from "../screens/MyAccount/Register";
import LoginScreen from "../screens/MyAccount/Login";

// Restaurants
import RestaurantsScreen from "../screens/Restaurants/Restaurants";
import AddRestaurantScreen from "../screens/Restaurants/AddRestaurant";

const RestaurantsScreenStack = createStackNavigator({
    Restaurants: {
        screen: RestaurantsScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Home"
        })
    },
    AddRestaurant: {
        screen: AddRestaurantScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Nuevo Restaurante"
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
        Restaurants: {
            screen: RestaurantsScreenStack,
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
        initialRouteName: "Restaurants",
        order: ["Restaurants", "TopFive", "Search", "MyAccount"],
        tabBarOptions: {
            inactiveTintColor: "#646464",
            activeTintColor: "#00a680"
        }
    }
);

export default createAppContainer(RootStack);
