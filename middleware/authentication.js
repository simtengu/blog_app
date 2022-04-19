const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { UnAuthenticatedError} = require('../errors')
const authenticationMiddleware = (req,res,next)=>{

    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnAuthenticatedError('Authentication error..........')
      return;
    }

    const token = authHeader.split(" ")[1];
    
    try {
        
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userId:payload.userId,name:payload.name}
        next();
    } catch (error) {
        throw new UnAuthenticatedError('Authentication error')
    }
}

module.exports = authenticationMiddleware;