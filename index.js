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

//---------- SERVERSIDE VARS ----------//

connectionList = [];

//---------- SERVERSIDE FUNCTIONALITY ----------//

function createUser(userID, username, nameColor)
{
    return{
        userID: userID || "undefined",
        username: username || "(unnamed)",
        nameColor: nameColor || "#3d3d3d",
    };
}

function printConnections()
{
    console.log(`\n\\\\--------------- CONNECTION LIST ---------------\\\\`);
    for(let i = 0; i < connectionList.length; i++)
    {
        if(connectionList[i] != undefined)
        {
            console.log(connectionList[i].userID, connectionList[i].username, connectionList[i].nameColor);
        }
    }
    console.log(`\\\\-----------------------------------------------\\\\\n`);
};

function findConnectionIndex(targetID)
{
    for(let i = 0; i < connectionList.length; i++)
    {
        if(connectionList[i] != undefined && connectionList[i].userID == targetID)
        {
            // console.log(`found: '${targetID}' at index: ${i}`); // DEBUG
            return i;
        }
    }

    console.log(`could not find user:`, targetID);
    return undefined;
}

//---------- SOCKET FUNCTIONS ----------//
var io = socket(server);

io.on('connection', function(socket)
{ 
    socket.on('initializeUser', function(data)
    {
        console.log(`socket connection:`, socket.id);
        io.sockets.emit('userConnect', socket.id);

        // create a new connectionList entry with socket.id
        connectionList.push(createUser(socket.id, data.initialUsername, data.initialNameColor));

        printConnections();
        userListUpdate();
    })

    // broadcasts message to others. local message handled in chat.js
    socket.on('sendMessage', function(data){
        socket.broadcast.emit('sendMessage', data);
    });

    socket.on('disconnect', function()
    {
        console.log(`socket disconnection:`, socket.id);
        socket.broadcast.emit('userDisconnect', socket.id);

        let targetIndex = findConnectionIndex(socket.id);

        if(targetIndex != undefined)
        {
            delete connectionList[targetIndex];
        }
        else
        {
            console.log(`target index undefined! connection deletion failed.`);
        }

        printConnections();
        userListUpdate();
    });

    socket.on('updateUsername', function(newUsername)
    {
        let targetIndex = findConnectionIndex(socket.id);

        if(targetIndex != undefined)
        {
            if(newUsername != "")
            {
                connectionList[findConnectionIndex(socket.id)].username = newUsername;
            }
            else
            {
                connectionList[findConnectionIndex(socket.id)].username = "(unnamed)";
            }
        }
        else
        {
            console.log(`target index undefined! username change failed.`);
        }

        // console.log(`set username of: '${socket.id}' to: ${connectionList[targetIndex].username}`);
        printConnections();
        userListUpdate();
    });

    // NAME COLOR CHANGES DO NOT PRINT A NEW CONNECTION LIST!! IT IS WORKING THOUGH 
    socket.on('updateNameColor', function(newNameColor){
        let targetIndex = findConnectionIndex(socket.id);

        if(targetIndex != undefined)
        {
            connectionList[findConnectionIndex(socket.id)].nameColor = newNameColor;
        }
        else
        {
            console.log(`target index undefined! nameColor change failed.`);
        }

        userListUpdate();
    });
}); 

function userListUpdate()
{
    // '<div class="message-name"  style="background-color: ' + data.namecolor + '; border-color: ' + data.bordercolor + ';">'

    let updatedHTML = '';

    for(let i = 0; i < connectionList.length; i++)
    {
        if(connectionList[i] != undefined)
        {
            updatedHTML += '<div class="user-list-entry" style="background-color:' + connectionList[i].nameColor + '; border-color:' + `color-mix(in srgb, ${connectionList[i].nameColor} 90%, white 10% )` + '">' + '<h2>' + connectionList[i].username + '</h2>' + '</div>';
        }  
    }

    io.sockets.emit('userListUpdate', updatedHTML);
}

