import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";

export default class Restaurants extends Component {
    goToScreen = nameScreen => {
        this.props.navigation.navigate(nameScreen);
    };

    render() {
        return (
            <View style={styles.viewBody}>
                <Text>Restaurants Screen...</Text>
                <ActionButton
                    buttonColor="#00a680"
                    title="Add Restaurant"
                    onPress={() => this.goToScreen("AddRestaurant")}
                >
                    <Icon name="md-create" style={styles.actionButtonIcon} />
                </ActionButton>
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
    }
});
