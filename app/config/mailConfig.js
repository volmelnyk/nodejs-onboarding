const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');

transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ff0537429@gmail.com',
        pass: 'sorse181745'
    }
});


exports.sendMeailWElcom = function(user){
 

    var html = fs.readFileSync(__dirname + '/mailTemplates/welcome.html');

    var template = handlebars.compile(html.toString());

    var replacements = {
         username: user.name
    };
    var htmlToSend = template(replacements);
    var mailOptions = {
        from: 'ff0537429@gmail.com',
        to : user.email,
        subject : 'test subject',
        html : htmlToSend
     };
     transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            throw error;
            console.log(error);
            callback(error);
        }
    });
}

exports.sendPasswordForgot = function(user, newPassword){
 
    var html = fs.readFileSync(__dirname + 'app/mailTemplates/forgotPassword.html');//     ,function(err, data) {
    
        var template = handlebars.compile(html);
     

    var replacements = {
         password: newPassword
    };
    var htmlToSend = template(replacements);
    var mailOptions = {
        from: 'ff0537429@gmail.com',
        to : user.email,
        subject : 'test subject',
        html : htmlToSend
     };
     transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            callback(error);
        }
    });
}