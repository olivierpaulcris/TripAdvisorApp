import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Image, Button, Divider, SocialIcon } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";

import t from "tcomb-form-native";
const Form = t.form.Form;
import { LoginStruct, LoginOptions } from "../../forms/Login";
import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FacebookApi } from "../../utils/Facebook";

export default class Login extends Component {
    constructor() {
        super();

        this.state = {
            loginStruct: LoginStruct,
            loginOptions: LoginOptions,
            loginData: {
                email: "",
                password: ""
            },
            loginErrorMessage: ""
        };
    }

    login = () => {
        console.log("haciwendo login");
        const validate = this.refs.loginForm.getValue();
        if (validate) {
            console.log("valido");
            this.setState({
                loginErrorMessage: ""
            });

            firebase
                .auth()
                .signInWithEmailAndPassword(validate.email, validate.password)
                .then(() => {
                    this.refs.toastLogin.show("Registro correcto", 500, () => {
                        this.props.navigation.goBack();
                    });
                    console.log("login correcto");
                })
                .catch(() => {
                    console.log("login incorrecto");
                });
        } else {
            this.setState({
                loginErrorMessage: "Los datos del formulario son erroneos"
            });
            console.log("invalido");
            this.refs.toastLogin.show("Login Incorrecto", 2500);
        }
    };

    loginFacebook = async () => {
        console.log("login fb...");
        const { type, token } = await Facebook.logInWithReadPermissionsAsync(
            FacebookApi.application_id,
            { permissions: FacebookApi.permissions }
        );

        console.log(type);
        console.log(token);
        if (type == "success") {
            const credentials = firebase.auth.FacebookAuthProvider.credential(
                token
            );
            console.log(credentials);
            firebase
                .auth()
                .signInWithCredential(credentials)
                .then(() => {
                    this.refs.toastLogin.show("Login correcto", 100, () => {
                        this.props.navigation.goBack();
                    });
                })
                .catch(err => {
                    this.refs.toastLogin.show(
                        "Error accediendo con facebook, intentelo mas tarde",
                        100
                    );
                });
        } else if (type == "cancel") {
            this.refs.toastLogin.show("Inicio de sesion cancelado", 300);
        } else {
            this.refs.toastLogin.show(
                "Error desconocido, intente de nuevo",
                300
            );
        }
    };

    onChangeFormLogin = formValue => {
        console.log("cambiando...");
        this.setState({
            loginData: formValue
        });
        console.log(this.state.loginData);
    };

    render() {
        const { loginStruct, loginOptions } = this.state;

        return (
            <View style={styles.viewBody}>
                <Image
                    source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                    containerStyle={styles.containerLogo}
                    style={styles.logo}
                    PlaceholderContent={<ActivityIndicator />}
                    resizeMode="contain"
                />

                <View style={styles.viewForm}>
                    <Form
                        ref="loginForm"
                        type={loginStruct}
                        options={loginOptions}
                        value={this.state.loginData}
                        onChange={formValue =>
                            this.onChangeFormLogin(formValue)
                        }
                    />

                    <Button
                        buttonStyle={styles.buttonLoginContainer}
                        title="Login"
                        onPress={() => this.login()}
                    />

                    <Text style={styles.textRegister}>
                        ¿Aun no tienes una cuenta?{" "}
                        <Text
                            style={styles.btnRegister}
                            onPress={() =>
                                this.props.navigation.navigate("Register")
                            }
                        >
                            Registrate
                        </Text>
                    </Text>

                    <Text style={styles.loginErrorMessage}>
                        {this.state.loginErrorMessage}
                    </Text>

                    <Divider style={styles.divider} />

                    <SocialIcon
                        title="Iniciar Sesión con Facebook"
                        button
                        type="facebook"
                        onPress={() => this.loginFacebook()}
                    />
                </View>

                <Toast
                    ref="toastLogin"
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
    viewBody: {
        flex: 1,
        marginLeft: 30,
        marginRight: 30,
        marginTop: 30
    },
    containerLogo: {
        alignItems: "center"
    },
    logo: {
        width: 300,
        height: 150
    },
    viewForm: {
        marginTop: 50
    },
    buttonLoginContainer: {
        backgroundColor: "#00a680",
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    loginErrorMessage: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20
    },
    divider: {
        backgroundColor: "#00a680",
        marginBottom: 20
    },
    textRegister: {
        marginTop: 15,
        marginRight: 10,
        marginLeft: 10
    },
    btnRegister: {
        color: "#00a680",
        fontWeight: "bold"
    }
});
