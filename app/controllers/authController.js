const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.login = function (req, res) {


    User.find({email: req.body.email})
        .then(
            function (user) {
                console.log(user)
                if (user.length === 0) {
                    return res
                        .status(404)
                        .send({message: 'No valid entry found for provided ID'})
                }
                if(user[0].password ===  crypto.createHash('md5').update(req.body.password).digest("hex"))
                {
                    var token = jwt.sign({
                        id: user[0]._id,
                        email: user[0].email}, 'secretkey', { expiresIn: '30s' });
                    res
                        .status(200)
                        .send({token: token})
                }

            }
        )
        .catch(function (error) {
            console.log(error)
            res.status(401).send({error: 'Auth failed'})
        });
}


