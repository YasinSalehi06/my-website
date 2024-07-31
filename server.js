// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

let rooms = {};

app.use(express.static('my-website'));

io.on('connection', (socket) => {
    socket.on('createRoom', () => {
        const roomId = uuidv4();
        rooms[roomId] = { players: [], traitor: null, word: null, answers: [] };
        socket.join(roomId);
        socket.emit('roomCreated', roomId);
    });

    socket.on('joinRoom', (roomId) => {
        if (rooms[roomId]) {
            rooms[roomId].players.push(socket.id);
            socket.join(roomId);
            io.in(roomId).emit('playerJoined', rooms[roomId].players.length);
        } else {
            socket.emit('error', 'Room does not exist');
        }
    });

    socket.on('startGame', (roomId) => {
        if (rooms[roomId]) {
            const players = rooms[roomId].players;
            const traitorIndex = Math.floor(Math.random() * players.length);
            rooms[roomId].traitor = players[traitorIndex];
            const wordList = ["apple", "banana", "cherry", "date", "elderberry"];
            const questionList = ["Describe the taste", "What color is it?", "Where is it grown?"];
            const commonWord = wordList[Math.floor(Math.random() * wordList.length)];
            const traitorWord = wordList[Math.floor(Math.random() * wordList.length)];

            players.forEach((player, index) => {
                io.to(player).emit('assignWord', index === traitorIndex ? traitorWord : commonWord);
            });
            io.in(roomId).emit('gameStarted', questionList);
        }
    });

    socket.on('submitAnswer', (roomId, answer) => {
        if (rooms[roomId]) {
            rooms[roomId].answers.push({ player: socket.id, answer });
            if (rooms[roomId].answers.length === rooms[roomId].players.length) {
                io.in(roomId).emit('displayAnswers', rooms[roomId].answers);
            }
        }
    });

    socket.on('vote', (roomId, playerId) => {
        if (rooms[roomId]) {
            // Implement voting logic here
        }
    });

    socket.on('disconnect', () => {
        for (const roomId in rooms) {
            const room = rooms[roomId];
            room.players = room.players.filter(player => player !== socket.id);
            if (room.players.length === 0) {
                delete rooms[roomId];
            }
        }
    });
});

server.listen(port, () => console.log(`Server running on port ${port}`));
