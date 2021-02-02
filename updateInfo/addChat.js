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
function addChat(){
    app.post('/addChat', type, middleware, (req, res) => {
        let dialog = req.user.email > req.body.email ? req.user.email+"To"+req.body.email
                                                            : req.body.email+"To"+req.user.email
        base.collection('users').updateMany({
            $or:[{email: req.user.email}, {email: req.body.email}]
        }, {
            $push: {
                chatList: dialog
            }
        }, (err,result) => {
            if (err) {
                return res.send({status:'error'});
            } else {
                base.collection('dialogs').insertOne({
                        user1: req.user.email,
                        user2: req.body.email,
                        title: dialog,
                        messaging: []
                }, (err,result) => {
                    if (err) {
                        return res.send({status:'error'});
                    } else {
                        return res.send({status:'ok', dialog:dialog});
                    }
                })
            }
        })
        /*base.collection('dialogs').findOneAndUpdate({title:req.body.dialog}, {
            $push: {
                messaging: req.body.message
            }
        }, (err,result) => {
            if (err) {
                return res.send({status:'error'});
            } else {
                return res.send({status:'ok'});
            }
        })*/
        
    });
}
module.exports.addChat = addChat;