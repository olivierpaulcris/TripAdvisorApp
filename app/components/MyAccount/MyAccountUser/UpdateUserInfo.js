import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ListItem } from "react-native-elements";
import OverlayOneInput from "../../Elements/OverlayOneInput";
import OverlayTwoInputs from "../../Elements/OverlayTwoInputs";

export default class UpdateUserInfo extends Component {
    constructor(props) {
        super(props);

        // console.log(state);

        this.state = {
            ...props,
            overlayComponent: null,
            menuItems: [
                {
                    title: "Cambiar nombre y apellidos",
                    iconType: "material-community",
                    iconNameRight: "chevron-right",
                    iconColorRight: "#ccc",
                    iconNameLeft: "account-circle",
                    iconColorLeft: "#ccc",
                    onPress: () =>
                        this.openOverlay(
                            "Nombre y apellidos",
                            this.updateUserDisplayName,
                            props.userInfo.displayName
                        )
                },
                {
                    title: "Cambiar email",
                    iconType: "material-community",
                    iconNameRight: "chevron-right",
                    iconColorRight: "#ccc",
                    iconNameLeft: "at",
                    iconColorLeft: "#ccc",
                    onPress: () =>
                        this.openOverlayTwoInputs(
                            "Email",
                            "Password",
                            props.userInfo.email,
                            this.updateUserEmail
                        )
                },
                {
                    title: "Cambiar password",
                    iconType: "material-community",
                    iconNameRight: "chevron-right",
                    iconColorRight: "#ccc",
                    iconNameLeft: "lock-reset",
                    iconColorLeft: "#ccc",
                    onPress: () => console.log("click en cambiar password")
                }
            ]
        };
        console.log(this.state);
    }

    updateUserDisplayName = async newDisplayName => {
        this.state.updateUserDisplayName(newDisplayName);

        this.setState({
            overlayComponent: null
        });
    };

    openOverlay = (placeholder, updateFunction, inputValue) => {
        this.setState({
            overlayComponent: (
                <OverlayOneInput
                    isVisibleOverlay={true}
                    placeholder={placeholder}
                    updateFunction={updateFunction}
                    inputValue={inputValue}
                />
            )
        });
    };

    updateUserEmail = async (newEmail, password) => {
        console.log("estamos en userInfo");
        const emailOld = this.props.userInfo.email;

        if (emailOld != newEmail) {
            this.state.updateUserEmail(newEmail, password);
        }

        this.setState({
            overlayComponent: null
        });
    };

    openOverlayTwoInputs = (
        placeholderOne,
        placeholderTwo,
        inputValueOne,
        updateFunction
    ) => {
        this.setState({
            overlayComponent: (
                <OverlayTwoInputs
                    isVisibleOverlay={true}
                    placeholderOne={placeholderOne}
                    placeholderTwo={placeholderTwo}
                    inputValueOne={inputValueOne}
                    inputValueTwo=""
                    isPassword={true}
                    updateFunction={updateFunction}
                />
            )
        });
    };

    render() {
        const { overlayComponent } = this.state;

        return (
            <View>
                {this.state.menuItems.map((item, index) => (
                    <ListItem
                        key={index}
                        title={item.title}
                        leftIcon={{
                            type: item.iconType,
                            name: item.iconNameLeft,
                            color: item.iconColorLeft
                        }}
                        rightIcon={{
                            type: item.iconType,
                            name: item.iconNameRight,
                            color: item.iconColorRight
                        }}
                        onPress={item.onPress}
                        containerStyle={styles.contentContainerStyle}
                    />
                ))}
                {overlayComponent}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contentContainerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3"
    }
});
