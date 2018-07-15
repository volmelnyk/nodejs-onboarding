const User = require('../models/user');
const passGenerator = require('generate-password');
const mail = require('../mailSender/mailSender');
const errorMessage = require('../models/message');
const validation = require('./../../config/validation');
const bcrypt = require('bcrypt');



exports.getAllUsers =  (req, res) => {

    User.find()
        .then((value) => {

            res
                .status(200)
                .send(value);
        })
        .catch((error) => {
            res 
                .status(500)
                .send({error: error});
        });
};

exports.addUser = (req, res) => {

    var user = new User(req.body);
    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    // user.save()
    // .then( ( )=>
    // {
        
    //   res.
    //         status(200)
    //         .send({message: errorMessage.user.ok})
    // })
    // .catch( (error) => 
    // {
    //     res
    //         .status(500)
    //         .send({message: error.message} )
    // });
    mail.sendWelcomeMail(user);    
};

exports.getUserById = (req, res) => {
    User.findById(req.params.id)
        .then((result) => {
            if (result) {
                res.status(200).send(result);
            }
            else {
                res
                    .status(404)
                    .send({message: errorMessage.user.incorrectID});
            }
        })
        .catch((error) => {
            res.status(500).send({error: error});
        });
};

exports.deletById = (req, res) => {

    const id = req.params.id;
    User.remove({_id: id})
        .then(() => {
            res
                .status(200)
                .send({message: errorMessage.user.ok});
        });
  
};

exports.updateById = function (req, res) {

    req.body.updatedAt = new Date();
    bcrypt.hash(req.bodypassword, 10, function(error, hash) {
        if(error)
        {
            throw errorMessage.someProblemWithEncryptPassword;
        }
        else
        {
            req.body.password = hash;
        }
    });
    User.findByIdAndUpdate({_id: req.params.id}, req.body)
        .then(
            res.status(200).send(req.body)
        ).catch(() =>
        {
            res.status(500).send({message: errorMessage.user.incorrectID} );
        });
    
};

exports.forgotPassword = function (req, res) {
    if (validation.mailValidation(req.body.email)) {
        res.status(400).send({message: errorMessage.user.incorrectEmailFormat});
    }
    else {
        var password = passGenerator.generate({
            lengh: 10
        });

        User.findOne({email: req.body.email})
            .then(
                function (user) {
                    if (user.length === 0) {
                        return res
                            .status(404)
                            .send({message: errorMessage.user.imvalidEntryEmail});
                    }
                    else {                       
                        User.findByIdAndUpdate({_id: user._id}, user).then();
                        mail.sendPasswordForgot(user, password);
       
                        res
                            .status(200)
                            .send({message: errorMessage.user.ok});
                    }
                }
            );
    }
};

exports.changePassword = function (req, res) {

    User.findOne({email: req.body.email})
        .then(
            function (user) {
                if (user.length === 0) {
                    res
                        .status(404)
                        .send({message: errorMessage.user.invalidMail});
                }
                else if (!validation.confirmed(req.body.password, req.body.newPassword)) {
                    res
                        .status(404)
                        .send({message: errorMessage.user.invalidConfirmPassword});
                }
                else if(!validation.confirmed(user[0].password, req.body.oldPassword))
                {
                    res
                        .status(404)
                        .send({message: errorMessage.incorrectOldPAssword});
                }
                else {
                    bcrypt.hash(req.body.newPassword, 10, function(error, hash) {
                        if(error)
                        {
                            throw errorMessage.user.someProblemWithEncryptPassword;
                        }
                        
                        else
                        {
                            user.password = hash;
                        }
                    });

                    User.findByIdAndUpdate({_id: user._id}, user).then();

                    res
                        .status(200)
                        .send({message: errorMessage.ok});
                }
            });
};
