import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button, Image } from "react-native-elements";

export default class MyAccountGuest extends Component {
    constructor(props) {
        super(props);
    }

    goToLogin = () => {
        this.props.navigation.navigate("Login");
    };

    render() {
        const { goToScreen } = this.props;

        return (
            <View style={styles.viewBody}>
                <Image
                    source={require("../../../assets/img/image-my-account-guest-01.jpg")}
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator />}
                    resizeMode="contain"
                />
                <Text style={styles.title}>
                    Consulta tu perfil de 5 tenedores
                </Text>
                <Text style={styles.description}>
                    Busca y visualiza los mejores restaurantes
                </Text>
                <Button
                    title="Ver tu perfil"
                    buttonStyle={styles.btnViewProfile}
                    onPress={() => goToScreen("Login")}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 30,
        paddingRight: 30
    },
    image: {
        height: 300,
        marginBottom: 40
    },
    title: {
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 10
    },
    description: {
        textAlign: "center",
        marginBottom: 20
    },
    btnViewProfile: {
        backgroundColor: "#00a680"
    }
});
