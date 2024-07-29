document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const startGameButton = document.getElementById('start-game');
    const wordDisplay = document.getElementById('word-display');
    const responseButtons = document.getElementById('response-buttons');
    const votingButtons = document.getElementById('voting-buttons');

    startGameButton.addEventListener('click', () => {
        socket.emit('startGame');
    });

    socket.on('assignWord', (word) => {
        wordDisplay.innerText = `Your word is: ${word}`;
    });

    socket.on('question', (question) => {
        // Display question and options for responses
    });

    socket.on('showResponses', (responses) => {
        responseButtons.innerHTML = ''; // Clear previous responses
        responses.forEach((response, index) => {
            const button = document.createElement('button');
            button.innerText = response;
            button.onclick = () => socket.emit('vote', index);
            responseButtons.appendChild(button);
        });
    });

    socket.on('votingResult', (result) => {
        // Display result of the voting
    });
});
