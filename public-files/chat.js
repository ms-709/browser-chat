var socket = io.connect();

//---------- DOM EVENTS ----------//

var chatWindow = document.getElementById('chat-window'),
    chatBox = document.getElementById('chat-box'),
    sendButton = document.getElementById('send-button');
    usernameBox = document.getElementById('username-box');

//---------- EMIT EVENTS ----------//

sendButton.addEventListener('click', function(){
    socket.emit('sendMessage', {
        username: usernameBox.value,
        chatMessage: chatBox.value
    });

    chatWindow.innerHTML += '<div class="chat-message-outgoing">' + 
                                '<div class="message-name">' + 
                                    '<h2>' + usernameBox.value + '</h2>' + 
                                '</div>' + 
                            '<div class = "message-body">' + 
                                '<p>' + chatBox.value + '</p>' + 
                            '</div> </div>';

    chatWindow.scrollTop = chatWindow.scrollHeight; // *this scrolls the thing to show new messages at bottom
});

chatBox.addEventListener('keydown', function(event){
    if(event.key === 'Enter')
    {
        sendButton.click(); 
    }
});

//---------- LISTEN EVENTS ----------//

socket.on('sendMessage', function(data){
    chatWindow.innerHTML += '<div class="chat-message-incoming">' + 
                                '<div class="message-name">' + 
                                    '<h2>' + data.username + '</h2>' + 
                                '</div>' + 
                            '<div class = "message-body">' + 
                                '<p>' + data.chatMessage + '</p>' + 
                            '</div> </div>';

    chatWindow.scrollTop = chatWindow.scrollHeight; // *
});