const mongoose = require('mongoose');

const Bookschema = mongoose.Schema({
    Title:{
        type:String,
        required:true
    },
    Author:{
        type:String,
        required:true
    },
    Category:{
        type:String,
        required:true
    },
    CreatedTime:{
        type:Date,
        default:Date.now
    },
    CreatorID:{
        type:String,
        required:true
    }
});

const Bookmodel = mongoose.model('books',Bookschema);

module.exports = {
    Bookmodel
}