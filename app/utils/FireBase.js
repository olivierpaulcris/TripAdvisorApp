import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD_6IyekmwMIetfnlzerxci3yXEIcM7H20",
    authDomain: "xampleapp-444c1.firebaseapp.com",
    databaseURL: "https://xampleapp-444c1.firebaseio.com",
    projectId: "xampleapp-444c1",
    storageBucket: "xampleapp-444c1.appspot.com",
    messagingSenderId: "402312223937",
    appId: "1:402312223937:web:f6a522ed7b97ec09"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
