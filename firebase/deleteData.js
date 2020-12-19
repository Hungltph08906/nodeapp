const firebase = require("./firebase_connect");

module.exports = {
    deleteData: function (req,callback) {
        let uid = req.uid;

        firebase.database().ref('Users/'+uid).remove()
    }
}