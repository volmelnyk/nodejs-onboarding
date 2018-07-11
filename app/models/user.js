const mongoose = require('mongoose');
const message = require('../config/message')

const Schema = mongoose.Schema;

var userSchema = new Schema({

    _id: mongoose.Schema.ObjectId,
    first_name: {
        type: String,
         required: true,
          min: [2, message['firstNameRequired']],
          validate:{
            validator: function(v) { return /^[a-zA-Z\u00C0-\u00ff]+$/.test(v);},
            message: '{VALUE}'+ + message['invalidFirstName']
            }
        },
    secong_name: {
        type: String, 
        required: [true, ],
        min: [2, message['secondNameRequired']],
        validate:{
            validator: function(secondName) {
                return /^[a-zA-Z\u00C0-\u00ff]+$/.test(secondName);
            },
            message: '{VALUE}' + message['invalidSecondName']
        }
    },
    email: {
        type: String, 
        required: [true, 'User date required'], 
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: '{VALUE}' + message['invalidMail']
        }
        },
    phone: {
        type: String,
        validate: {
          validator: function(v) {
            return /^\+380+([0-9]){9}/.test(v);
          },
          message: '{VALUE}' + message['invalidMail']
        },
        required: [true, message['dateRequired']]
    },
    password: String,
    date_of_birth: {
        type: Date, 
        validate: {
            validator: function(date)
            {
                return date < new Date();
            },
            message: '{VALUE}' + message['incorrectDate']
        },
        required: [true, message['dateRequired']]
         },
    createdAt: Date,
    updatedAt: Date,

});

module.exports = mongoose.model('User',userSchema);
