const MQTT = require("mqtt");

const client = MQTT.connect(`${process.env.BROKER_IP}:${process.env.BROKER_PORT}`);
// When passing async functions as event listeners, make sure to have a try catch block
let gameStatus = null;

client.on('connect', function () {
    client.subscribe('pressChess', function (err) {
        if (!err) console.log('subscribe: pressChess!')
    })
    client.subscribe('getGameState', (err) => {
        if (!err) console.log('subscribe: getGameState!')
    })
    client.subscribe('resetGame', (err) => {
        if (!err) console.log('subscribe: resetGame!')
    })
})

client.on('message', function (topic, message) {
    switch (topic) {
        case 'pressChess':
            gameStatus = JSON.parse(message);
            console.log('pressChess: ', gameStatus)
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
    }
})
module.exports = client