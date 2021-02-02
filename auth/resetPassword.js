let {secretJWT, app} = require('../server.js');
const {transporter} = require('../server.js');
const jwt = require("jsonwebtoken");
var base;
setTimeout(function run() {
    if(base) return;
    var {db} = require('../server.js');
    base = db;
    setTimeout(run, 500);
}, 100);
function resetPassword(){
    app.post("/resetPassword", (req, res) => {
        base.collection('users').find({email: req.body.email}).toArray((err,resp)=>{
            if (err) return console.log(err)
            let new_password = "";
            while (new_password.length < 9) 
                new_password += Math.random().toString(36).substring(2);
            new_password = new_password.substring(0, 9);
            jwt.sign(
                {
                    email: req.body.email,
                    password: new_password
                },
                secretJWT,
                {
                    expiresIn: '1h',
                }, (err, emailToken) => {
                    const url = `https://chatapp-backend-telegram.herokuapp.com/resetPassword/${emailToken}`;
                    let html_text = `Ваш новий пароль ${new_password} </br> Будь ласка перейдіть за <a href="${url}">даним посиланням</a>  щоб підтвердити зміну паролю.`;
                    let subject_text = "Підтвердження зміни пароля";
                    transporter.sendMail({
                        from: 'vakhalus.work@gmail.com',
                        to: req.body.email,
                        subject: subject_text,
                        html: html_text
                    }, function (err, info) {
                        if (err) {
                            return res.json({status: "errorrrr"})
                        }
                        else
                            return res.json({status:"ok"});       
                    })
                }
            )
        });
    })
}
module.exports.resetPassword = resetPassword;