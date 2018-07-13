const mongoose = require('mongoose');
const message = require('../config/message');
var bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

var userSchema = new Schema({

    _id: mongoose.Schema.ObjectId,

    first_name: {
        type: String,
         required: [true, message.user.firstNameRequired],
          min: [2, message.user.toShortFirstName],
          validate:{
            validator: function(v) { return /^[a-zA-Z\u00C0-\u00ff]+$/.test(v);},
            message: '{VALUE}'+ message.user.invalidFirstName
            }
        },

    secong_name: {
        type: String, 
        required: [true, message.user.secondNameRequired],
        min: [2, message.user.toShortSecondName],
        validate:{
            validator: function(secondName) {
                return /^[a-zA-Z\u00C0-\u00ff]+$/.test(secondName);
            },
            message: '{VALUE}' + message.user.invalidSecondName
        }
    },


        email: {
                type: String, 
                required: [true, message.user.emailRequired], 
                unique: true,
                validate: {
                    validator: function(v) {
                        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                    },
                    message: '{VALUE}' + message.user.imvalidEntryEmail
                }
            },

        password: String,


    date_of_birth: {
        type: Date, 
        validate: {
            validator: function(date)
            {
                return date < new Date();
            },
            message: '{VALUE}'
        }
         },

     phone: {
            type: String,
            validate: {
              validator: function(v) {
                return /^\+380+([0-9]){9}/.test(v);
              },
              message: '{VALUE}'
            }
        },

    createdAt: Date,

    updatedAt: Date,

    facebook: {
        id: {
          type: String
        },
      },

      google: {
        id: {
          type: String
        }
    }
});


module.exports = mongoose.model('User',userSchema);
