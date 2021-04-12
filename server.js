const app = require('express')();
const cors = require('cors')
const server = require('http').createServer(app);
require('dotenv').config()
const options = { 
 handlePreflightRequest: (req, res) => {
    const headers = {
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true
    };
    res.writeHead(200, headers);
    res.end();
} };
const io = require('socket.io')(server, options);
const multer = require('multer')
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const nodemailer = require('nodemailer');
const secretJWT = process.env.SECRETJWT;
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let upload = multer();
var type = upload.single('file');

module.exports.secretJWT = secretJWT;
module.exports.app = app
module.exports.server = server
module.exports.type = type;
module.exports.io = io;

server.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}`);
});



var dbMongo;
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.MONGOURI, function (err, client) {
    if (err)
        return console.log(err);
    dbMongo = client.db('chatApp');
    module.exports.db = dbMongo;
   
});

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASS
    }
})
module.exports.transporter = transporter;



app.get("/", function(req, res) {
    res.send("Hello")
});

app.get('/confirmation/:token', type, async (req, res) => {
    let userToConfirm;
    try {
        userToConfirm = jwt.verify(req.params.token, secretJWT);
        await dbMongo.collection('users').findOneAndUpdate({
            email : userToConfirm.email
        }, { $set: {
            is_confirmed: true
            }      
        });
    } catch (e) {
      res.send('error');
    }
    const token = jwt.sign({email:userToConfirm.email, role:"user"}, secretJWT, {expiresIn: "2d"});
    return res.redirect(`https://mini-telegram.herokuapp.com/confirm/${token}`);
});

app.get('/resetPassword/:token', type, (req, res) => {
    let userToConfirm;
    try {
        userToConfirm = jwt.verify(req.params.token, secretJWT);
        bcrypt.hash(userToConfirm.password, 10, function(err, hash) {
            dbMongo.collection('users').findOneAndUpdate({
                email : userToConfirm.email
            }, { $set: {
                password: hash
                }      
            });
            res.redirect(`https://mini-telegram.herokuapp.com`);
        });
    } catch (e) {
        res.send(e);
    }
});

const {register} = require("./auth/register.js")
const {signIn} = require("./auth/signIn.js")
const {getInfo} = require("./getInfo/getInfo.js")
const {updateInfo} = require("./updateInfo/updateInfo.js")
const {resetPassword} = require("./auth/resetPassword.js")
const {checkUser} = require("./auth/checkUser.js")
const {startIO} = require("./socket.js");
const { proxy } = require('jquery');
updateInfo();
register();
signIn();
getInfo();
resetPassword();
checkUser();
startIO();



