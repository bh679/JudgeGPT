const messageForm = document.getElementById('chatRoomMessageForm');
const messageInput = document.getElementById('chatRoomInput');
const messagesList = document.getElementById('chatRoomMessages');
const sendButton = document.getElementById('chatSubmitButton');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chatroomMessage', client.player.name + ": " + message);
    messageInput.value = '';
  }
});

socket.on('chatroomMessage', (message) => {
  const li = document.createElement('li');
  li.textContent = message;
  messagesList.appendChild(li);
});

messageInput.addEventListener('focus', function() {
  sendButton.style.display = 'inline'; // Show button when input is focused
  sendButton.placeholder="Audience Chatroom";
});

messageInput.addEventListener('blur', function() {
  sendButton.style.display = 'none'; // Hide button when focus is lost
  sendButton.placeholder="";
});
