const io = require('socket.io-client')
const socket = io.connect();

function create(data){
    socket.emit('create', data); 
}

function join(data){
    socket.emit('joinGame', data);
}

export { create, join, socket, io };