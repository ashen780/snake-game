
const server = require('http').createServer();
const dotenv = require('dotenv').config();
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});
const { initGame, gameLoop, getUpdatedVelocity } = require('./game');
const { FRAME_RATE } = require('./constants')
const { makeid } = require('./utils')
const state = {}
const clientRomms = {}

const port = process.env.PORT || 3001;
io.on('connection', client => {
    //console.log("conected");
    //console.log('all rooms', io.sockets.adapter.rooms);
    client.on('keydown', handleKeydown)
    client.on('newGame', handlenewGame)
    client.on('joinGame', handlejoinGame)

    function handlejoinGame(gameCode) {

        //console.log('handlejoinGame gameCode', gameCode);//here
        //console.log('all rooms', io.sockets.adapter.rooms);
        const room = io.sockets.adapter.rooms.get(gameCode);
        //console.log('room', room);
        let allUsers
        if (room) {
            allUsers = room
        }
        //console.log('allUsers', allUsers);

        let numClients = 0
        if (allUsers) {
            numClients = allUsers.size
        }
        //console.log('numClients', numClients);
        if (numClients === 0) {
            client.emit('unknownGame')
            return
        }
        else if (numClients > 1) {
            client.emit('tooManyPlayers')
            return
        }

        clientRomms[client.id] = gameCode
        client.join(gameCode)
        client.number = 2
        client.emit('init', 2)

        startGameInterval(gameCode)

    }
    function handlenewGame() {
        let roomName = makeid(5)
        clientRomms[client.id] = roomName
        client.emit('gameCode', roomName)

        state[roomName] = initGame()
        client.join(roomName)
        client.number = 1
        client.emit('init', 1)
    }
    function handleKeydown(keyCode) {
        const roomName = clientRomms[client.id]
        if (!roomName) {
            return
        }


        try {
            //console.log(keyCode);
            keyCode = parseInt(keyCode)
        } catch (error) {
            console.error(error)
            return
        }

        const vel = getUpdatedVelocity(keyCode)
        if (vel) {
            state[roomName].players[client.number - 1].vel = vel
        }

    }


})


function startGameInterval(roomName) {
    //console.log('startGameInterval');

    const intervalId = setInterval(() => {
        const winner = gameLoop(state[roomName])
        //console.log('interval', 1000 / FRAME_RATE);
        //console.log('winner', winner);
        if (!winner) {
            emitGameState(roomName, state[roomName])

        } else {
            emitGameOver(roomName, winner)
            //console.log('game over');
            state[roomName] = null
            clearInterval(intervalId)

        }
    }, 1000 / FRAME_RATE);

}



function emitGameState(roomName, state) {
    io.sockets.in(roomName)
        .emit('gameState', JSON.stringify(state))
}

function emitGameOver(roomName, winner) {
    io.sockets.in(roomName)
        .emit('gameOver', JSON.stringify({ winner }))
}

server.listen(port)
console.log(`start on port ${port}`);


