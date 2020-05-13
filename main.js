console.log("JS LOADED")

/*----- constants -----*/
let pieceIcons = {
    wP: '♙',
    wKn: '♘',
    wB: '♗',
    wR: '♖',
    wQ: '♕',
    wK: '♔',
    bP: '♟',
    bKn: '♞',
    bB: '♝',
    bR: '♜',
    bQ: '♛',
    bK: '♚'
}

let players = {
    '1': 'w',
    '-1': 'b'
}


/*----- app's state (variables) -----*/
let board;
let turn = 1
let movingPiece = null
let piece = null
/*----- cached element references -----*/
let gameBoard = document.getElementById('board')
let reset = document.querySelector('button')

/*----- event listeners -----*/
document.getElementById('board')
    .addEventListener('click', handleClick);
reset.addEventListener('click', init);
/*----- functions -----*/

init()

function init() {
    board = [
        ['wR', 'wKn', 'wB', 'wK', 'wQ', 'wB', 'wKn', 'wR',],
        ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP',],
        [null, null, null, null, null, null, null, null,],
        [null, null, null, null, null, null, null, null,],
        [null, null, null, null, null, null, null, null,],
        [null, null, null, null, null, null, null, null,],
        ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP',],
        ['bR', 'bKn', 'bB', 'bQ', 'bK', 'bB', 'bKn', 'bR',],
    ]
    appendBoard()
    // render()
}

function handleClick(e) {
    let i = Number(e.target.id.split('')[1])
    let j = Number(e.target.id.split('')[3])
    piece = board[i][j]
    let desired = [i, j]

    if (piece && movingPiece == null) {
        movingPiece = [piece, i, j]
    } else if (movingPiece) {
        console.log(movingPiece, desired)
        if (checkValidMove(movingPiece, desired)) {
            board[i][j] = movingPiece[0]
            board[movingPiece[1]][movingPiece[2]] = null
            movingPiece = null
            piece = null
            turn *= -1
        } else {
            movingPiece = [piece, i, j]
            piece = null
            console.log("Not a Valid Move")
        }
    } else {
        console.log('no piece to move')
        return
    }
    appendBoard()
}

function checkValidMove(moving, desired) {
    // black pawn logic
    if (turn === -1) {
        if (moving[0] === 'bP') {
            if (board[desired[0]][desired[1]] === null) {
                if (moving[1] - 1 == desired[0] && moving[2] == desired[1]) {
                    console.log("WE'VE GOT A VALID MOVE!")
                    return true
                } else if (moving[1] == 6 && desired[0] == 4 && moving[2] == desired[1]) {
                    return true
                }

            } else {
                if (board[desired[0]][desired[1]].split('')[0] == 'b') {
                    console.log("same team, invalid move!")

                    return false
                }
                if (board[desired[0]][desired[1]].split('')[0] == 'w') {
                    console.log("Opponent")
                    if (Number(moving[1]) - 1 == desired[0] && (moving[2] - 1 == desired[1] || moving[2] + 1 == desired[1])) {
                        console.log("CAPTURED!")
                        return true
                    }
                }
            }
        }
    }
    // white pawn logic
    if (turn === 1) {
        if (moving[0] === 'wP') {
            if (board[desired[0]][desired[1]] === null) {
                if (Number(moving[1]) + 1 == desired[0] && moving[2] == desired[1]) {
                    // console.log("WE'VE GOT A VALID MOVE!")
                    return true
                } else if (moving[1] == 1 && desired[0] == 3 && moving[2] == desired[1]) {
                    return true
                }

            } else {
                if (board[desired[0]][desired[1]].split('')[0] == 'w') {
                    // console.log("same team, invalid move!")
                    return false
                }
                if (board[desired[0]][desired[1]].split('')[0] == 'b') {

                    // console.log("Opponent")
                    if (Number(moving[1]) + 1 == desired[0] && (moving[2] - 1 == desired[1] || Number(moving[2]) + 1 == desired[1])) {
                        // console.log("CAPTURED!")
                        return true
                    }
                }
            }
        }
    }
}


function appendBoard() {
    gameBoard.textContent = ''
    board.forEach((e, i) => {
        e.forEach((f, j) => {
            let square = document.createElement('div')
            square.setAttribute('id', `c${i}r${j}`)
            square.setAttribute('class', 'square')
            let x = (j + i) % 2
            x ? square.style.backgroundColor = 'brown'
                : square.style.backgroundColor = 'beige'
            square.textContent = pieceIcons[f]
            gameBoard.appendChild(square)
        })
    })
}

