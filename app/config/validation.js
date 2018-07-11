


exports.mailValidation = (arg1)=>{
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(arg1);
}

exports.confirmed = function (pass, confirmPass) {

    return (pass === confirmPass) ? true : false
}