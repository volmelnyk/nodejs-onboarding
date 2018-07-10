const User = require('../models/user');
const mongoose = require('mongoose');
const crypto = require('crypto');
const passGenerator = require('generate-password');
const mail = require('../controllers/mailConfig');
const errorMessage = require('../models/message');


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
        user.password = crypto.createHash('md5').update(req.body.password).digest("hex");
        user.save()
                .then( ( error)=>
                {
                  res.
                        status(200)
                        .send[errorMessage['ok']]

                }
                )
                .catch( (error) => 
                {
                    res.status(500).send({message: error.message} )
                })
         mail.mailSend(user.email, "kjhkjhk");
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
                    .send({message: errorMessage['incorrectID']})
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
                .send(result);
        })
        .catch(function (error) {
            res.status(500).json({
                error: err
            });
        })
}

exports.updateById = function (req, res) {

        req.body.updatedAt = new Date();
        req.body.password = crypto.createHash('md5').update(req.body.password).digest("hex");
        User.findByIdAndUpdate({_id: req.params.id}, req.body)
            .then(
                res.status(200).send(req.body)
            ).catch((reason) =>
             {
                res.status(500).send({message: error.message} )
             });
    
}

exports.forgotPassword = function (req, res) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
        res.status(400).send({message: "Incorrect email format"});
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
                            .send({message: errorMessage['invalidMail']})
                    }
                    else {
                        user[0].password = crypto.createHash('md5').update(password).digest("hex");
                        console.log('from change Password');
                        console.log(user[0]);
                        User.findByIdAndUpdate({_id: user[0]._id}, user[0]).then();
                        mail.mailSend(user[0].email, 'Your new password' + user[0].password);

                        console.log(password);
                        res
                            .status(200)
                            .send({message: errorMessage['ok']})
                    }
                }
            )
    }
}

var confirmedPassword = function (pass, confirmPass) {

    return (pass === confirmPass) ? true : false
}

exports.changePassword = function (req, res) {

    if (!mailPattern.test(req.body.email)
        && req.body.newPassword != undefined) {
        res.status(400).send({message: "Incorrect email format"});
    }
    else {
        User.find({email: req.body.email})
            .then(
                function (user) {
                    if (user.length === 0) {
                        res
                            .status(404)
                            .send({message: 'No valid entry found for provided email'})
                    }
                    else if (!confirmedPassword(req.body.newPassword, req.body.confirmedPassword)) {
                        res
                            .status(404)
                            .send({message: 'newPassword and confirmPassword not equal'})
                    }
                    else if(!confirmedPassword(user[0].password,crypto.createHash('md5').update(req.body.password).digest("hex")))
                    {
                        res
                            .status(404)
                            .send({message: 'Incorect old password'})
                    }
                    else {
                        user[0].password = crypto.createHash('md5').update(req.body.newPassword).digest("hex");
                        User.findByIdAndUpdate({_id: user[0]._id}, user[0]).then();

                        res
                            .status(200)
                            .send({message: 'Password was changed'})
                    }
                }
            )
    }
}
