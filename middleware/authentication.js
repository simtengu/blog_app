const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticationMiddleware = (req,res,next)=>{

    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
       res.status(401).json({message:"You are not authenticated...login first"})
      return;
    }

    const token = authHeader.split(" ")[1];
    
    try {
        
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userId:payload.userId,name:payload.name}
        next();
    } catch (error) {
        res.status(401).json({ message: "You are not authenticated...login first" })
    }
}

module.exports = authenticationMiddleware;