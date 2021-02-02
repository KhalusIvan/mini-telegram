let {app} = require('../server.js');
let {secretJWT} = require('../server.js');
var base;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
setTimeout(function run() {
    if(base) return;
    var {db} = require('../server.js');
    base = db;
    setTimeout(run, 500);
}, 100);
function signIn(){
    app.post("/signIn", (req, res) => {
        try {
            base.collection('users').find({email: req.body.email}).toArray((err,resp)=>{
                if (resp.length == 0) {
                    return res.json({status: "not found"})
                }
                const isValid = bcrypt.compareSync(req.body.password, resp[0].password);
                if (isValid) {
                    if (resp[0].is_confirmed) {
                        const token = jwt.sign({email:resp[0].email, role:resp[0].role}, secretJWT, {expiresIn: "2d"});
                        res.json({status:"ok", token});
                    }
                    else 
                        res.json({status:"confirm"});            
                } else {
                    res.json({status:"error"});
                }
            });
        } catch (e) {
            res.json({status: e.message});
        }
    })  
}
module.exports.signIn = signIn;