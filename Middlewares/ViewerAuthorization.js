const {Usermodel} = require('../Data Models/User.model');

const ViewerAuthorization = async(req,res,next)=>{
    const UserID = req.userID;
    try {
        const User = await Usermodel.findOne({_id:UserID});
        let Flag = false;
        for(let i=0;i<User.Role.length;i++){
            if(User.Role[i] === 'VIEWER'){
                Flag = true;
            }
        }
        if(Flag){
            next();
        }
        else{
            res.status(401).send({'Message':'Not authorized'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }
}

module.exports = {
    ViewerAuthorization
}