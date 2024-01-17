const {Router} = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Data Model
const {Usermodel} = require('../Data Models/User.model');

const AuthRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication
 */

/**
 * @swagger
 * /v1/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *               Role:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               Message: Signup successful
 *       '204':
 *         description: All input fields are mandatory
 *         content:
 *           application/json:
 *             example:
 *               Message: All input fields are mandatory.
 *       '409':
 *         description: Email already registered
 *         content:
 *           application/json:
 *             example:
 *               Message: Email already registered
 *       '500':
 *         description: Something went wrong, please try again
 *         content:
 *           application/json:
 *             example:
 *               Message: Something went wrong, please try again
 */

// Signup Create User
AuthRoutes.post('/v1/signup',async(req,res)=>{
    const {Name,Email,Password,Role} = req.body;
    if(!Name || !Email || !Password || !Role){
        res.status(204).send({'Message':'All input fields are mandatory.'});
        return
    }
    try {
        const User = await Usermodel.findOne({Email:Email});
        if(User){
            res.status(409).send({'Message':'Email already registered'})
            return
        }
        const HashedPassword = bcrypt.hashSync(Password,8);
        const New_User = new Usermodel({
            Name,
            Email,
            Password:HashedPassword,
            Role
        });
        await New_User.save();
        res.status(201).send({'Message':'Signup successful'});
    } catch (error) {
        // console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }
})

/**
 * @swagger
 * /v1/login:
 *   post:
 *     summary: Login with existing user credentials
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               Message: Login successful
 *               User:
 *                 Name: John Doe
 *                 Email: john.doe@example.com
 *                 ID: 123456789
 *                 Role: USER
 *               Token: <your_jwt_token_here>
 *       '204':
 *         description: All input fields are mandatory
 *         content:
 *           application/json:
 *             example:
 *               Message: All input fields are mandatory.
 *       '404':
 *         description: Email address not registered, please signup
 *         content:
 *           application/json:
 *             example:
 *               Message: Email address not registered, please signup.
 *       '401':
 *         description: Invalid Password
 *         content:
 *           application/json:
 *             example:
 *               Message: Invalid Password
 *       '500':
 *         description: Something went wrong, please try again
 *         content:
 *           application/json:
 *             example:
 *               Message: Something went wrong, please try again.
 */

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
                ID:User._id,
                Role:User.Role
            };
            res.status(200).send({'Message':'Login successful.','User':User_Info,'Token':Token});
        }
        else{
            res.status(401).send({'Message':'Invalid Password'})
        }
    } catch (error) {
        // console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }
})

module.exports = {
    AuthRoutes
}