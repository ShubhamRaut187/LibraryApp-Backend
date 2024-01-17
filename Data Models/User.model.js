const mongoose = require('mongoose');

const Userschema = mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        unique:true,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Role:{
        type:[String],
        default:undefined
    }
});

const Usermodel = mongoose.model('users',Userschema);

module.exports = {
    Usermodel
}