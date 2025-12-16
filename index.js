const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Разрешаем подключения со всех адресов (нужно для игр в браузере)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Игрок подключился:', socket.id);

    // Когда кто-то заходит в комнату
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Игрок ${socket.id} вошел в комнату: ${roomId}`);
    });

    // Когда игрок делает ход
    socket.on('make-move', (data) => {
        // data содержит { roomId, fromR, fromC, toR, toC }
        // Отправляем ход всем остальным в этой же комнате
        socket.to(data.roomId).emit('move-received', data);
    });

    socket.on('disconnect', () => {
        console.log('Игрок отключился');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});