const messageForm = document.getElementById('chatRoomMessageForm');
const messageInput = document.getElementById('chatRoomInput');
const messagesList = document.getElementById('chatRoomMessages');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chatroomMessage', message);
    messageInput.value = '';
  }
});

socket.on('chatroomMessage', (message) => {
  const li = document.createElement('li');
  li.textContent = message;
  messagesList.appendChild(li);
});