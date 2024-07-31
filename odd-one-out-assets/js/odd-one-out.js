// odd-one-out-assets/js/odd-one-out.js
document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const playWithFriendsButton = document.getElementById('playWithFriends');
    const gameArea = document.getElementById('gameArea');
    const roomIdDisplay = document.getElementById('roomId');
    const questionDisplay = document.getElementById('question');
    const answersDisplay = document.getElementById('answers');
    const voteArea = document.getElementById('voteArea');
    const votesDisplay = document.getElementById('votes');

    let roomId;

    playWithFriendsButton.addEventListener('click', () => {
        socket.emit('createRoom');
    });

    socket.on('roomCreated', (id) => {
        roomId = id;
        roomIdDisplay.innerText = `Room ID: ${roomId}`;
        gameArea.style.display = 'block';
        // Update URL to include room ID
        history.pushState({}, '', `/odd-one-out/${roomId}`);
    });

    socket.on('playerJoined', (playerCount) => {
        // Update UI to show the number of players in the room
    });

    socket.on('gameStarted', (questions) => {
        // Randomly select a question to display
        const question = questions[Math.floor(Math.random() * questions.length)];
        questionDisplay.innerText = question;
        // Show input for players to submit answers
    });

    socket.on('assignWord', (word) => {
        // Display word to the player
    });

    socket.on('displayAnswers', (answers) => {
        // Display answers for voting
        answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.answer;
            button.addEventListener('click', () => {
                socket.emit('vote', roomId, answer.player);
            });
            answersDisplay.appendChild(button);
        });
        voteArea.style.display = 'block';
    });

    socket.on('voteResult', (result) => {
        // Display result of the vote
    });
});
