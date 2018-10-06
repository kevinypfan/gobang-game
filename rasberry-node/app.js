require('./config/config');
const express = require('express');
const uuidv4 = require('uuid/v4');
const bodyParser = require('body-parser')
const _ = require('lodash');
const cors = require('cors');
const { isRealString } = require('./utils/validation')
const mqttPub = require('./mqttPub')
const user = require('./utils/users');
const room = require('./utils/rooms');

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.post('/entrySystem', (req, res) => {
    const body = _.pick(req.body, ['name'])
    if (!isRealString(body.name)) {
        return callback('Name is required!')
    }

    const newUser = user.addUser(uuidv4(), body.name);
    res.status(201).send(newUser)
})

app.post('/createRoom', (req, res) => {
    const body = _.pick(req.body, ['roomName', 'owner'])
    if (user.getUser(body.owner.id) == null) {
        return res.status(401).send('Should be login!')
    }
    if (!isRealString(body.roomName)) {
        return callback(402, 'roomName is required!')
    }
    const newRoom = room.createRoom(body.roomName, body.owner);
    mqttPub.publish('gobang/updateRoomList', JSON.stringify(newRoom))
    res.status(201).send(newRoom)
})

app.get('/getRoomList', (req, res) => {
    res.status(200).send(room.roomList)
})

app.get('/getRoomStatus/:roomId', (req, res) => {
    const gameRoom = room.getRoom(req.params.roomId);
    console.log(gameRoom)
    if (!gameRoom) {
        return res.status(404).send('no room!');
    }
    res.status(200).send(gameRoom);
})

app.post('/joinRoom', (req, res) => {
    const body = _.pick(req.body, ['roomId', 'gamer'])
    const nowRoom = room.getRoom(body.roomId);
    if (nowRoom.joined.length != 0 && nowRoom.owner) {
        return res.status(406).send('Room fulled');
    }
    const gameRoom = room.joinRoom(body.roomId, body.gamer)
    if (!gameRoom) {
        return res.status(404).send('Room has some error!');
    }
    mqttPub.publish(`gobang/updateRoomList`, JSON.stringify(room.roomList))
    mqttPub.publish(`gobang/${gameRoom.id}/updateRoomDetail`, JSON.stringify(gameRoom), null, (err) => {
        if (err) return res.status(406).send({ error: true, message: err })
        if (gameRoom.joined.length == 2) {
            mqttPub.publish(`gobang/${gameRoom.id}/startGame`, 'start', null, (err) => {
                if (err) return res.status(406).send({ error: true, message: err })
                res.status(206).send({ error: false, message: 'game start!' })
            })
        }
        res.status(206).send(gameRoom)
    })
})

app.post('/startGame', (req, res) => {
    const body = _.pick(req.body, ['user', 'roomData'])
    if (body.user.id != body.roomData.owner.id) {
        return res.status(406).send({ error: true, message: 'only owner can start the game!' })
    }
    mqttPub.publish(`gobang/${body.roomData.id}/startGame`, 'start', null, (err) => {
        if (err) return res.status(406).send({ error: true, message: err })
        res.status(206).send({ error: false, message: 'game start!' })
    })
})

app.post('/hasUser', (req, res) => {
    const body = _.pick(req.body, ['userId'])
    const hasUser = user.getUser(body.userId)
    res.status(200).send(hasUser);
})

app.listen(process.env.PORT, () => {
    console.log('server start up port: ', process.env.PORT)
})