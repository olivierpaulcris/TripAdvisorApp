import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar } from "react-native-elements";
import * as firebase from "firebase";
import UpdateUserInfo from "./UpdateUserInfo";

export default class UserInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props,
            userInfo: {}
        };
    }

    componentDidMount = async () => {
        await this.getUserInfo();
    };

    getUserInfo = () => {
        const user = firebase.auth().currentUser;

        user.providerData.forEach(userInfo => {
            this.setState({
                userInfo: userInfo
            });
        });
    };

    reauthenticate = currentPassword => {
        const user = firebase.auth().currentUser;
        const credentials = firebase
            .auth()
            .EmailAuthProvider.credentials(user.email, currentPassword);

        return user.reauthenticateWithCredential(credentials);
    };

    checkUserAvatar = photoURL => {
        return photoURL
            ? photoURL
            : "https://api.adorable.io/avatars/285/abott@adorable.png";
    };

    updateUserDisplayName = async newDisplayName => {
        const update = {
            displayName: newDisplayName
        };

        await firebase.auth().currentUser.updateProfile(update);

        this.getUserInfo();
    };

    updateUserEmail = async (newEmail, password) => {
        this.reauthenticate(password)
            .then(() => {
                const user = firebase.auth().currentUser;
                user.updateEmail(newEmail)
                    .then(() => {
                        console.log("Email cambiado correctamente");
                    })
                    .catch(err => {
                        console.log("error");
                    });
            })
            .catch(err => {
                console.log("tu contraseña no es correcta");
            });
    };

    returnUpdateUserInfoComponent = userInfoData => {
        if (userInfoData.hasOwnProperty("uid")) {
            return (
                <UpdateUserInfo
                    userInfo={this.state.userInfo}
                    updateUserDisplayName={this.updateUserDisplayName}
                    updateUserEmail={this.updateUserEmail}
                />
            );
        }
        // console.log(userInfoData);
    };

    render() {
        const { displayName, email, photoURL } = this.state.userInfo;

        // console.log(this.checkUserAvatar(photoURL));

        return (
            <View>
                <View style={styles.viewUserInfo}>
                    <Avatar
                        rounded
                        size="large"
                        source={{
                            uri: this.checkUserAvatar(photoURL)
                        }}
                        containerStyle={styles.userInfoAvatar}
                    />
                    <View>
                        <Text style={styles.displayName}>{displayName}</Text>
                        <Text>{email}</Text>
                    </View>
                </View>
                {this.returnUpdateUserInfoComponent(this.state.userInfo)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingTop: 30,
        paddingBottom: 30,
        backgroundColor: "#f2f2f2"
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold"
    }
});
