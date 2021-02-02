let {app} = require('../server.js');
let {secretJWT} = require('../server.js');
var base;
const jwt = require("jsonwebtoken");
setTimeout(function run() {
    if(base) return;
    var {db} = require('../server.js');
    base = db;
    setTimeout(run, 500);
}, 100);
function checkUser(){
    app.post("/checkUser", (req, res) => {
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
            }
        }
        return res.json({status:'ok'});
    })  
}
module.exports.checkUser = checkUser;