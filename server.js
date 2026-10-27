// 回転式チェス オンライン対戦サーバー
// 使い方: このファイルをゲームのファイル（index.html / script.js / style.css）と同じフォルダに置いて
//   npm install
//   npm start
// ブラウザで http://localhost:3000 を開くとゲームが遊べます。
// 同じWi-Fiのスマホからは http://（PCのIPアドレス）:3000 でも開けます。

const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// このフォルダ内のゲームファイル（index.html など）をそのまま配信する
app.use(express.static(__dirname));

const rooms = new Map(); // ルームコード -> Set<socket.id>（最大2人）

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    do {
        code = '';
        for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    } while (rooms.has(code));
    return code;
}

io.on('connection', (socket) => {
    let myRoom = null;

    socket.on('create-room', () => {
        const code = generateRoomCode();
        rooms.set(code, new Set([socket.id]));
        myRoom = code;
        socket.join(code);
        socket.emit('room-created', code);
        console.log(`ルーム作成: ${code}`);
    });

    socket.on('join-room', (rawCode) => {
        const code = String(rawCode || '').toUpperCase().trim();
        const room = rooms.get(code);
        if (!room) {
            socket.emit('join-error', 'ルームが見つかりません');
            return;
        }
        if (room.size >= 2) {
            socket.emit('join-error', 'ルームは満員です');
            return;
        }
        room.add(socket.id);
        myRoom = code;
        socket.join(code);
        socket.emit('joined', code);
        socket.to(code).emit('peer-joined');
        console.log(`ルーム参加: ${code}（${room.size}人）`);
    });

    // ゲームの通信（盤面・チャット・申し出など）は相手にそのまま中継する
    socket.on('relay', (data) => {
        if (myRoom) socket.to(myRoom).emit('relay', data);
    });

    socket.on('disconnect', () => {
        if (!myRoom) return;
        const room = rooms.get(myRoom);
        if (room) {
            room.delete(socket.id);
            if (room.size === 0) rooms.delete(myRoom);
            else socket.to(myRoom).emit('peer-left');
        }
        console.log(`切断: ${myRoom}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`回転式チェス サーバー起動: http://localhost:${PORT}`);
});
