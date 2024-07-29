const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'odd-one-out' directory
app.use('/static', express.static(__dirname));

// Serve the HTML file at the root path
app.get('/odd-one-out.html', (req, res) => {
  res.sendFile(path.join(path.dirname(__dirname), 'odd-one-out.html'));
});

// Socket.IO connection handling
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
