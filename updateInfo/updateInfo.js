const {updateFirstName} = require("./updateFirstName.js")
const {updateSecondName} = require("./updateSecondName.js")
const {updatePassword} = require("./updatePassword.js")
const {sendMessage} = require("./sendMessage.js")
const {readMessage} = require("./readMessage.js")
const {addChat} = require("./addChat.js")
const {updateAvatar} = require("./updateAvatar.js")

function updateInfo() {
    updateFirstName();
    updateSecondName();
    updatePassword();
    sendMessage();
    readMessage();
    addChat();
    updateAvatar();
}

module.exports.updateInfo = updateInfo;