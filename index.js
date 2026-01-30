var express = require('express');
var socket = require('socket.io');

//---------- APP SETUP ----------//
var app = express();

var portNumber = 3000;

var server = app.listen(portNumber, function()
{
    console.log(`listening to requests on port: ${portNumber}`);
});

//---------- STATIC FILES ----------//
app.use(express.static('public-files'));

//---------- SOCKET SETUP ----------//
var io = socket(server);

io.on('connection', function(socket)
{ 
    console.log(`socket connection:`, socket.id);
    io.sockets.emit('userConnect', socket.id);

    // broadcasts message to others. local message handled in chat.js
    socket.on('sendMessage', function(data){
        socket.broadcast.emit('sendMessage', data)
    });

    socket.on('disconnect', function()
    {
        console.log(`socket disconnection:`, socket.id);
        socket.broadcast.emit('userDisconnect', socket.id);
    });

}); 

