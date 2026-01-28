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
    console.log(`made socket connection`, socket.id);

    socket.on('sendMessage', function(data){
        io.sockets.emit('sendMessage', data)
    });
}); 