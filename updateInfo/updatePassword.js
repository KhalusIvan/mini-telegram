let { app } = require('../server.js');
let { type } = require('../server.js');
const { middleware } = require('../auth/middleware.js');
const bcrypt = require("bcrypt");
var base;
setTimeout(function run() {
    if (base) return;
    var { db } = require('../server.js');
    base = db;
    setTimeout(run, 500);
}, 100);
function updatePassword() {
    app.post('/updatePassword', middleware, type, async (req, res) => {
        base.collection('users').find({ email: req.user.email }).toArray((err, resp) => {
            if (err) return console.log(err);
            console.log(bcrypt.compareSync(req.body.old_password, resp[0].password))
            if (bcrypt.compareSync(req.body.old_password, resp[0].password)) {
                bcrypt.hash(req.body.new_password, 10, function (err, hash) {
                    base.collection('users').findOneAndUpdate({
                        email: req.user.email,
                    }, {
                        $set: {
                            password: hash
                        }
                    },(err,result) => {
                        if (err) {
                            return res.send({status:'error'});
                        } else {
                            return res.send({status:'ok'});
                        }
                    });
                });
            } else {
                return res.send({ status: "password" })
            }
        });

    });
}
module.exports.updatePassword = updatePassword;

