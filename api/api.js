const express = require('express');
const app = express();
//model
const userModel = require('../firebase/getData');



//  register user
app.post('/signup', async (req, res) => {
    let user = {
        password: req.body.password,
        type: '2',
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        dateOfBirth: req.dateOfBirth
    };

    try {
        const existingUser = await userModel.findOne({email: req.body.email});
        if (!existingUser) {
            const u = new userModel(user);
            u.get();
            res.send('1');
            console.log(u)
        } else {
            res.send('0');
        }

    } catch (e) {
        res.send('0');
    }


});

// login
app.post('/login',
    function (req, res){
        let condition = {
            email: req.body.email,
            password: req.body.password
        };
        try {
            const user = users
            if (!user) {
                res.send('0' + req.body.email + req.body.password)
            } else {
                res.send('1');
            }
        } catch (error) {
            res.status(500).send(error);
        }

    });


module.exports = app;
