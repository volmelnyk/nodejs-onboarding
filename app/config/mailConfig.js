const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');

// TO-DO: Move to config file. Separate to dev and production. 
transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ff0537429@gmail.com',
        pass: 'sorse181745'
    }
});

// TO-DO: merge to 1 method with correct params.
exports.sendMail = function(config, data){
 
    var html = fs.readFileSync(__dirname + '/mailTemplates/welcome.html');
    var template = handlebars.compile(html.toString());

    var replacements = {
         username: user.name
    };
    var htmlToSend = template(replacements);
    var mailOptions = {
        from: 'ff0537429@gmail.com', // get from config file (dev, prod)
        to : user.email,
        subject : 'New customer', // to messages
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
 
    var html = fs.readFileSync(__dirname + '/mailTemplates/forgotPassword.html');
    
        var template = handlebars.compile(html.toString());
     

    var replacements = {
         password: newPassword
    };
    var htmlToSend = template(replacements);
    console.log(htmlToSend);
    var mailOptions = {
        from: 'ff0537429@gmail.com',
        to : user.email,
        subject : 'Forgot Password',
        html : htmlToSend
     };
     transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            callback(error);
        }
    });
}