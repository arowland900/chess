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
    blackCheck: false,
    allPossibleMoves: []
}
/*----- cached elements -----*/
let gameBoard = document.getElementById('board')
let msg = document.getElementById('msg')
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
    allMoves() {
        this.moves = []
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])

        if (this.team == 'white') {
            if (board[i + 1][j] == null) {
                console.log("one space down pawn")
                this.moves.push({ spot: [i + 1, j], piece: board[i + 1][j] })
            }
            if (board[i + 1][j - 1] != null) {
                console.log("one space down & left pawn")
                this.moves.push({ spot: [i + 1, j - 1], piece: board[i + 1][j - 1] })
            }
            if (board[i + 1][j + 1] != null) {
                console.log("one space down & right pawn")
                this.moves.push({ spot: [i + 1, j + 1], piece: board[i + 1][j + 1] })
            }
            if (i == 1 && board[i + 2][j] == null) {
                console.log("two space down pawn")
                this.moves.push({ spot: [i + 2, j], piece: board[i + 2][j] })
            }
        } else {
            if (board[i - 1][j] == null) {
                console.log("one space up pawn")
                this.moves.push({ spot: [i - 1, j], piece: board[i - 1][j] })
            }
            if (board[i - 1][j - 1] != null) {
                console.log("one space up & left pawn")
                this.moves.push({ spot: [i - 1, j - 1], piece: board[i - 1][j - 1] })
            }
            if (board[i - 1][j + 1] != null) {
                console.log("one space up & right pawn")
                this.moves.push({ spot: [i - 1, j + 1], piece: board[i - 1][j + 1] })
            }
            if (i == 1 && board[i - 2][j] == null) {
                console.log("two space up pawn")
                this.moves.push({ spot: [i - 2, j], piece: board[i - 2][j] })
            }
        }

        console.log("ALL PAWN MOVES: ", this.moves)
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
    allMoves() {
        this.moves = []
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])

        let leftUp = [i - 1, j - 2]
        let upLeft = [i - 2, j - 1]
        let upRight = [i - 2, j + 1]
        let rightUp = [i - 1, j + 2]

        let leftDown = [i + 1, j - 2]
        let downLeft = [i + 2, j - 1]
        let downRight = [i + 2, j + 1]
        let rightDown = [i + 1, j + 2]

        // CHECK LEFT UP
        if (leftUp[0] >= 0 && leftUp[1] >= 0) {
            this.moves.push({ spot: [leftUp[0], leftUp[1]], piece: board[leftUp[0]][leftUp[1]] })
        }
        // CHECK UP LEFT
        if (upLeft[0] >= 0 && upLeft[1] >= 0) {
            this.moves.push({ spot: [upLeft[0], upLeft[1]], piece: board[upLeft[0]][upLeft[1]] })
        }
        // CHECK UP RIGHT
        if (upRight[0] >= 0 && upRight[1] <= 7) {
            this.moves.push({ spot: [upRight[0], upRight[1]], piece: board[upRight[0]][upRight[1]] })
        }
        // CHECK RIGHT UP
        if (rightUp[0] >= 0 && rightUp[1] <= 7) {
            this.moves.push({ spot: [rightUp[0], rightUp[1]], piece: board[rightUp[0]][rightUp[1]] })
        }

        // CHECK LEFT DOWN
        if (leftDown[0] <= 7 && leftDown[1] >= 0) {
            this.moves.push({ spot: [leftDown[0], leftDown[1]], piece: board[leftDown[0]][leftDown[1]] })
        }
        // CHECK DOWN LEFT
        if (downLeft[0] <= 7 && downLeft[1] >= 0) {
            this.moves.push({ spot: [downLeft[0], downLeft[1]], piece: board[downLeft[0]][downLeft[1]] })
        }
        // CHECK DOWN RIGHT
        if (downRight[0] <= 7 && downRight[1] <= 7) {
            this.moves.push({ spot: [downRight[0], downRight[1]], piece: board[downRight[0]][downRight[1]] })
        }
        if (rightDown[0] <= 7 && rightDown[1] <= 7) {
            this.moves.push({ spot: [rightDown[0], rightDown[1]], piece: board[rightDown[0]][rightDown[1]] })
        }
        console.log("HORSE MOVES: ", this.moves)



        // if
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
    allMoves() {
        this.moves = []
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        // DIAGONAL
        let upLeftI = i - 1
        let upLeftJ = j - 1
        let upRightI = i - 1
        let upRightJ = j + 1
        let downLeftI = i + 1
        let downLeftJ = j - 1
        let downRightI = i + 1
        let downRightJ = j + 1

        // UP LEFT LOGIC
        while (upLeftI >= 0 && upLeftJ >= 0) {
            let el = board[upLeftI][upLeftJ]
            this.moves.push({ spot: [upLeftI, upLeftJ], piece: el })
            if (el != null) {
                break
            }
            upLeftI--
            upLeftJ--
        }
        // UP RIGHT LOGIC
        while (upRightI >= 0 && upRightJ <= 7) {
            let el = board[upRightI][upRightJ]
            this.moves.push({ spot: [upRightI, upRightJ], piece: el })
            if (el != null) {
                break
            }
            upRightI--
            upRightJ++
        }
        // DOWN LEFT LOGIC
        while (downLeftI <= 7 && downLeftJ >= 0) {
            let el = board[downLeftI][downLeftJ]
            this.moves.push({ spot: [downLeftI, downLeftJ], piece: el })
            if (el != null) {
                break
            }
            downLeftI++
            downLeftJ--
        }
        // DOWN RIGHT LOGIC
        while (downRightI <= 7 && downRightJ <= 7) {
            let el = board[downRightI][downRightJ]
            this.moves.push({ spot: [downRightI, downRightJ], piece: el })
            if (el != null) {
                break
            }
            downRightI++
            downRightJ++
        }
        console.log("BISHOP MOVES: ", this.moves)
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
    allMoves() {
        this.moves = []
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        let leftPosJ = j - 1
        let topPosI = i - 1
        let rightPosJ = j + 1
        let bottomPosI = i + 1
        // HORIZONTAL
        console.log("TOP: ", this.moves)
        while (leftPosJ >= 0) {
            let el = board[i][leftPosJ]
            this.moves.push({ spot: [i, leftPosJ], piece: el })
            if (el != null) {
                break
            }
            leftPosJ--
        }
        console.log("AFTERLEFT: ", this.moves)
        while (rightPosJ <= 7) {
            let el = board[i][rightPosJ]
            this.moves.push({ spot: [i, rightPosJ], piece: el })
            if (el != null) {
                break
            }
            rightPosJ++
        }
        console.log("AFTERRIGHT: ", this.moves)
        // VERTICAL
        while (topPosI >= 0) {
            let el = board[topPosI][j]
            this.moves.push({ spot: [topPosI, j], piece: el })
            if (el != null) {
                break
            }
            topPosI--
        }
        console.log("AFTER UP: ", this.moves)
        while (bottomPosI <= 7) {
            let el = board[bottomPosI][j]
            this.moves.push({ spot: [bottomPosI, j], piece: el })
            if (el != null) {
                break
            }
            bottomPosI++
        }
        console.log("AFTER DOWN: ", this.moves)

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
    allMoves() {
        this.moves = []
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        let leftPosJ = j - 1
        let topPosI = i - 1
        let rightPosJ = j + 1
        let bottomPosI = i + 1
        // HORIZONTAL
        console.log("TOP: ", this.moves)
        while (leftPosJ >= 0) {
            let el = board[i][leftPosJ]
            this.moves.push({ spot: [i, leftPosJ], piece: el })
            if (el != null) {
                break
            }
            leftPosJ--
        }
        console.log("AFTERLEFT: ", this.moves)
        while (rightPosJ <= 7) {
            let el = board[i][rightPosJ]
            this.moves.push({ spot: [i, rightPosJ], piece: el })
            if (el != null) {
                break
            }
            rightPosJ++
        }
        console.log("AFTERRIGHT: ", this.moves)
        // VERTICAL
        while (topPosI >= 0) {
            let el = board[topPosI][j]
            this.moves.push({ spot: [topPosI, j], piece: el })
            if (el != null) {
                break
            }
            topPosI--
        }
        console.log("AFTER UP: ", this.moves)
        while (bottomPosI <= 7) {
            let el = board[bottomPosI][j]
            this.moves.push({ spot: [bottomPosI, j], piece: el })
            if (el != null) {
                break
            }
            bottomPosI++
        }
        console.log("AFTER DOWN: ", this.moves)


        // DIAGONAL
        let upLeftI = i - 1
        let upLeftJ = j - 1
        let upRightI = i - 1
        let upRightJ = j + 1
        let downLeftI = i + 1
        let downLeftJ = j - 1
        let downRightI = i + 1
        let downRightJ = j + 1

        // UP LEFT LOGIC
        while (upLeftI >= 0 && upLeftJ >= 0) {
            let el = board[upLeftI][upLeftJ]
            this.moves.push({ spot: [upLeftI, upLeftJ], piece: el })
            if (el != null) {
                break
            }
            upLeftI--
            upLeftJ--
        }
        // UP RIGHT LOGIC
        while (upRightI >= 0 && upRightJ <= 7) {
            let el = board[upRightI][upRightJ]
            this.moves.push({ spot: [upRightI, upRightJ], piece: el })
            if (el != null) {
                break
            }
            upRightI--
            upRightJ++
        }
        // DOWN LEFT LOGIC
        while (downLeftI <= 7 && downLeftJ >= 0) {
            let el = board[downLeftI][downLeftJ]
            this.moves.push({ spot: [downLeftI, downLeftJ], piece: el })
            if (el != null) {
                break
            }
            downLeftI++
            downLeftJ--
        }
        // DOWN RIGHT LOGIC
        while (downRightI <= 7 && downRightJ <= 7) {
            let el = board[downRightI][downRightJ]
            this.moves.push({ spot: [downRightI, downRightJ], piece: el })
            if (el != null) {
                break
            }
            downRightI++
            downRightJ++
        }
        console.log("BISHOP MOVES: ", this.moves)

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
    allMoves() {
        this.moves = []
        console.log("NO KING LOGIC YET")
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

// function checkForCheck(brd) {
//     // b is what   the potential new board is, if accepted, state.board becomes b

//     // location on board of each king
//     let wKingLoc;
//     let bKingLoc;


//     // objects containing the pieces surounding the king
//     let surroundingBlackKing = {
//         top: null,
//         bottom: null,
//         right: null,
//         left: null,
//         topLeft: null,
//         topRight: null,
//         bottomRight: null,
//         bottomLeft: null,
//         enemyKnights: undefined
//     }
//     let surroundingWhiteKing = {
//         top: null,
//         bottom: null,
//         right: null,
//         left: null,
//         topLeft: null,
//         topRight: null,
//         bottomRight: null,
//         bottomLeft: null,
//         enemyKnights: undefined,
//     }
//     let a, b;
//     // LOCATE KINGS
//     brd.forEach((e, i) => {
//         e.forEach((sq, j) => {
//             if (sq instanceof King && sq.team == 'white') { wKingLoc = [i, j]; a = i; b = j }
//             if (sq instanceof King && sq.team == 'black') { bKingLoc = [i, j]; c = i; d = j }
//         })
//     })

//     console.log("WHITE KING LOC: ", wKingLoc)
//     console.log("BLACK KING LOC: ", bKingLoc)
//     console.log("X & Y: ", a, b)

//     function checkHorizontal(posI, posJ, piece, surround){
//         let leftPosJ = posJ
//         let rightPosJ = posJ
//         while(leftPosJ >= 0 && !piece.left){
//             let el = brd[posI][leftPosJ]
//             console.log(el, piece)
//             if(el != piece){
//                 console.log("HITTING LEFT IF")
//                 surround.left = el
//                 break
//             }
//             leftPosJ--
//         }
//         while(rightPosJ <= 7 && !piece.right){
//             let el = brd[posI][rightPosJ]
//             console.log(el, piece)
//             if(el != piece){
//                 console.log("HITTING RIGHT IF")
//                 surround.right = el
//                 break
//             }
//             rightPosJ++
//         }
//     }

//     checkHorizontal(a,b, board[wKingLoc[0]][wKingLoc[1]], surroundingWhiteKing)
//     checkHorizontal(c,d, board[bKingLoc[0]][bKingLoc[1]], surroundingBlackKing)
//     // checkVertical(a,b, surroundingWhiteKing)
//     // checkVertical(c,d, surroundingBlackKing)


//     console.log(surroundingWhiteKing, surroundingBlackKing)
//     // if rejected, state.board becomes oldBoard (movePiece function)
//     // check the newly created board in movePiece
//     // if so, make that player's team checked (state.whiteCheck = true || state.blackCheck = true)


//     // after moving a piece, determine if opposing team is now in check

// }

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
            // CHECK ROOK MOVES
            if (state.movingPiece) {
                // state.allPossibleMoves = []
                // console.log("HITTING ROOK ALL MOVES")
                // board.forEach((r, i) => {
                //     r.forEach((sq, j) => {
                //         if (sq) {
                //             console.log("SQ: ", sq)
                //             sq.allMoves()
                //             // sq.moves.forEach(m => {
                //             state.allPossibleMoves.push({ piece: sq, moves: sq.moves })
                //             // })
                //         }
                //     })
                // })
                // // console.log(state.movingPiece)
                // // state.movingPiece.allMoves()
                // console.log(state.allPossibleMoves)
            }
            // CHECK ROOK MOVES
            console.log("THIS IS THE SELECTED PIECE", state.movingPiece)
        } else {
            console.log("STATE MOVING PIECE :", state.movingPiece)
            if (state.movingPiece && state.movingPiece.checkMove()) {
                // if()

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
    state.allPossibleMoves = []
    console.log("HITTING ROOK ALL MOVES")
    board.forEach((r, i) => {
        r.forEach((sq, j) => {
            if (sq) {
                // console.log("SQ: ", sq)
                sq.allMoves()
                // sq.moves.forEach(m => {
                state.allPossibleMoves.push({ team: sq.team, piece: sq, moves: sq.moves })
                // })
            }
        })
    })
    let blackMoves = state.allPossibleMoves.filter(e => e.team == 'black')
    let whiteMoves = state.allPossibleMoves.filter(e => e.team == 'white')
    state.blackCheck = false
    state.whiteCheck = false
    whiteMoves.forEach(e => {
        // console.log(e.moves)
        e.moves.forEach(m => {
            console.log(m)
            if(m.piece instanceof King && m.piece.team == 'black'){
                state.blackCheck = true
            }
            
        })
    })
    blackMoves.forEach(e => {
        // console.log(e.moves)
        e.moves.forEach(m => {
            console.log(m)
            if(m.piece instanceof King && m.piece.team == 'white'){
                state.whiteCheck = true
            }
            
        })
    })
    if(state.blackCheck) msg.textContent = "Black is Checked"
    else if(state.whiteCheck) msg.textContent = "White is Checked"
    else msg.textContent = "Chess"
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

