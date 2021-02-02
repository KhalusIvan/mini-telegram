const {app} = require('../server.js');
const {secretJWT} = require("../server.js");
const {transporter} = require("../server.js")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var base;
setTimeout(function run() {
    if(base) return;
    var {db} = require('../server.js');
    base = db;
    setTimeout(run, 500);
}, 100);

function register(){
    app.post('/register', (req,res) => {
        base.collection('users').find({email: req.body.email}).toArray((err,resp)=>{
            if (err) return console.log(err)
            if (resp.length == 0) {
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    base.collection('users').insertOne({
                        'first_name': req.body.first_name,
                        'second_name': req.body.second_name,
                        'password': hash,
                        'email': req.body.email,
                        'avatar': null,
                        "is_confirmed": false,
                        "last_online": null,
                        "chatList": []
                    },(err,result)=>{
                        if(err)
                            return res.json({status: "error"});
                        else {
            
                            jwt.sign(
                                {
                                    email: req.body.email,
                                },
                                secretJWT,
                                {
                                    expiresIn: '1d',
                                }, (err, emailToken) => {
                                    const url = `https://chatapp-backend-telegram.herokuapp.com/confirmation/${emailToken}`;
                                    let html_text = `Будь ласка перейдіть за <a href="${url}">даним посиланням</a>  щоб підтвердити Ваш e-mail адрес.`;
                                    let subject_text = "Підтвердження емайла";
                                    transporter.sendMail({
                                        from: 'vakhalus.work@gmail.com',
                                        to: req.body.email,
                                        subject: subject_text,
                                        html: html_text
                                    }, function (err, info) {
                                        if (err) {
                                            return res.json({status: "error"})
                                        }
                                        else
                                            return res.json({status:"confirm", email:req.body.email});       
                                    })
                                })
                        }
                        });
                    });
            } else {
                res.json({status: "email"});
            }
        });
    })
}
module.exports.register = register;