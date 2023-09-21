const socket = io();
document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();

  var user = document.getElementById('user').value;
  var text = document.getElementById('input').value;

  socket.emit('chat message', { user: user, text: text });
  
  document.getElementById('input').value = '';
  return false;
});

socket.on('chat message', function(message) {
  var messages = document.getElementById('messages');
  var li = document.createElement('li');
  li.textContent = `${message.user}: ${message.message}`; 
  messages.appendChild(li);
});

socket.on('previous messages', function(messages) {
  console.log('Received previous messages:', messages);
  var messagesList = document.getElementById('messages');
  
  messages.forEach(function(message) {
      var li = document.createElement('li');
      li.textContent = `${message.user}: ${message.message}`;  
      messagesList.appendChild(li);
  });
});