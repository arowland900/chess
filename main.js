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

let movements = {
    wP: {

    }
}

/*----- app's state (variables) -----*/
let board = [
    ['wR', 'wKn', 'wB', 'wK', 'wQ', 'wB', 'wKn', 'wR',],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP',],
    [null, null, null, null, null, null, null, null,],
    [null, null, null, null, null, null, null, null,],
    [null, null, null, null, null, null, null, null,],
    [null, null, null, null, null, null, null, null,],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP',],
    ['bR', 'bKn', 'bB', 'bQ', 'bK', 'bB', 'bKn', 'bR',],
]
let turn = 1
let movingPiece = null
/*----- cached element references -----*/
let gameBoard = document.getElementById('board')

/*----- event listeners -----*/
document.getElementById('board')
    .addEventListener('click', handleClick);
/*----- functions -----*/



init()

function init() {

    appendBoard()
    // render()
}

function handleClick(e) {
    let i = e.target.id.split('')[1]
    let j = e.target.id.split('')[3]
    let piece = board[i][j]
    if (piece) {
        movingPiece = [piece, i, j]
    } else if (movingPiece) {
        checkValidMove(movingPiece, piece)
        board[i][j] = movingPiece[0]
        board[movingPiece[1]][movingPiece[2]] = null
        movingPiece = null
    } else {
        console.log('no piece to move')
        return
    }
    appendBoard()
}

function checkValidMove(piece, desiredSquare){
    
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

