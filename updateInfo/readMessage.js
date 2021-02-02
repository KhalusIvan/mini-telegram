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
function readMessage(){
    app.post('/readMessage', type, middleware, (req, res) => {
        let updater = {}
        for (let i = 1; i <= req.body.counter; i++ ) {
            updater["messaging."+ (req.body.length - i) + ".status"] = 'read'
        }
        base.collection('dialogs').updateOne({title:req.body.dialog}, {
           $set: updater
        }, (err,result) => {
            if (err) {
                return res.send({status:'error'});
            } else {
                return res.send({status:'ok'});
            }
        })
        
    });
}
module.exports.readMessage = readMessage;