const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users
let users = {};

io.on('connection', (socket) => {       //it is instance of socket that will listen to all requests
    console.log('New user connected:', socket.id);  //consoles on server side

    // Listen for new user joining
    socket.on('new-user', (username) => { 
        users[socket.id] = username;
        io.emit('user-connected', username); 
    });

    // Listen for chat messages
    socket.on('send-chat-message', (message) => {
        io.emit('chat-message', { 
            user: users[socket.id], 
            message: message 
        });
    });

    // Listen for disconnections
    socket.on('disconnect', () => {
        io.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

