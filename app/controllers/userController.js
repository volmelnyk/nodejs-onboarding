const User = require('../models/user');
const mongoose = require('mongoose');
const crypto = require('crypto');
const passGenerator = require('generate-password');
const mail = require('../config/mailConfig');
const errorMessage = require('../config/message');
const validation = require('../config/validation');
const bcrypt = require('bcrypt');


exports.getAllUsers = function (req, res) {
        User.find()
            .then(function (value) {

                    res.status(200).send(value);
                }
            )
            .catch(function (error) {
                res.status(500)
                    .send({error: error})
            })
};

exports.addUser = function (req, res) {
        var user = new User(req.body);
        user._id = new mongoose.Types.ObjectId;
        user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        user.save()
                .then( ( error)=>
                {
                  res.
                        status(200)
                        .send({message: errorMessage.user.ok})


                  mail.sendMeailWElcom(user);    

                })
                .catch( (error) => 
                {
                    res.status(500).send({message: error.message} )
                })
}

exports.getUserById = function (req, res) {
    User.findById(req.params.id)
        .then(function (result) {
            if (result) {
                res.status(200).send(result);
            }
            else {
                res
                    .status(404)
                    .send({message: errorMessage.user.incorrectID})
            }
        })
        .catch(function (error) {
            console.log(error)
            res.status(500).send({error: error})
        });
}

exports.deletById = function (req, res) {

    const id = req.params.id;
    User.remove({_id: id})
        .then(function (result) {
            res
                .status(200)
                .send({message: errorMessage.user.ok});
        })
        .catch(function (error) {
            res.status(500).json({
                error: err
            });
        })
}

exports.updateById = function (req, res) {

        req.body.updatedAt = new Date();
        bcrypt.hash(req.bodypassword, 10, function(err, hash) {
            if(error)
            {
                throw error
            }
            else
            {
                req.body.password = hash;
            }
          });
        User.findByIdAndUpdate({_id: req.params.id}, req.body)
            .then(
                res.status(200).send(req.body)
            ).catch((reason) =>
             {
                res.status(500).send({message: error.message} )
             });
    
}

exports.forgotPassword = function (req, res) {
    if (validation.mailValidation(req.body.email)) {
        res.status(400).send({message: errorMessage.user.incorrectEmailFormat});
    }
    else {
        var password = passGenerator.generate({
            lengh: 10
        })

        User.find({email: req.body.email})
            .then(
                function (user) {
                    if (user.length === 0) {
                        return res
                            .status(404)
                            .send({message: errorMessage.user.imvalidEntryEmail})
                    }
                    else {

                          
                        User.findByIdAndUpdate({_id: user[0]._id}, user[0]).then();
                        mail.sendPasswordForgot(user[0], password);

                        console.log(password);
                        res
                            .status(200)
                            .send({message: errorMessage.user.ok})
                    }
                }
            )
    }
}

exports.changePassword = function (req, res) {

        User.find({email: req.body.email})
            .then(
                function (user) {
                    if (user.length === 0) {
                        res
                            .status(404)
                            .send({message: errorMessage['user'].invalidMail})
                    }
                    else if (!validation.confirmed(req.body.password, req.body.newPassword)) {
                        res
                            .status(404)
                            .send({message: errorMessage.user.invalidConfirmPassword})
                    }
                    else if(!validation.confirmed(user[0].password, req.body.oldPassword))
                    {
                        res
                            .status(404)
                            .send({message: errorMessage.incorrectOldPAssword})
                    }
                    else {
                        bcrypt.hash(req.body.newPassword, 10, function(err, hash) {
                            if(error)
                            {
                                throw error
                            }
                            else
                            {
                                user[0].password = hash;
                            }
                          });

                        User.findByIdAndUpdate({_id: user[0]._id}, user[0]).then();

                        res
                            .status(200)
                            .send({message: errorMessage.ok})
                    }
                }
            )
}
