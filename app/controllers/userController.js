const User = require('../models/user');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passGenerator = require('generate-password');


const namePatern = /^[a-zA-Z\u00C0-\u00ff]+$/;
const mailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const phonePattern = /^\+380+([0-9]){9}/;


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

var sendMail = function (email, text) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ff0537429@gmail.com',
            pass: 'sorse181745'
        }
    });
    var mailOptions = {
        from: 'youremail@gmail.com',
        to: email,
        subject: 'Form my app!',
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.addUser = function (req, res) {

    if (!(req.body.first_name.length >= 2
            && req.body.first_name.length >= 2
            && namePatern.test(req.body.first_name)
            && namePatern.test(req.body.secong_name))) {
        res.status(400).send({message: "Incorrect firts_name or last_name format or lenght"});
    }
    else if (!mailPattern.test(req.body.email)) {
        res.status(400).send({message: "Incorrect email format"});
    }
    else if (!phonePattern.test(req.body.phone)) {
        res.status(400).send({message: "Incorrect phone format"});
    }
    else if (!(new Date(new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate())) > new Date(req.body.date_of_birth)) {
        res.status(400).send({message: "Incorrect email dare of birth"});
    }
    else {
        var user = new User(
            {
                _id: new mongoose.Types.ObjectId,
                first_name: req.body.first_name,
                secong_name: req.body.secong_name,
                email: req.body.email,
                password: crypto.createHash('md5').update(req.body.password).digest("hex"),
                date_of_birth: new Date(req.body.date_of_birth),
                createdAt: new Date(),
                phone: req.body.phone
            }
        );

        sendMail(user.email, 'Welcome email!');

        user
            .save()
            .then(
                function (result) {
                    res.status(201).send({message: 'Created'});
                })
            .catch(function (error) {
                res.status(500).send({error: "Error in add user to database"})
            });

    }
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
                    .send({message: 'No valid entry found for provided ID'})
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
    const namePatern = /^[a-zA-Z\u00C0-\u00ff]+$/;
    const mailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const phonePattern = /^\+380+([0-9]){9}/;
    if (!(req.body.first_name.length >= 2
            && req.body.first_name.length >= 2
            // && namePatern.test(req.body.first_name)
            && namePatern.test(req.body.secong_name))) {
        res.status(400).send({message: "Incorrect firts_name or last_name format or lenght"});
    }
    else if (!mailPattern.test(req.body.email)) {
        res.status(400).send({message: "Incorrect email format"});
    }
    else if (!phonePattern.test(req.body.phone)) {
        res.status(400).send({message: "Incorrect phone format"});
    }
    else {
        req.body.updatedAt = new Date();
        req.body.password = crypto.createHash('md5').update(req.body.password).digest("hex");
        User.findByIdAndUpdate({_id: req.params.id}, req.body)
            .then(
                res.status(200).send(req.body)
            ).catch(function (reason) {
            console.log(reason)
        });
    }
}

exports.forgotPassword = function (req, res) {
    if (!mailPattern.test(req.body.email)) {
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
                            .send({message: 'No valid entry found for provided email'})
                    }
                    else {
                        user[0].password = crypto.createHash('md5').update(password).digest("hex");
                        console.log('from change Password');
                        console.log(user[0]);
                        User.findByIdAndUpdate({_id: user[0]._id}, user[0]).then();
                        sendMail(user[0].email, 'Your new password' + user[0].password);

                        console.log(password);
                        res
                            .status(200)
                            .send({message: 'Password was sent'})
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
                    else if(!confirmedPassword(user[0].password,crypto.createHash('md5').update(req.body.password).digest("hex"))
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
