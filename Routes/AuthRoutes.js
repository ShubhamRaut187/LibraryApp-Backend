const {Router} = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Data Model
const {Usermodel} = require('../Data Models/User.model');

const AuthRoutes = Router();

// Signup Create User
AuthRoutes.post('/v1/signup',async(req,res)=>{
    const {Name,Email,Mobile,Password,Role} = req.body;
    if(!Name || !Email || !Mobile || !Password || !Role){
        res.status(204).send({'Message':'All input fields are mandatory.'});
        return
    }
    try {
        const HashedPassword = bcrypt.hashSync(Password,8);
        const New_User = new Usermodel({
            Name,
            Email,
            Mobile,
            Password:HashedPassword,
            Role
        });
        await New_User.save();
        res.status(201).send({'Message':'Signup successful'});
    } catch (error) {
        console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }
})

// Login User
AuthRoutes.post('/v1/login',async(req,res)=>{
    const{Email,Password} = req.body;
    if(!Email || !Password){
        res.status(204).send({'Message':'All input fields are mandatory.'});
        return
    }
    try {
        const User = await Usermodel.findOne({Email:Email});
        if(!User){
            return res.status(404).send({'Message':'Email address not registered, please signup.'})
        }
        const Hashed = User.Password;
        const PasswordFlag = bcrypt.compareSync(Password,Hashed);
        if(PasswordFlag){
            const Token = jwt.sign({UserID:User._id},'UserToken');
            const User_Info = {
                Name:User.Name,
                Email:User.Email,
                Mobile:User.Mobile,
                Role:User.Role
            };
            res.status(200).send({'Message':'Login successful.','User':User_Info,'Token':Token});
        }
        else{
            res.status(401).send({'Message':'Invalid Password'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }
})

module.exports = {
    AuthRoutes
}