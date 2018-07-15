const User = require('../models/message');
const jwt = require('jsonwebtoken');
const errorMessage = require('../models/message');
const validation = require('./../../config/validation');
const CONFIG = require('./../../config/auth');

var signToken =  (user) => {
    return jwt.sign({
        sub: user._id,
        email: user.email
    }, CONFIG.JWT_SECRET);
};

exports.login = (req, res) => {
    
    User.findOne({email: req.body.email})
        .then(
            function (user) {
                if (user.length === 0) {
                    return res
                        .status(404)
                        .send({message: errorMessage.user.imvalidEntryEmail});
                }
                if(validation.confirmed(req.body.password, user[0].password))
                {
                    var token = jwt.signToken(user[0]);
                    res
                        .status(200)
                        .send({token: token});
                }
                else
                {
                    res
                        .status(401)
                        .send({message: errorMessage.auth.unauth});
                }

            }
        )
        .catch(() => {

            res
                .status(401)
                .send({error: errorMessage.auth.authFailed});
        });
};

exports.facebookOAuth = (req, res) => {

    res
        .status(200)
        .send({ token: signToken(req.user) });
};

exports.googleOAuth =  (req, res) => {
     
    res
        .status(200)
        .send({ token: signToken(req.user) });
};
