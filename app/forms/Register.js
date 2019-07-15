import React from "react";

import t from "tcomb-form-native";
import formValidation from "../utils/Validation";
import InputTemplate from "./templates/Input";

export const RegisterStruct = t.struct({
    name: t.String,
    email: formValidation.email,
    password: formValidation.password,
    passwordConfirmation: formValidation.password
});

export const RegisterOptions = {
    fields: {
        name: {
            template: InputTemplate,
            config: {
                placeholder: "Escribe tu nombre y apellido",
                iconType: "material-community",
                iconName: "account-outline"
            }
        },
        email: {
            template: InputTemplate,
            config: {
                placeholder: "Escribe tu email",
                iconType: "material-community",
                iconName: "at"
            }
        },
        password: {
            template: InputTemplate,
            config: {
                placeholder: "Escribe tu contraseña",
                iconType: "material-community",
                iconName: "lock-outline",
                password: true,
                secureTextEntry: true
            }
        },
        passwordConfirmation: {
            template: InputTemplate,
            config: {
                placeholder: "Repite tu contraseña",
                iconType: "material-community",
                iconName: "lock-outline",
                password: true,
                secureTextEntry: true
            }
        }
    }
};
