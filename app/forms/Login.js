import React from "react";

import t from "tcomb-form-native";
import formValidation from "../utils/Validation";
import InputTemplate from "./templates/Input";

export const LoginStruct = t.struct({
    email: formValidation.email,
    password: formValidation.password
});

export const LoginOptions = {
    fields: {
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
        }
    }
};
