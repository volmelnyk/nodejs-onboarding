const nodemailer = require('nodemailer');

transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ff0537429@gmail.com',
        pass: 'sorse181745'
    }
});


exports.mailSend = function(email, text)
{
    mailOptions = {
        from: 'youremail@gmail.com',
        to: this.email,
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
 