const uuidv4 = require('uuid/v4');

class Room {
    constructor() {
        this.rooms = []
    }


    get roomList() {
        return this.rooms;
    }

    getRoom(id) {
        return this.rooms.filter((room) => room.id === id)[0]
    }

    joinRoom(roomId, clientUser) {
        const room = this.getRoom(roomId);

        if (room.joined.length > 1 && room.owner) {
            return;
        }
        room.joined.push({ ...clientUser, ready: false })
        return room;
    }

    gamerReadyChange(roomId, clientUser) {
        const room = this.getRoom(roomId);

    }
    createRoboticRoom(roomName) {
        let room = { id: uuidv4(), roomName, joined: [], gameChessStep: [], started: false };
        this.rooms.push(room);
        return room;
    }

    createRoom(roomName, owner) {
        let room = { id: 'room' + owner.id, roomName, owner, joined: [], gameChessStep: [], started: false };
        this.rooms.push(room);
        return room;
    }

    leaveRoom(id) {
        let room = this.getRoom(id);
        if (room) {
            this.rooms = this.rooms.filter((room) => room.id !== id);
        }
        return room;
    }

    addChessPos(roomId, chessPos) {
        const roomIndex = this.rooms.map(room => room.id).indexOf(roomId)
        this.rooms[roomIndex].gameChessStep.push(chessPos)
        return this.getRoom(roomId)
    }

    setStartGame(roomId) {
        const roomIndex = this.rooms.map(room => room.id).indexOf(roomId)
        this.rooms[roomIndex].started = true;
    }
}
const room = new Room()
module.exports = room