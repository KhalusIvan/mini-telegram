const app = require('express')();
const server = require('http').createServer(app);
const options = { origins:"http://localhost:3000", credentials:true, pingTimeout: 5000, pingInterval: 10000 };
const io = require('socket.io')(server, options);
const multer = require('multer')
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const cors = require('cors')
const nodemailer = require('nodemailer');
const secretJWT = "this is chat app";
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

/*io.on("connection", socket => {
    console.log(socket)
    io.on('disconnect', socket => {
        console.log('disconect');
        console.log(socket)
    })
})*/



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

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

MongoClient.connect('mongodb+srv://vania:Hfqyscf10f@chatapp.r3ih8.mongodb.net/chatApp?retryWrites=true&w=majority', function (err, client) {
    if (err)
        return console.log(err);
    dbMongo = client.db('chatApp');
    module.exports.db = dbMongo;
   
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "vakhalus.work@gmail.com",
        pass: "YDRk.,bcnjr"
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
    return res.redirect(`http://localhost:3000/confirm/${token}`);
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
            res.redirect(`http://localhost:3000/`);
        });
    } catch (e) {
        res.send('error');
    }
});

const {register} = require("./auth/register.js")
const {signIn} = require("./auth/signIn.js")
const {getInfo} = require("./getInfo/getInfo.js")
const {updateInfo} = require("./updateInfo/updateInfo.js")
const {resetPassword} = require("./auth/resetPassword.js")
const {checkUser} = require("./auth/checkUser.js")
const {startIO} = require("./socket.js")
updateInfo();
register();
signIn();
getInfo();
resetPassword();
checkUser();
startIO();



