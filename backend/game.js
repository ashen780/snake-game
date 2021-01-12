const { GRID_SIZE } = require('./constants')


module.exports = {

    initGame, gameLoop, getUpdatedVelocity,
}

function createGameState() {

    return {
        players: [{
            pos: {
                x: 3,
                y: 10
            },
            vel: {
                x: 1,
                y: 0
            },
            snake: [
                { x: 1, y: 10 },
                { x: 2, y: 10 },
                { x: 3, y: 10 }
            ]

        }, {
            pos: {
                x: 18,
                y: 10
            },
            vel: {
                x: 0,
                y: 0
            },
            snake: [
                { x: 20, y: 10 },
                { x: 19, y: 10 },
                { x: 18, y: 10 }
            ]

        }],
        food: {},
        gridsize: GRID_SIZE,
        active: true
    }

}

function gameLoop(state) {
    if (!state) {
        //console.log('no state');
        return 'no state'
    }

    const playerOne = state.players[0]
    const playerTwo = state.players[1]

    playerOne.pos.x += playerOne.vel.x
    playerOne.pos.y += playerOne.vel.y

    playerTwo.pos.x += playerTwo.vel.x
    playerTwo.pos.y += playerTwo.vel.y


    if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
        //console.log("game over 1");
        return 2
    }

    if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRID_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y > GRID_SIZE) {
        //console.log("game over 1");
        return 1
    }

    if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
        //console.log("food eat")
        playerOne.snake.push({ ...playerOne.pos })
        playerOne.pos.x += playerOne.vel.x
        playerOne.pos.y += playerOne.vel.y
        RandomFood(state)
    }

    if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
        //console.log("food eat")
        playerTwo.snake.push({ ...playerTwo.pos })
        playerTwo.pos.x += playerTwo.vel.x
        playerTwo.pos.y += playerTwo.vel.y
        RandomFood(state)
    }

    if (playerOne.vel.x || playerOne.vel.y) {
        for (let cell of playerOne.snake) {
            if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
                //console.log("game over 2");

                return 2
            }
        }

        playerOne.snake.push({ ...playerOne.pos })
        playerOne.snake.shift()
    }

    if (playerTwo.vel.x || playerTwo.vel.y) {
        for (let cell of playerTwo.snake) {
            if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
                //console.log("game over 2");

                return 1
            }
        }

        playerTwo.snake.push({ ...playerTwo.pos })
        playerTwo.snake.shift()
    }


    return false

}
function RandomFood(state) {
    food = {

        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
    }
    //console.log("random food", food);

    for (let cell of state.players[0].snake) {
        // //console.log(cell.x, food.x, cell.y, food.y);
        if (cell.x === food.x && cell.y === food.y) {
            //console.log('new food');
            return RandomFood(state);
        }
    }
    for (let cell of state.players[1].snake) {
        // //console.log(cell.x, food.x, cell.y, food.y);
        if (cell.x === food.x && cell.y === food.y) {
            //console.log('new food');
            return RandomFood(state);
        }
    }
    state.food = food

}

function getUpdatedVelocity(keyCode) {
    switch (keyCode) {
        case 37://left
            {
                return {
                    x: -1, y: 0
                }
            }

        case 38://down
            {
                return {
                    x: 0, y: -1
                }
            }
        case 39://right
            {
                return {
                    x: 1, y: 0
                }
            }
        case 40://left
            {
                return {
                    x: 0, y: 1
                }
            }

    }
}

function initGame() {
    const state = createGameState()
    RandomFood(state);
    return state
}