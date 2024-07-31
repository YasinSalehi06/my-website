const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  path: '/chatapp/socket.io'
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the chat application
app.get('/chatapp', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chatapp', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
