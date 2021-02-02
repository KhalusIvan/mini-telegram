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
function updateSecondName(){
    app.post('/updateSecondName', type, middleware, (req, res) => {
        base.collection('users').findOneAndUpdate({
            email: req.user.email
        }, {
            $set: {
                second_name: req.body.second_name
            }
        },(err,result) => {
            if (err) {
                return res.send({status:'error'});
            } else {
                return res.send({status:'ok'});
            }
        })
    });
}
module.exports.updateSecondName = updateSecondName;