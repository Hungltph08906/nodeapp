const firebase = require("./firebase_connect");

module.exports = {
    saveData: function (req,callback) {
        let uid = req.uid;

        firebase.database().ref('Users/'+uid).set({
            uid: req.uid,
            name: req.name,
            email: req.email,
            password: req.password,
            phone: req.phone,
            dateOfBirth: req.dateOfBirth,
            type: req.type


        });
    }
}