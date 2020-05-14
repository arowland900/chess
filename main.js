console.log("JS LOADED")

/*----- constants -----*/
// const icons = {
//     Pawn: '♟',
//     Knight: '♞',
//     Bishop: '♝',
//     Rook: '♜',
//     Queen: '♛',
//     King: '♚'
// }
const players = {
    '1': 'white',
    '-1': 'black'
}
/*----- state -----*/
let state = {
    board: null,
    turn: 1,
    movingPiece: null,
    selectedSquare: null,
    whiteCheck: false,
    blackCheck: false
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
    isMyKingChecked() {

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
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        let newI = Number(state.selectedSquare[0])
        let newJ = Number(state.selectedSquare[1])
        let newPosition = board[newI][newJ]
        console.log("This the new position: ", newPosition)
        console.log(i, j, state.selectedSquare)
        if (this.team == 'white') {
            if (i + 1 == newI && j == newJ && newPosition == null) return true
            if (i + 2 == newI && j == newJ && i == 1 && newPosition == null) {
                let skippedPosition = board[i + 1][j]
                if (skippedPosition == null) {
                    return true
                }
            }
            if (i + 1 == newI && (j - 1 == newJ || j + 1 == newJ)) {
                console.log("White attacking black")
                if (newPosition) {

                    if (newPosition.team == 'black') {
                        console.log("HIT ATTACK BLACK")
                        movePiece(newI, newJ)
                    }
                }
            }
        } else {
            if (i - 1 == newI && j == newJ && newPosition == null) return true
            // console.log()
            if (i - 2 == newI && j == newJ && i == 6 && newPosition == null) {
                let skippedPosition = board[i - 1][j]
                if (skippedPosition == null) {
                    return true
                }
            }
            if (i - 1 == newI && (j - 1 == newJ || j + 1 == newJ)) {
                console.log("Black attacking white")
                if (newPosition) {
                    if (newPosition.team == 'white') {
                        console.log("HIT ATTACK WHITE")
                        movePiece(newI, newJ)
                    }
                }
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
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        let newI = Number(state.selectedSquare[0])
        let newJ = Number(state.selectedSquare[1])
        let newPosition = board[newI][newJ]
        console.log("This the new position: ", newPosition)
        console.log(i, j, state.selectedSquare)

        if (i + 1 == newI) {
            if (j - 2 == newJ || j + 2 == newJ) {
                if (newPosition == null) return true
                else if (newPosition.team != this.team) {
                    console.log("HIT OPPONENT : ", state.movingPiece)

                    return true
                }
            }
            else return false
        } else if (i + 2 == newI) {
            if (j - 1 == newJ || j + 1 == newJ) {
                if (newPosition == null) return true
                else if (newPosition.team != this.team) {
                    console.log("HIT OPPONENT : ", state.movingPiece)

                    return true
                }
            }
            else return false
        } else if (i - 1 == newI) {
            if (j - 2 == newJ || j + 2 == newJ) {
                if (newPosition == null) return true
                else if (newPosition.team != this.team) {
                    console.log("HIT OPPONENT : ", state.movingPiece)

                    return true
                }
            }
            else return false
        } else if (i - 2 == newI) {
            if (j - 1 == newJ || j + 1 == newJ) {
                if (newPosition == null) return true
                else if (newPosition.team != this.team) {
                    console.log("HIT OPPONENT : ", state.movingPiece)

                    return true
                }
            }
            else return false
        } else {
            return false
        }


        if (newPosition == null) return true
        else if (newPosition.team != this.team) {
            console.log("HIT OPPONENT : ", state.movingPiece)

            return true
        }
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
        console.log("HITTING")
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        let desiredI = state.selectedSquare[0]
        let desiredJ = state.selectedSquare[1]
        let selectedValue = board[desiredI][desiredJ]
        if (i == desiredI || j == desiredJ) {
            return false
        } else if (Math.abs(j - desiredJ) !== Math.abs(i - desiredI)) {
            return false
        } else {
            if (i < desiredI && j < desiredJ) {
                for (let startI = i + 1, startJ = j + 1; startI < desiredI; startI++, startJ++) {
                    if (board[startI][startJ]) return false
                }
            } else if (i < desiredI && j > desiredJ) {
                for (let startI = i + 1, startJ = j - 1; startI < desiredI; startI++, startJ--) {
                    if (board[startI][startJ]) return false
                }
            } else if (i > desiredI && j < desiredJ) {
                for (let startI = i - 1, startJ = j + 1; startI > desiredI; startI--, startJ++) {
                    if (board[startI][startJ]) return false
                }
            } else {
                for (let startI = i - 1, startJ = j - 1; startI > desiredI; startI--, startJ--) {
                    if (board[startI][startJ]) return false
                }
            }
        }
        if (selectedValue == null) return true
        else if (selectedValue.team != this.team) {
            console.log("HIT OPPONENT : ", state.movingPiece)

            return true
        }

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
        console.log("HITTING")
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        let desiredI = state.selectedSquare[0]
        let desiredJ = state.selectedSquare[1]
        let selectedValue = board[desiredI][desiredJ]
        if (i !== desiredI && j !== desiredJ) {
            return false
            // rooks moving left & right
        } else if (i == desiredI && j !== desiredJ) {
            if (j < desiredJ) {

                for (let start = j + 1; start < desiredJ; start++) {
                    console.log("HITTING", board[i][start])
                    if (board[i][start] !== null) {
                        return false
                    }
                }
            } else {
                for (let start = j - 1; start > desiredJ; start--) {
                    console.log("HITTING", board[i][start])
                    if (board[i][start] !== null) {
                        return false
                    }
                }
            }
            // rooks moving up & down
        } else if (j == desiredJ && i !== desiredI) {
            if (i > desiredI) {
                for (let start = i - 1; start > desiredI; start--) {
                    console.log("HITTING", board[start][j])
                    if (board[start][j] !== null) {
                        return false
                    }
                }
            } else {
                for (let start = i + 1; start < desiredI; start++) {
                    console.log("HITTING", board[start][j])
                    if (board[start][j] !== null) {
                        return false
                    }
                }
            }
        }
        if (selectedValue == null) return true
        else if (selectedValue.team != this.team) {
            console.log("HIT OPPONENT : ", state.movingPiece)

            return true
        }

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
        console.log("HITTING QUEEN")
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        let desiredI = state.selectedSquare[0]
        let desiredJ = state.selectedSquare[1]
        let selectedValue = board[desiredI][desiredJ]
        if (i !== desiredI && j !== desiredJ) {
            if (Math.abs(j - desiredJ) !== Math.abs(i - desiredI)) {
                return false
            }
            console.log("DIAGONAL QUEEN")
            if (i < desiredI && j < desiredJ) {
                for (let startI = i + 1, startJ = j + 1; startI < desiredI; startI++, startJ++) {
                    if (board[startI][startJ]) return false
                }
            } else if (i < desiredI && j > desiredJ) {
                for (let startI = i + 1, startJ = j - 1; startI < desiredI; startI++, startJ--) {
                    if (board[startI][startJ]) return false
                }
            } else if (i > desiredI && j < desiredJ) {
                for (let startI = i - 1, startJ = j + 1; startI > desiredI; startI--, startJ++) {
                    if (board[startI][startJ]) return false
                }
            } else {
                for (let startI = i - 1, startJ = j - 1; startI > desiredI; startI--, startJ--) {
                    console.log("HITTING DIAGONAL BACK  ")
                    if (board[startI][startJ]) return false
                }
            }
        } else {
            console.log("HELLOOOOOOOO")
            if (i == desiredI && j !== desiredJ) {
                if (j < desiredJ) {

                    for (let start = j + 1; start < desiredJ; start++) {
                        console.log("HITTING", board[i][start])
                        if (board[i][start] !== null) {
                            return false
                        }
                    }
                } else {
                    for (let start = j - 1; start > desiredJ; start--) {
                        console.log("HITTING", board[i][start])
                        if (board[i][start] !== null) {
                            return false
                        }
                    }
                }
            }
            else if (j == desiredJ && i !== desiredI) {
                // queen moving up & down
                if (i > desiredI) {
                    for (let start = i - 1; start > desiredI; start--) {
                        console.log("HITTING", board[start][j])
                        if (board[start][j] !== null) {
                            return false
                        }
                    }
                } else {
                    for (let start = i + 1; start < desiredI; start++) {
                        console.log("HITTING", board[start][j])
                        if (board[start][j] !== null) {
                            return false
                        }
                    }
                }
            } else {
                return false
            }
        }
        if (selectedValue == null) return true
        else if (selectedValue.team != this.team) {
            console.log("HIT OPPONENT : ", state.movingPiece)

            return true
        }

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
        console.log("HITTING KING")
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        let desiredI = state.selectedSquare[0]
        let desiredJ = state.selectedSquare[1]
        let selectedValue = board[desiredI][desiredJ]
        if (Math.abs(i - desiredI) > 1 || Math.abs(j - desiredJ) > 1) return false
        if (selectedValue == null) return true
        else if (selectedValue.team != this.team) {
            console.log("HIT OPPONENT : ", state.movingPiece)

            return true
        }


    }
}




/*----- functions -----*/
// initialize board and fill it with pieces at starting position

init()

function init() {
    state.turn = 1
    board = new Array(8).fill(new Array(8).fill(null))

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

    renderBoard()
}

function checkForCheck(brd) {
    // b is what   the potential new board is, if accepted, state.board becomes b
    let wKingLoc;
    let bKingLoc;
    let surroundingBlackKing = {
        top: null,
        bottom: null,
        right: null,
        left: null,
        topLeft: null,
        topRight: null,
        bottomRight: null,
        bottomLeft: null,
    }
    let surroundingWhiteKing = {
        top: null,
        bottom: null,
        right: null,
        left: null,
        topLeft: null,
        topRight: null,
        bottomRight: null,
        bottomLeft: null,
    }
    let a, b;
    // LOCATE KINGS
    brd.forEach((e, i) => {
        e.forEach((sq, j) => {
            if (sq instanceof King && sq.team == 'white') { wKingLoc = [i, j]; a = i; b = j }
            if (sq instanceof King && sq.team == 'black') { bKingLoc = [i, j]; c = i; d = j }
        })
    })

    console.log("WHITE KING LOC: ", wKingLoc)
    console.log("BLACK KING LOC: ", bKingLoc)
    console.log("X & Y: ", a, b)

    function checkHorizontal(posI, posJ, piece, surround){
        // for(let lCheck = posJ -1, rCheck = posJ +1; lCheck >= 0 || rCheck <= 7; lCheck--, rCheck++){
        //     if(brd[posI][lCheck]){ piece.horizontal.push(brd[posI][lCheck]) }
        //     if(brd[posI][rCheck]){ piece.horizontal.push(brd[posI][rCheck]) }
        //     if(piece.horizontal.length == 2) break
        // } 
        console.log(brd[posI], posJ, piece)
        // LEFT
        while(posJ >= 0 && !piece.left){
            let el = brd[posI][posJ]
            console.log(el, piece)
            if(el != piece){
                console.log("HITTING IF")

                surround.left = el
                break
            }
            posJ--
        }
    }

    checkHorizontal(a,b, board[wKingLoc[0]][wKingLoc[1]], surroundingWhiteKing)
    checkHorizontal(c,d, board[bKingLoc[0]][bKingLoc[1]], surroundingBlackKing)
    // checkVertical(a,b, surroundingWhiteKing)
    // checkVertical(c,d, surroundingBlackKing)


    console.log(surroundingWhiteKing, surroundingBlackKing)
    // if rejected, state.board becomes oldBoard (movePiece function)
    // check the newly created board in movePiece
    // if so, make that player's team checked (state.whiteCheck = true || state.blackCheck = true)


    // after moving a piece, determine if opposing team is now in check

}

function movePiece(i, j) {
    // new check logic below
    let oldBoard = board
    // IT DOESNT MATTER IF YOU START IN CHECK, ONLY MATTERS IF YOU CAN GET OUT!
    // new check logic above
    console.log("Top of movePiece: ", state.movingPiece, state.selectedSquare, i, j)
    board[i][j] = state.movingPiece
    let oldI = state.movingPiece.pos.split('')[1]
    let oldJ = state.movingPiece.pos.split('')[3]
    state.movingPiece.pos = `r${i}c${j}`
    state.movingPiece.prev.push(`r${oldI}c${oldJ}`)
    board[oldI][oldJ] = null
    state.movingPiece = null
    state.selectedSquare = null
    // new check logic below
    checkForCheck(board)
    // if (state.players[state.turn] == 'white' && state.whiteCheck) {
    //     state.board = oldBoard
    // } else if(state.players[state.turn] == 'black' && state.blackCheck){
    //     state.board = oldBoard
    // } else {
    // state.movingPiece.pos = `r${i}c${j}`
    // state.movingPiece.prev.push(`r${oldI}c${oldJ}`)
    // board[oldI][oldJ] = null
    // state.movingPiece = null
    // state.selectedSquare = null
    state.turn *= -1
    // }
    // new check logic above
    console.log("Bottom of movePiece: ", state.movingPiece, state.selectedSquare)
}

function handleClick(e) {
    // grab indices of selected piece
    let i = Number(e.target.id.split('')[1])
    let j = Number(e.target.id.split('')[3])
    // check to see if the space selected has a piece
    let attemptedSelect = board[i][j]
    state.selectedSquare = [i, j]
    // if so, check to see if it is the proper player's turn
    if (attemptedSelect) {
        if (attemptedSelect.canMove()) {
            console.log("Your Turn :)")
            attemptedSelect.selected()
            state.movingPiece = attemptedSelect

            console.log("THIS IS THE SELECTED PIECE", state.movingPiece)
        } else {
            console.log("STATE MOVING PIECE :", state.movingPiece)
            if (state.movingPiece && state.movingPiece.checkMove()) {
                // if()
                console.log("HITTING IF STATEMENT FOR ATTACK")
                movePiece(i, j)
            } else {

                console.log("Not your turn :(", attemptedSelect, state.movingPiece)
            }
        }
    } else {

        console.log(attemptedSelect)
        if (state.movingPiece && !attemptedSelect) {
            // state.selectedSquare = [i, j]
            if (state.movingPiece.checkMove()) {
                movePiece(i, j)
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

