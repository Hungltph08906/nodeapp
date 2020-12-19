const firebase = require("firebase");

const app = firebase.initializeApp({
    apiKey: "AIzaSyAl0pf_eG2jlJ6AeF8Eeav7EXRNGgbqF_g",
    authDomain: "appthilaixe.firebaseapp.com",
    databaseURL: "https://appthilaixe.firebaseio.com",
});

module.exports = app;