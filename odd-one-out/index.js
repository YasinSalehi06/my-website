const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'chatapp' directory
app.use('/odd-one-out', express.static(path.dirname(__dirname)));

app.get('/odd-one-out/', (req, res) => {
  res.sendFile(path.join(path.dirname(path.dirname(__dirname)), 'odd-one-out.html'));
});

io.on('connection', (socket) => {
  io.emit('chat message', 'A new user has joined the chat');
  
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  
  socket.on('disconnect', () => {
    io.emit('chat message', 'A user has left the chat');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
