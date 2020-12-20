const firebase = require("./firebase_connect");

module.exports = {
    updateData: function (req,callback) {
        let uid = req.uid;

        firebase.database().ref('Users/'+uid).update({
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