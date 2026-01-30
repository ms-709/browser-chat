var socket = io.connect();

//---------- DOM EVENTS ----------//

var chatWindow = document.getElementById('chat-window'),
    chatBox = document.getElementById('chat-box'),
    sendButton = document.getElementById('send-button'),
    usernameBox = document.getElementById('username-box'),

    sampleMessageName = document.getElementById('sample-message-name'),
    nameColorPicker = document.getElementById('name-color-picker');

//---------- STYLE VARS ----------//
var messageNameColor = nameColorPicker.value,
    messageNameBorderColor = `color-mix(in srgb, ${messageNameColor} 90%, white 10% )`;

//---------- INITIALIZE ----------//
sampleMessageName.innerHTML = '<p>' + usernameBox.value + '</p>';// necessary to reflect attributes persisting with cookies
sampleMessageName.style.backgroundColor = messageNameColor; // ^
sampleMessageName.style.borderColor = messageNameBorderColor; // ^

//---------- EMIT EVENTS ----------//

sendButton.addEventListener('click', function(){
    if(usernameBox.value === "")
    {
        chatWindow.innerHTML += '<div class="chat-message-outgoing">' + 
                                    // '<div class="message-name">' + 
                                    //     '<h2>' + '\> System Message \<' + '</h2>' + 
                                    // '</div>' + 
                                '<div class = "message-body">' + 
                                    '<p>' + 'You need to set a username before sending a message!' + '</p>' + 
                                '</div> </div>';
    }
    else
    {
        socket.emit('sendMessage', {
            username: usernameBox.value,
            chatMessage: chatBox.value,
            namecolor: messageNameColor,
            bordercolor: messageNameBorderColor
        });

        // create the local message
        chatWindow.innerHTML += '<div class="chat-message-outgoing">' + 
                                    '<div class="message-name"  style="background-color: ' + messageNameColor + '; border-color: ' + messageNameBorderColor + ';">' + 
                                        '<h2>' + usernameBox.value + '</h2>' + 
                                    '</div>' + 
                                '<div class = "message-body">' + 
                                    '<p>' + chatBox.value + '</p>' + 
                                '</div> </div>';

        chatBox.value = ""; // clear the message box on send
    }

    chatWindow.scrollTop = chatWindow.scrollHeight; // *this scrolls the thing to show new messages at bottom
});

usernameBox.addEventListener('input', function(){
    sampleMessageName.innerHTML = '<p>' + usernameBox.value + '</p>';
});

chatBox.addEventListener('keydown', function(event){
    if(event.key === 'Enter')
    {
        sendButton.click(); 
    }
});

nameColorPicker.addEventListener('change', function(){
    console.log(`${messageNameColor}`);

    messageNameColor = nameColorPicker.value; // update js color variable
    messageNameBorderColor = `color-mix(in srgb, ${messageNameColor} 90%, white 10% )`;

    sampleMessageName.style.backgroundColor = messageNameColor; // update preview color
    sampleMessageName.style.borderColor = messageNameBorderColor; // update preview border color
});

//---------- LISTEN EVENTS ----------//

socket.on('userConnect', function(userConnectID)
{
    console.log('connect ID:', userConnectID)
});

socket.on('sendMessage', function(data)
{
    chatWindow.innerHTML += '<div class="chat-message-incoming">' + 
                                '<div class="message-name"  style="background-color: ' + data.namecolor + '; border-color: ' + data.bordercolor + ';">' +  
                                    '<h2>' + data.username + '</h2>' + 
                                '</div>' + 
                            '<div class = "message-body">' + 
                                '<p>' + data.chatMessage + '</p>' + 
                            '</div> </div>';

    chatWindow.scrollTop = chatWindow.scrollHeight; // *
});

socket.on('userDisconnect', function(userDisconnectID)
{
    console.log(`disconnect ID:`, userDisconnectID);
});