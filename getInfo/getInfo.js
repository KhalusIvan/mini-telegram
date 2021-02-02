const {getUser} = require("./getUser.js")
const {getUserByEmail} = require("./getUserByEmail.js")
const {getChat} = require("./getChat.js")
const {getUsers} = require("./getUsers.js")

function getInfo() {
    getUser();
    getUsers();
    getUserByEmail();
    getChat();
}

module.exports.getInfo = getInfo;