const {io} = require("./server.js")

function startIO() {
    let clients = [];
    io.on('connection', socket => {
        let idishka = socket.id
        clients.push({[idishka]: null});
    
        socket.on('addEmail', email => {
            let index = -1;
            clients.forEach((el,num) => {
                for(let key in el) {
                    if(key === socket.id) {
                        index = num;
                        break;
                    }
                }
            })
            socket.broadcast.emit("newOnline", {email: email});
            socket.emit("startOnline", {clients:clients})
            clients.splice(index, 1, {[socket.id]:email});
        });

        socket.on("readMessage", mess => {
            let toId = '';
            clients.forEach((el,num) => {
                for(let key in el) {
                    if(el[key] === mess.to) {
                        toId = key;
                        break;
                    }
                }
            })
            if (toId !== '') {
                io.sockets.connected[toId].emit("recieveReadMessage", mess)
            }
        })

        socket.on('writeMessage', mess => {
            let toId = '';
            clients.forEach((el,num) => {
                for(let key in el) {
                    if(el[key] === mess.to) {
                        toId = key;
                        break;
                    }
                }
            })
            if (toId !== '') {
                io.sockets.connected[toId].emit("recieveMessage", mess)
            }
        })

        socket.on('logout', () => {
            let index = -1;
            let email = "";
            clients.forEach((el,num) => {
                for(let key in el) {
                    if(key === socket.id) {
                        email = el[key];
                        index = num;
                        break;
                    }
                }
            })
            clients[index][socket.id] = null;
            socket.broadcast.emit("leaveOnline", {email: email});
        })
    
        socket.on('disconnect', () => {
            let index = -1;
            clients.forEach((el,num) => {
                for(let key in el) {
                    if(key === socket.id) {
                        socket.broadcast.emit("leaveOnline", {email: el[key]});
                        index = num;
                        break;
                    }
                }
            })
            clients.splice(index, 1);
        });
    })
}

module.exports.startIO = startIO;
