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
function sendMessage(){
    app.post('/sendMessage', type, middleware, (req, res) => {
        base.collection('dialogs').findOneAndUpdate({title:req.body.dialog}, {
            $push: {
                messaging: req.body.message
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
module.exports.sendMessage = sendMessage;