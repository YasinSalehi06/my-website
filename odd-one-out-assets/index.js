const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/odd-one-out.html', (req, res) => {
  res.sendFile(path.join(path.dirname(__dirname) + '/odd-one-out.html'));
});

// Serve static files from the 'odd-one-out' folder
app.use('/odd-one-out', express.static(__dirname));

// Serve the HTML file from the 'chatapp' path
app.get('/odd-one-out', (req, res) => {
  res.sendFile(path.dirname(__dirname) + '/odd-one-out.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});