const socket = io();
const loginModal = document.getElementById('login-modal');
const usernameInput = document.getElementById('username-input');
const loginButton = document.getElementById('login-button');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const userCount = document.getElementById('user-count');

let username = '';

// Login functionality
loginButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        socket.emit('new-user', username);
        loginModal.style.display = 'none';
    }
});

// Send message functionality 
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('send-chat-message', message);
        // addMessage(username, message, 'user-message');
        messageInput.value = '';
    }
}

// Socket.io event listeners
socket.on('user-connected', (name) => {
    addNotification(`${name} joined the chat`);
});

socket.on('user-disconnected', (name) => {
    addNotification(`${name} left the chat`);
});

socket.on('chat-message', ({ user, message }) => {
    const messageClass = user === username ? 'user-message' : 'other-message';
    addMessage(user, message, messageClass);
});

socket.on('user-count', (count) => {
    userCount.textContent = `${count} user${count !== 1 ? 's' : ''} online`;
});

// Helper functions
function addMessage(user, message, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.innerHTML = `<strong>${user}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addNotification(message) {
    const notificationElement = document.createElement('div');
    notificationElement.classList.add('notification');
    notificationElement.textContent = message;
    chatMessages.appendChild(notificationElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}