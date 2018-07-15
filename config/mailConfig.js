const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ff0537429@gmail.com',
        pass: 'sorse181745'
    }
});

exports.senderMail = 'ff0537429@gmail.com';

