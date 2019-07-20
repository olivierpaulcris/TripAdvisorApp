import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar, Button } from "react-native-elements";
import * as firebase from "firebase";
import UpdateUserInfo from "./UpdateUserInfo";
import Toast, { DURATION } from "react-native-easy-toast";
import { Permissions, ImagePicker } from "expo";

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
        const credentials = firebase.auth.EmailAuthProvider.credential(
            user.email,
            currentPassword
        );

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
                        this.refs.toast.show(
                            "Email actualizado, vuelve a iniciar sesión",
                            50,
                            () => {
                                firebase.auth().signOut();
                            }
                        );
                    })
                    .catch(err => {
                        this.refs.toast.show("Login es incorrecto");
                        console.log("error");
                    });
            })
            .catch(err => {
                console.log("tu contraseña no es correcta");
                this.refs.toast.show("Tu contraseña no es correcta");
            });
    };

    returnUpdateUserInfoComponent = userInfoData => {
        if (userInfoData.hasOwnProperty("uid")) {
            return (
                <UpdateUserInfo
                    userInfo={this.state.userInfo}
                    updateUserDisplayName={this.updateUserDisplayName}
                    updateUserEmail={this.updateUserEmail}
                    updateUserPassword={this.updateUserPassword}
                />
            );
        }
        // console.log(userInfoData);
    };

    updateUserPassword = async (currentPassword, newPassword) => {
        console.log("estamos en userpassword");
        console.log("currentPassword: ", currentPassword);
        console.log("newPassword: ", newPassword);

        this.reauthenticate(currentPassword)
            .then(() => {
                const user = firebase.auth().currentUser;
                console.log("login background correcto");
                user.updatePassword(newPassword)
                    .then(() => {
                        console.log("contraseña cambiada correctamente");
                        this.refs.toast.show(
                            "contraseña actualizada correctamente, vuelve a iniciar sesión",
                            1500,
                            () => {
                                firebase.auth().signOut();
                            }
                        );
                    })
                    .catch(() => {
                        this.refs.toast.show(
                            "error del servidor, intentelo mas tarde",
                            1500
                        );
                    });
            })
            .catch(error => {
                this.refs.toast.show(
                    "Tu contaseña actual introducida no es correcta",
                    1500
                );
            });
    };

    updateUserPhotoURL = async photoUri => {
        const update = {
            photoURL: photoUri
        };

        await firebase.auth().currentUser.updateProfile(update);

        this.getUserInfo();
    };

    changeAvatarUser = async () => {
        console.log("change avatar user");

        const resultPermission = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );

        console.log(resultPermission);

        if (resultPermission.status == "denied") {
            this.refs.toast.show(
                "Es necesario aceptar los permisos de la galeria",
                1500
            );
        } else {
            console.log("Aceptado");

            const result = await ImagePicker.launchImageLibraryAsync({
                allowEditing: true,
                aspect: [4, 3]
            });

            if (result.cancelled) {
                this.refs.toast.show(
                    "Haz cerrado la galeria de imagenes",
                    1500
                );
            } else {
                console.log(result);
                console.log("haz seleccionado una imagen");

                const { uid } = this.state.userInfo;

                this.uploadImage(result.uri, uid)
                    .then(resolve => {
                        this.refs.toast.show("Avatar actualizado");

                        firebase
                            .storage()
                            .ref("avatar/" + uid)
                            .getDownloadURL()
                            .then(resolve => {
                                console.log(resolve);
                                this.updateUserPhotoURL(resolve);
                            })
                            .catch(error => {
                                this.refs.toast.show(
                                    "Error al obtener el avatar, intentelo mas tarde"
                                );
                            });
                    })
                    .catch(error => {
                        this.refs.toast.show(
                            "Error al actualizar el avatar, intentelo mas tarde"
                        );
                    });
            }
        }
    };

    uploadImage = async (uri, nameImage) => {
        console.log("uri: ", uri);
        console.log("nameImage: ", nameImage);

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onerror = reject;
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    resolve(xhr.response);
                }
            };

            xhr.open("GET", uri);
            xhr.responseType = "blob";
            xhr.send();
        })
            .then(async resolve => {
                let ref = firebase
                    .storage()
                    .ref()
                    .child("avatar/" + nameImage);

                return await ref.put(resolve);
            })
            .catch(error => {
                this.refs.toast.show(
                    "error al subir la imagen al servidor, intentelo mas tarde",
                    1500
                );
            });
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
                        showEditButton
                        onEditPress={() => this.changeAvatarUser()}
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

                <Button
                    title="Cerrar Sesión"
                    onPress={() => firebase.auth().signOut()}
                    buttonStyle={styles.btnCloseSession}
                    titleStyle={styles.btnCloseSessionText}
                />

                <Toast
                    ref="toast"
                    position="bottom"
                    positionValue={250}
                    fadeInDuration={1000}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: "#fff" }}
                />
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
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10
    },
    btnCloseSessionText: {
        color: "#00a680"
    }
});
