const mailSenser = require('./../../config/mailConfig')
const fs = require('fs');

var sendMail = function(title, email, htmlToSend)
{
    var mailOptions = {
        from: mailSenser.senderMail,
        to : email,
        subject : title,
        html : htmlToSend
     };

     mailSenser.transporter.sendMail(mailOptions);
}

exports.sendWelcomeMail = function(user){
 
    var html = fs.readFileSync( './../../views/mailTemplates/welcome.html');

    var template = handlebars.compile(html.toString());

    console.log(user.email);
    sendMail('New cisomer',user.email, template());
};

exports.sendPasswordForgot = function(user, newPassword){
 
    var html = fs.readFileSync(__dirname + './../nodejs-onboarding/views/mailTemplates/forgotPassword.html');
    
    var template = handlebars.compile(html.toString());

    sendMail('Forget password', user.mail, template({newPassword: newPassword}));
};