const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const errorMessage = require('../config/message');
const validation = require('../config/validation');
const { JWT_SECRET } = require('../config/auth');

var signToken =  function (user) {
    return jwt.sign({
      iss: 'CodeWorkr',
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, JWT_SECRET);
  }

exports.login = function (req, res) {
    
    User.find({email: req.body.email})
        .then(
            function (user) {
                console.log('confirmation');
                console.log(validation.confirmed(req.body.password, user[0].password));
                if (user.length === 0) {
                    return res
                        .status(404)
                        .send({message: errorMessage.user.imvalidEntryEmail})
                }
               if(validation.confirmed(req.body.password, user[0].password))
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

exports.facebookOAuth = function (req, res) {
    
    const token = signToken(req.user);
    res.status(200).send({ token: token });
  }

 

