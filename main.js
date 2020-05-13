console.log("JS LOADED")

/*----- constants -----*/
const icons = {
    Pawn: '♟',
    Knight: '♞',
    Bishop: '♝',
    Rook: '♜',
    Queen: '♛',
    King: '♚'
}
const players = {
    '1': 'white',
    '-1': 'black'
}
/*----- state -----*/
let state = {
    board: null,
    turn: 1,
    movingPiece: null,
    selectedSquare: null
}
/*----- cached elements -----*/
let gameBoard = document.getElementById('board')
// let flipBoard = document.getElementById('flipBoard')
let reset = document.getElementById('reset')
/*----- event Listeners -----*/
gameBoard.addEventListener('click', handleClick)
// flipBoard.addEventListener('click', flip)
reset.addEventListener('click', init)
/*----- classes -----*/


class Piece {
    constructor(team, pos, prev, icon) {
        this.team = team
        this.pos = pos
        this.prev = prev
        this.icon = icon
    }
    canMove() {
        if (players[state.turn] == this.team) return true
        return false
    }
    selected() {
        state.movingPiece = this
    }
}

class Pawn extends Piece {
    constructor(team, pos, prev, icon) {
        super(team, pos, prev, icon)
        this.team = team
        this.pos = pos
        this.prev = prev
        this.icon = icon
    }
    checkMove() {
        console.log("HITTING")
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        console.log(i, j, state.selectedSquare)
        if (this.team == 'white') {
            // return true
            if(i + 1 == state.selectedSquare[0] && j == state.selectedSquare[1]){
                return true
            }

        } else {
            // return true
            if(i - 1 == state.selectedSquare[0] && j == state.selectedSquare[1]){
                return true
            }
        }
    }
}

class Knight extends Piece {
    constructor(team, pos, prev, icon) {
        super(team, pos, prev, icon)
        this.team = team
        this.pos = pos
        this.prev = prev
        this.icon = icon
    }
    checkMove() {

    }
}

class Bishop extends Piece {
    constructor(team, pos, prev, icon) {
        super(team, pos, prev, icon)
        this.team = team
        this.pos = pos
        this.prev = prev
        this.icon = icon
    }
    checkMove() {

    }
}

class Rook extends Piece {
    constructor(team, pos, prev, icon) {
        super(team, pos, prev, icon)
        this.team = team
        this.pos = pos
        this.prev = prev
        this.icon = icon
    }
    checkMove() {

    }
}

class Queen extends Piece {
    constructor(team, pos, prev, icon) {
        super(team, pos, prev, icon)
        this.team = team
        this.pos = pos
        this.prev = prev
        this.icon = icon
    }
    checkMove() {

    }
}

class King extends Piece {
    constructor(team, pos, prev, icon) {
        super(team, pos, prev, icon)
        this.team = team
        this.pos = pos
        this.prev = prev
        this.icon = icon
    }
    checkMove() {

    }
}




/*----- functions -----*/
// initialize board and fill it with pieces at starting position
let board = new Array(8).fill(new Array(8).fill(null))

board = board.map((row, i) => {
    return row.map((sq, j) => {
        if (!i) {
            if (!j || j == 7) return new Rook('white', `r${i}c${j}`, [], '♖')
            else if (j == 1 || j == 6) return new Knight('white', `r${i}c${j}`, [], '♘')
            else if (j == 2 || j == 5) return new Bishop('white', `r${i}c${j}`, [], '♗')
            else if (j == 4) return new Queen('white', `r${i}c${j}`, [], '♕')
            else return new King('white', `r${i}c${j}`, [], '♔')
        }
        if (i == 1) return new Pawn('white', `r${i}c${j}`, [], '♙')
        if (i == 6) return new Pawn('black', `r${i}c${j}`, [], '♟')
        if (i == 7) {
            if (!j || j == 7) return new Rook('black', `r${i}c${j}`, [], '♜')
            else if (j == 1 || j == 6) return new Knight('black', `r${i}c${j}`, [], '♞')
            else if (j == 2 || j == 5) return new Bishop('black', `r${i}c${j}`, [], '♝')
            else if (j == 4) return new Queen('black', `r${i}c${j}`, [], '♛')
            else return new King('black', `r${i}c${j}`, [], '♚')
        }
        return sq
    })
})

init()

function init() {

    renderBoard()
}

function handleClick(e) {
    // grab indices of selected piece
    let i = Number(e.target.id.split('')[1])
    let j = Number(e.target.id.split('')[3])
    // check to see if the space selected has a piece
    let attemptedSelect = board[i][j]
    // if so, check to see if it is the proper player's turn
    if (attemptedSelect) {
        if (attemptedSelect.canMove()) {
            console.log("Your Turn :)")
            attemptedSelect.selected()
            state.movingPiece = attemptedSelect

            console.log("THIS IS THE SELECTED PIECE", state.movingPiece)
        } else {
            console.log("Not your turn :(", attemptedSelect)
            return
        }
    } else {

        console.log(attemptedSelect)
        if (state.movingPiece && !attemptedSelect) {
            state.selectedSquare = [i,j]
            if (state.movingPiece.checkMove()) {
                board[i][j] = state.movingPiece
                let oldI = state.movingPiece.pos.split('')[1]
                let oldJ = state.movingPiece.pos.split('')[3]
                state.movingPiece.pos = `r${i}c${j}`
                state.movingPiece.prev.push(`r${oldI}c${oldJ}`)
                board[oldI][oldJ] = null
                state.movingPiece = null
                state.selectedSquare = null
                state.turn *= -1
            } else {

                console.log("Invalid move, please try again!")
            }
        }
    }
    renderBoard()
}

function renderBoard() {
    gameBoard.textContent = ''
    board.forEach((e, i) => {
        e.forEach((f, j) => {
            // f ? console.log(f) : []
            let square = document.createElement('div')
            square.setAttribute('id', `r${i}c${j}`)
            square.setAttribute('class', 'square')
            let x = (j + i) % 2
            x ? square.style.backgroundColor = 'brown'
                : square.style.backgroundColor = 'beige'
            square.textContent = f ? f.icon : ''
            if (state.movingPiece) {
                let idx = state.movingPiece.pos.split('')[1]
                let jdx = state.movingPiece.pos.split('')[3]
                if (i == idx && j == jdx) {
                    square.style.backgroundColor = 'orange'
                }
            }
            gameBoard.appendChild(square)
        })
    })
}

