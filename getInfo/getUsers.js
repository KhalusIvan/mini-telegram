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
function getUsers(){
    app.post('/getUsers',type, middleware, (req, res) => {
        base.collection('users').find({ email: { $nin: [req.user.email, ...req.body.current] } },  {projection:{password:0}}).toArray((err,resp)=>{
            if (err) return console.log(err);
            for(let i = 0; i < resp.length; i++) {
                if(resp[i].avatar != null)
                    resp[i].avatar = resp[i].avatar.buffer;
            }
            res.json({status:'ok', users:resp});
        });
    });
}
module.exports.getUsers = getUsers;