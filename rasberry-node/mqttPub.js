const MQTT = require("mqtt");

const client = MQTT.connect(`${process.env.BROKER_IP}:${process.env.BROKER_PORT}`);
// When passing async functions as event listeners, make sure to have a try catch block
const room = require('./utils/rooms');
room.createRoboticRoom('Robotic Arm');

client.on('connect', function () {
    client.subscribe('gobang/#', function (err) {
        if (!err) console.log('subscribe: gobang/#')
    })
})

const waitRobot = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 3000)
    })
}

client.on('message', function (topic, message) {
    const topicArray = topic.split('/')
    if (topicArray[0] == 'gobang') {
        switch (topicArray[2]) {
            case 'pressChess':
                data = JSON.parse(message.toString());
                client.publish(`gobang/${data.roomData.id}/RoboAction`, JSON.stringify({ action: true }))
                waitRobot().then(_ => {
                    client.publish(`gobang/${data.roomData.id}/RoboAction`, JSON.stringify({ action: false }))
                })
                // 機械手臂溝通
                break;
            case 'getGameState':
                const strGameStatus = JSON.stringify(gameStatus)
                client.publish('gameState', strGameStatus)
                console.log('getGameState: ', gameStatus)
                break;
            case 'resetGame':
                gameStatus = null;
                client.publish('resetGame')
                console.log('resetGame: ', gameStatus)
                break;
            default:
                return;
        }
    }
})
module.exports = client