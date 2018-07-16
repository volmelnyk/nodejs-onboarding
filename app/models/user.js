const mongoose = require('mongoose');
const message = require('./message');
const Schema = mongoose.Schema;

var userSchema = new Schema({

    _id: {
        type: mongoose.Schema.ObjectId,
        default: mongoose.Types.ObjectId  
    },

    first_name: {
        type: String,
        required: [true, message.user.firstNameRequired],
        min: [2, message.user.toShortFirstName],
        validate:{
            validator: (v) => { return /^[a-zA-Z\u00C0-\u00ff]+$/.test(v);},
            message: '{VALUE}'+ message.user.invalidFirstName
        }
    },

    last_name: {
        type: String, 
        required: [true, message.user.secondNameRequired],
        min: [2, message.user.toShortSecondName],
        validate:{
            validator: (secondName) => {
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
            validator: (v) => {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: '{VALUE}' + message.user.imvalidEntryEmail
        }
    },

    password: String,

    date_of_birth: {
        type: Date, 
        validate: {
            validator: (date) => {
                return date < new Date();
            },
            message: '{VALUE}'
        }
    },

    phone: {
        type: String,
        validate: {
            validator: (v) => {
                return /^\+380+([0-9]){9}/.test(v);
            },
            message: '{VALUE}'
        }
    },

    createdAt: {
        type: Date,
        default: new Date()
    },

    updatedAt: Date,

    facebook: {
        id: {
            type: String
        }
    },

    google: {
        id: { type: String}
    }
});

userSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
  });

module.exports = mongoose.model('User',userSchema);
