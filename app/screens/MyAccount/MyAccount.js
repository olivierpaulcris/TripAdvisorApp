import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as firebase from "firebase";
import MyAccountGuess from "../../components/MyAccount/MyAccountGuess";
import MyAccountUser from "../../components/MyAccount/MyAccountUser";

export default class MyAccount extends Component {
    constructor() {
        super();
        this.state = {
            login: false
        };
    }

    async componentDidMount() {
        await firebase.auth().onAuthStateChanged(user => {
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
    }

    goToScreen = nameScreen => {
        this.props.navigation.navigate(nameScreen);
    };

    logout = () => {
        console.log("cerrando sesión");
        firebase.auth().signOut();
    };

    render() {
        const { login } = this.state;

        if (login) {
            return <MyAccountUser />;
        } else {
            return <MyAccountGuess goToScreen={this.goToScreen} />;
        }
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        paddingLeft: 40,
        paddingRight: 40
    }
});
