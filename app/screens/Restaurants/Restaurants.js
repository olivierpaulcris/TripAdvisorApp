import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    ActivityIndicator
} from "react-native";
import Image from "react-native-elements";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
// import * as firebase from "firebase";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class Restaurants extends Component {
    constructor() {
        super();

        this.state = {
            login: false,
            restaurants: null,
            startRestaurants: null,
            limitRestaurants: 2,
            isLoading: true
        };
    }

    componentDidMount() {
        this.checkLogin();
        this.loadRestaurants();
    }

    checkLogin = () => {
        console.log("check in correcto");

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    login: true
                });
            } else {
                this.setState({
                    login: false
                });
            }
        });
    };

    loadActionButton = () => {
        const { login } = this.state;

        if (login) {
            return (
                <ActionButton
                    buttonColor="#00a680"
                    title="Add Restaurant"
                    onPress={() => this.goToScreen("AddRestaurant")}
                >
                    <Icon name="md-create" style={styles.actionButtonIcon} />
                </ActionButton>
            );
        }

        return null;
    };

    loadRestaurants = async () => {
        const { limitRestaurants } = this.state;
        let resultRestaurants = [];

        const restaurants = db
            .collection("restaurants")
            .limit(limitRestaurants);
        // .orderBy("createAt", "desc")

        await restaurants.get().then(response => {
            this.setState({
                startRestaurants: response.docs[response.docs.length - 1]
            });

            response.forEach(doc => {
                let restaurant = doc.data();
                restaurant.id = doc.id;
                resultRestaurants.push({ restaurant });
            });

            this.setState({
                restaurants: resultRestaurants
            });
        });

        // console.log(this.state.restaurants);
    };

    goToScreen = nameScreen => {
        this.props.navigation.navigate(nameScreen);
    };

    renderFlatList = restaurants => {
        console.log(restaurants);

        // const { restaurants } = this.state;

        if (restaurants) {
            return <FlatList data={restaurants} />;
        } else {
            return (
                <View style={styles.startLoadRestaurants}>
                    <ActivityIndicator size="large" />
                    <Text>Cargando restaurantes...</Text>
                </View>
            );
        }
    };

    render() {
        const { restaurants } = this.state;

        return (
            <View style={styles.viewBody}>
                {this.renderFlatList(restaurants)}
                {this.loadActionButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff"
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: "white"
    },
    startLoadRestaurants: {
        marginTop: 20,
        alignItems: "center"
    }
});
