const {secretJWT} = require('../server.js');
const jwt = require("jsonwebtoken");

function middleware(req, res, next) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.json({status: "Token not provided"})
    }
    const token = authHeader.replace('Bearer ', '');
    let currentUser;
    try {
        currentUser = jwt.verify(token, secretJWT);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({status: "Invalid token"});
            //next(e);
        }
    }
    req.user = {
        email: currentUser.email,
    };
    next();
}

module.exports.middleware = middleware; 
