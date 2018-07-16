const mailSenser = require('./../../config/mailConfig')
const fs = require('fs');
const jade = require('jade');

var sendMail = function(title, email, htmlToSend)
{
     mailSenser.transporter.sendMail({
        from: mailSenser.senderMail,
        to : email,
        subject : title,
        html : htmlToSend
     });
}

exports.sendWelcomeMail = function(user){
 
    var template = jade.renderFile(process.cwd() + '/nodejs-onboarding/views/mailTemplates/welcome.jade' );

    sendMail('New customer',user.email, template);
};

exports.sendPasswordForgot = function(user, newPassword){
 
    var template = jade.renderFile(process.cwd() + 
                        '/nodejs-onboarding/views/mailTemplates/forgotPassword.jade',
                        {newPassword: newPassword});

    console.log(template);
    sendMail('Forget password', user.mail, template);
};