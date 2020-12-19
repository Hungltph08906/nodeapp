let firebase = require('firebase');

let userSchema = firebase.storage({
    password: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    dateOfBirth: {
        type: Number,
        require: true,
    },
    email: {
        type: String,
        require: true,
        lowercase: true,
    },
    address: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
});

const User = firebase.models.userSchema || firebase.model('customer', userSchema);

module.exports = User;