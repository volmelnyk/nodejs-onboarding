

const bcrypt = require('bcrypt');

exports.mailValidation = (arg1)=>{
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(arg1);
}

exports.confirmed = function (pass, confirmPass) {

    bcrypt.compare('somePassword', hash, function(err, res) {
        if(res) {
         return true;
        } else {
         return false;
        } 
      });
}