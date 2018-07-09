const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: mongoose.Schema.ObjectId,
    first_name: {type: String, required: true},
    secong_name: {type: String, required: true},
    email: {type: String, required: true, unique: true} ,
    phone: String,
    password: String,
    date_of_birth: Date,
    createdAt: Date,
    updatedAt: Date,

});

module.exports = mongoose.model('User',userSchema);
