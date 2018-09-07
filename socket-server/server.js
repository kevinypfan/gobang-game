import http from 'http';
import socketio from 'socket.io';
import { isRealString } from './utils/validation';
import User from './utils/users';
import Room from './utils/rooms';

const server = http.createServer();
const io = socketio(server);

const user = new User();
const room = new Room();

io.on('connection', function (client) {
  console.log(client.id)
  client.on('enterSystem', (params, callback) => {
    if (!isRealString(params.name)) {
      return callback('Name is required!')
    }
    user.removeUser(client.id);
    const newUser = user.addUser(client.id, params.name);
    return callback(null, newUser);
  })

  client.on('userList', (option, callback) => {
    return callback(user.userList)
  })

  client.on('hasUser', ({ userId, room }, callback) => {
    console.log(userId, room)
    const hereUser = user.getUser(userId)
    if (!hereUser) {
      return callback("Don't have user")
    }
    if (room) {
      client.join(room.roomName);
    }
    return callback(null, hereUser);
  })

  client.on('getRoomList', () => {
    client.emit('getRoomList', room.roomList)
  })

  client.on('getRoomStatus', (roomId, callback) => {
    const gameRoom = room.getRoom(roomId);
    if (!gameRoom) {
      return callback('no room!');
    }
    return callback(null, gameRoom);
  })

  client.on('createRoom', (roomConfig, callback) => {
    const { roomName, owner } = roomConfig;
    if (user.getUser(owner.id) == null) {
      return callback('Should be login!')
    }
    if (!isRealString(roomName)) {
      return callback('roomName is required!')
    }
    const newRoom = room.createRoom(roomName, owner);
    client.join(roomName);
    client.broadcast.emit('updateRoomList', newRoom)
    callback(null, newRoom);
  })

  client.on('joinRoom', function (joinConfig, callback) {
    const { roomId, gamer } = joinConfig;
    const nowRoom = room.getRoom(roomId);
    if (nowRoom.joined.length != 0) {
      return callback('Room fulled');
    }
    const gameRoom = room.joinRoom(roomId, gamer)
    if (!gameRoom) {
      return callback('Room has some error!');
    }
    client.join(gameRoom.roomName);
    client.broadcast.emit('updateRoomList', room.roomList);
    io.to(gameRoom.roomName).emit('updateRoomDetail', gameRoom);
    return callback(null, gameRoom)
  });

  client.on('startGame', (roomData) => {
    io.to(roomData.roomName).emit('gameStarted', roomData);
  })

  client.on('pressChess', (pressConfig, callback) => {
    const { chessPos, roomData, userData } = pressConfig;
    client.broadcast.to(roomData.roomName).emit('chessPressed', { chessPos, userData });
    return callback();
  })

  client.on('resetGame', (roomData) => {
    io.to(roomData.roomName).emit('onResetGame');
  })

  client.on('disconnect', function () {
    console.log(client.id)
  });
});



server.listen(3000);