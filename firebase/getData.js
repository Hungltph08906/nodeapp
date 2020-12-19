const firebase = require("./firebase_connect");


module.exports = {
    getData: function (callback) {
        firebase.database().ref('/Users/').once('value').then((snapshot) => {
            var name = (snapshot.val())
            callback(name);
        })
    }
}