const BG_COLOUR = '#231f20'
const SNAKE_COLOUR = '#c2c2c2'
const FOOD_COLOUR = '#e66916'
let URL = '';//horuku url

if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    URL = 'http://localhost:3001';
}

const socket = io(URL)
socket.on('init', handleInit)
socket.on('gameState', handleGameState)
socket.on('gameOver', handleGameOver)
socket.on('gameCode', handleGameCode)
socket.on('unknownGame', handleunknownGame)
socket.on('tooManyPlayers', handletooManyPlayers)




const gameScreen = document.getElementById('gameScreen')
const initialScreen = document.getElementById('initialScreen')
const newGameBtn = document.getElementById('newGameButton')
const joinGameBtn = document.getElementById('joinGameButton')
const gameCodeInput = document.getElementById('gameCodeInput')
const gameCodeDisplay = document.getElementById('gameCodeDisplay')



newGameBtn.addEventListener('click', newGame)
joinGameBtn.addEventListener('click', joinGame)

function newGame() {

    socket.emit('newGame')
    init()
}

function joinGame() {
    const code = gameCodeInput.value
    //console.log(code);
    socket.emit('joinGame', code)
    init()
}

let canvas, ctx
let playerNumber
let gameActive = false
function init() {
    initialScreen.style.display = 'none'
    gameScreen.style.display = 'block'

    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')

    canvas.width = canvas.height = 600
    ctx.fillStyle = BG_COLOUR
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    document.addEventListener('keydown', keydown)
    gameActive = true
}

function keydown(e) {
    // //console.log(e.keyCode);
    socket.emit('keydown', e.keyCode)
}


function paintGame(state) {
    ctx.fillStyle = BG_COLOUR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const food = state.food
    const gridsize = state.gridsize
    const size = canvas.width / gridsize

    ctx.fillStyle = FOOD_COLOUR
    ctx.fillRect(food.x * size, food.y * size, size, size)

    paintPlayer(state.players[0], size, SNAKE_COLOUR)
    paintPlayer(state.players[1], size, 'red')
}

function paintPlayer(playerState, size, colour) {
    const snake = playerState.snake
    ctx.fillStyle = colour
    for (let cell of snake) {
        ctx.fillRect(cell.x * size, cell.y * size, size, size)

    }

}


function handleInit(number) {
    //console.log(number);
    playerNumber = number
}

function handleGameState(gameState) {

    if (!gameActive) {
        return
    }
    // //console.log("gamestate", gameState);
    gameState = JSON.parse(gameState)
    requestAnimationFrame(() => {
        paintGame(gameState)
    })

}

function handleGameOver(data) {

    if (!gameActive) {
        return
    }
    data = JSON.parse(data)
    if (data.winner === playerNumber) {
        alert('you winnnn')
    } else {
        alert('game over')
    }

    gameActive = false
}

function handleGameCode(gameCode) {
    gameCodeDisplay.innerText = gameCode
}
function handleunknownGame() {
    reset()
    alert('handleunknownGame')
}

function handletooManyPlayers() {
    reset()
    alert('handletooManyPlayers')

}

function reset() {
    playerNumber = null
    gameCodeInput.value = ''
    gameCodeDisplay.innerText = ''
    initialScreen.style.display = ''
    gameScreen.style.display = 'none'

}