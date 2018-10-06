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
        if (room.joined.length > 1) {
            return;
        }
        room.joined.push({ ...clientUser, ready: false })
        return room;
    }

    gamerReadyChange(roomId, clientUser) {
        const room = this.getRoom(roomId);

    }

    createRoom(roomName, owner) {
        let room = { id: 'room' + owner.id, roomName, owner, joined: [] };
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
}
const room = new Room()
module.exports = room