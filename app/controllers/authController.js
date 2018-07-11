const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const errorMessage = require('../config/message');
const validation = require('../config/validation')

exports.login = function (req, res) {


    User.find({email: req.body.email})
        .then(
            function (user) {
            console.log(user);
                if (user.length === 0) {
                    return res
                        .status(404)
                        .send({message: errorM})
                }
                else if(validation.confirmed(user[0].password, req.body.password))
                {

                    var token = jwt.sign({
                        id: user[0]._id,
                        email: user[0].email}, 'secretkey', { expiresIn: '30s' });
                    res
                        .status(200)
                        .send({token: token})
                }
                else
                {
                    res
                        .status(401)
                        .send({message: errorMessage.auth.unauth})
                }

            }
        )
        .catch(function (error) {

            res.status(401).send({error: errorMessage.auth.authFailed})
        });
}


