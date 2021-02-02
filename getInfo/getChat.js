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
function getChat(){
    app.post('/getChat',type, middleware, (req, res) => {
        base.collection("dialogs").find({title:req.body.chatTitle}).toArray((err,resp)=>{
            if (err) return console.log(err);
            let secondEmail = resp[0].user1 !== req.user.email ?  resp[0].user1 :  resp[0].user2
            resp[0].messaging.map((message) => {
                if(message.from == req.user.email)
                    message.from = "you"
                else 
                    message.from = "he"
                return message
            })
            base.collection('users').find({email: secondEmail},  {projection:{password:0}}).toArray((err,respUser)=>{
                if (err) return console.log(err);
                let chatReturn = {};
                chatReturn._id = resp[0]._id
                if (respUser[0].avatar != null)
                    chatReturn.avatar = respUser[0].avatar.buffer;
                else
                    chatReturn.avatar = respUser[0].avatar;
                chatReturn.name = respUser[0].first_name + " " + respUser[0].second_name;
                chatReturn.messaging = resp[0].messaging;
                chatReturn.secondEmail = secondEmail;
                chatReturn.firstEmail = req.user.email;
                res.json(chatReturn);
            });
        });
    });
}
module.exports.getChat = getChat;