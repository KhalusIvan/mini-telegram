let {app} = require('../server.js');
let {type} = require('../server.js');
let {middleware} = require('../auth/middleware.js');
var base;
setTimeout(function run() {
    if(base) return;
    var {db} = require('../server.js');
    base = db;
    setTimeout(run, 500);
}, 100);
function getUserByEmail(){
    app.post('/getUserByEmail',type, middleware, (req, res) => {
        base.collection('users').find({email: req.body.email},  {projection:{password:0}}).toArray((err,resp)=>{
            if (err) return console.log(err);
            res.json(resp[0]);
        });
    });
}
module.exports.getUserByEmail = getUserByEmail;