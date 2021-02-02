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
function updateFirstName(){
    app.post('/updateFirstName', type, middleware, (req, res) => {
        base.collection('users').findOneAndUpdate({
            email: req.user.email
        }, {
            $set: {
                first_name: req.body.first_name
            }
        }, (err,result) => {
            if (err) {
                return res.send({status:'error'});
            } else {
                return res.send({status:'ok'});
            }
        })
        
    });
}
module.exports.updateFirstName = updateFirstName;