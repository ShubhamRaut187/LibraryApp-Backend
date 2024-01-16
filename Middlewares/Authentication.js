const jwt = require('jsonwebtoken')
const Authentication = (req,res,next) => {
    const authorizationheader = req.headers.authorization;
    if(!authorizationheader){
        res.status(401).send({'Message':'Please login to continue'});
        return
    }
    // console.log(authorizationheader);
    const Token = authorizationheader.split(' ')[1];
    // console.log(Token);
    if(!Token){
        res.status(401).send({'Message':'Please login to continue'});
        return
    }
    jwt.verify(Token,'UserToken',async(error,decoded)=>{
        if(decoded){
            // console.log(decoded)
            const {UserID} = decoded;
            req.userID = UserID;
            // console.log(req.userID);
            next(); 
        }
        else{
            res.status(401).send({'Message':'Invalid token, Please longin again...!'});
        }
    })
}

module.exports = {
    Authentication
}