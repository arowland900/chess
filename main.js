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
    whiteCheck: [],
    blackCheck: [],
    allPossibleMoves: [],
    tempBoard: null,
    whiteMoves: [],
    blackMoves: [],
    checkBlock: [],
    checkMate: null,
    whiteKingLoc: undefined,
    blackKingLoc: undefined
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
                // console.log("one space down pawn")
                this.moves.push({ spot: [i + 1, j], piece: board[i + 1][j] })
            }
            if (board[i + 1][j - 1] != null) {
                // console.log("one space down & left pawn")
                this.moves.push({ spot: [i + 1, j - 1], piece: board[i + 1][j - 1] })
            }
            if (board[i + 1][j + 1] != null) {
                // console.log("one space down & right pawn")
                this.moves.push({ spot: [i + 1, j + 1], piece: board[i + 1][j + 1] })
            }
            if (i == 1) {
                if (board[i + 2][j] == null) {
                    // console.log("two space down pawn")
                    this.moves.push({ spot: [i + 2, j], piece: board[i + 2][j] })
                }
            }
        } else {
            if (board[i - 1][j] == null) {
                // console.log("one space up pawn")
                this.moves.push({ spot: [i - 1, j], piece: board[i - 1][j] })
            }
            if (board[i - 1][j - 1] != null) {
                // console.log("one space up & left pawn")
                this.moves.push({ spot: [i - 1, j - 1], piece: board[i - 1][j - 1] })
            }
            if (board[i - 1][j + 1] != null) {
                // console.log("one space up & right pawn")
                this.moves.push({ spot: [i - 1, j + 1], piece: board[i - 1][j + 1] })
            }
            if (i == 6) {
                if (board[i - 2][j] == null) {
                    // console.log("two space up pawn")
                    this.moves.push({ spot: [i - 2, j], piece: board[i - 2][j] })
                }
            }
        }
        this.moves.forEach(m => {
            m.spot = JSON.stringify(m.spot)
        })
        // console.log("ALL PAWN MOVES: ", this.moves)
    }
    checkMove() {
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        let newI = Number(state.selectedSquare[0])
        let newJ = Number(state.selectedSquare[1])
        let newPosition = board[newI][newJ]
        // console.log("This the new position: ", newPosition)
        // console.log(i, j, state.selectedSquare)
        if (this.team == 'white') {
            if (i + 1 == newI && j == newJ && newPosition == null) return true
            if (i + 2 == newI && j == newJ && i == 1 && newPosition == null) {
                let skippedPosition = board[i + 1][j]
                if (skippedPosition == null) {
                    return true
                }
            }
            if (i + 1 == newI && (j - 1 == newJ || j + 1 == newJ)) {
                // console.log("White attacking black")
                if (newPosition) {

                    if (newPosition.team == 'black') {
                        // console.log("HIT ATTACK BLACK")
                        return true
                        movePiece(newI, newJ)
                    }
                }
            }
        } else {
            if (i - 1 == newI && j == newJ && newPosition == null) return true
            console.log()
            if (i - 2 == newI && j == newJ && i == 6 && newPosition == null) {
                let skippedPosition = board[i - 1][j]
                if (skippedPosition == null) {
                    return true
                }
            }
            if (i - 1 == newI && (j - 1 == newJ || j + 1 == newJ)) {
                // console.log("Black attacking white")
                if (newPosition) {
                    if (newPosition.team == 'white') {
                        // console.log("HIT ATTACK WHITE")
                        return true
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
        // console.log("HORSE MOVES: ", this.moves)



        // if
        this.moves.forEach(m => {
            m.spot = JSON.stringify(m.spot)
        })
    }
    checkMove() {
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        let newI = Number(state.selectedSquare[0])
        let newJ = Number(state.selectedSquare[1])
        let newPosition = board[newI][newJ]
        // console.log("This the new position: ", newPosition)
        // console.log(i, j, state.selectedSquare)

        if (i + 1 == newI) {
            if (j - 2 == newJ || j + 2 == newJ) {
                if (newPosition == null) return true
                else if (newPosition.team != this.team) {
                    // console.log("HIT OPPONENT : ", state.movingPiece)

                    return true
                }
            }
            else return false
        } else if (i + 2 == newI) {
            if (j - 1 == newJ || j + 1 == newJ) {
                if (newPosition == null) return true
                else if (newPosition.team != this.team) {
                    // console.log("HIT OPPONENT : ", state.movingPiece)

                    return true
                }
            }
            else return false
        } else if (i - 1 == newI) {
            if (j - 2 == newJ || j + 2 == newJ) {
                if (newPosition == null) return true
                else if (newPosition.team != this.team) {
                    // console.log("HIT OPPONENT : ", state.movingPiece)

                    return true
                }
            }
            else return false
        } else if (i - 2 == newI) {
            if (j - 1 == newJ || j + 1 == newJ) {
                if (newPosition == null) return true
                else if (newPosition.team != this.team) {
                    // console.log("HIT OPPONENT : ", state.movingPiece)

                    return true
                }
            }
            else return false
        } else {
            return false
        }


        if (newPosition == null) return true
        else if (newPosition.team != this.team) {
            // console.log("HIT OPPONENT : ", state.movingPiece)

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
        this.moves.forEach(m => {
            m.spot = JSON.stringify(m.spot)
        })
        // console.log("BISHOP MOVES: ", this.moves)
    }
    checkMove() {
        // console.log("HITTING")
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
            // console.log("HIT OPPONENT : ", state.movingPiece)

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
        // console.log("TOP: ", this.moves)
        while (leftPosJ >= 0) {
            let el = board[i][leftPosJ]
            this.moves.push({ spot: [i, leftPosJ], piece: el })
            if (el != null) {
                break
            }
            leftPosJ--
        }
        // console.log("AFTERLEFT: ", this.moves)
        while (rightPosJ <= 7) {
            let el = board[i][rightPosJ]
            this.moves.push({ spot: [i, rightPosJ], piece: el })
            if (el != null) {
                break
            }
            rightPosJ++
        }
        // console.log("AFTERRIGHT: ", this.moves)
        // VERTICAL
        while (topPosI >= 0) {
            let el = board[topPosI][j]
            this.moves.push({ spot: [topPosI, j], piece: el })
            if (el != null) {
                break
            }
            topPosI--
        }
        // console.log("AFTER UP: ", this.moves)
        while (bottomPosI <= 7) {
            let el = board[bottomPosI][j]
            this.moves.push({ spot: [bottomPosI, j], piece: el })
            if (el != null) {
                break
            }
            bottomPosI++
        }
        this.moves.forEach(m => {
            m.spot = JSON.stringify(m.spot)
        })
        // console.log("AFTER DOWN: ", this.moves)

    }
    checkMove() {
        // console.log("HITTING")
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
                    // console.log("HITTING", board[i][start])
                    if (board[i][start] !== null) {
                        return false
                    }
                }
            } else {
                for (let start = j - 1; start > desiredJ; start--) {
                    // console.log("HITTING", board[i][start])
                    if (board[i][start] !== null) {
                        return false
                    }
                }
            }
            // rooks moving up & down
        } else if (j == desiredJ && i !== desiredI) {
            if (i > desiredI) {
                for (let start = i - 1; start > desiredI; start--) {
                    // console.log("HITTING", board[start][j])
                    if (board[start][j] !== null) {
                        return false
                    }
                }
            } else {
                for (let start = i + 1; start < desiredI; start++) {
                    // console.log("HITTING", board[start][j])
                    if (board[start][j] !== null) {
                        return false
                    }
                }
            }
        }
        if (selectedValue == null) return true
        else if (selectedValue.team != this.team) {
            // console.log("HIT OPPONENT : ", state.movingPiece)

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
        // console.log("TOP: ", this.moves)
        while (leftPosJ >= 0) {
            let el = board[i][leftPosJ]
            this.moves.push({ spot: [i, leftPosJ], piece: el })
            if (el != null) {
                break
            }
            leftPosJ--
        }
        // console.log("AFTERLEFT: ", this.moves)
        while (rightPosJ <= 7) {
            let el = board[i][rightPosJ]
            this.moves.push({ spot: [i, rightPosJ], piece: el })
            if (el != null) {
                break
            }
            rightPosJ++
        }
        // console.log("AFTERRIGHT: ", this.moves)
        // VERTICAL
        while (topPosI >= 0) {
            let el = board[topPosI][j]
            this.moves.push({ spot: [topPosI, j], piece: el })
            if (el != null) {
                break
            }
            topPosI--
        }
        // console.log("AFTER UP: ", this.moves)
        while (bottomPosI <= 7) {
            let el = board[bottomPosI][j]
            this.moves.push({ spot: [bottomPosI, j], piece: el })
            if (el != null) {
                break
            }
            bottomPosI++
        }
        // console.log("AFTER DOWN: ", this.moves)


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
        // console.log("BISHOP MOVES: ", this.moves)

        this.moves.forEach(m => {
            m.spot = JSON.stringify(m.spot)
        })
    }
    checkMove() {
        // console.log("HITTING QUEEN")
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        let desiredI = state.selectedSquare[0]
        let desiredJ = state.selectedSquare[1]
        let selectedValue = board[desiredI][desiredJ]
        if (i !== desiredI && j !== desiredJ) {
            if (Math.abs(j - desiredJ) !== Math.abs(i - desiredI)) {
                return false
            }
            // console.log("DIAGONAL QUEEN")
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
                    // console.log("HITTING DIAGONAL BACK  ")
                    if (board[startI][startJ]) return false
                }
            }
        } else {
            // console.log("HELLOOOOOOOO")
            if (i == desiredI && j !== desiredJ) {
                if (j < desiredJ) {

                    for (let start = j + 1; start < desiredJ; start++) {
                        // console.log("HITTING", board[i][start])
                        if (board[i][start] !== null) {
                            return false
                        }
                    }
                } else {
                    for (let start = j - 1; start > desiredJ; start--) {
                        // console.log("HITTING", board[i][start])
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
                        // console.log("HITTING", board[start][j])
                        if (board[start][j] !== null) {
                            return false
                        }
                    }
                } else {
                    for (let start = i + 1; start < desiredI; start++) {
                        // console.log("HITTING", board[start][j])
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
            // console.log("HIT OPPONENT : ", state.movingPiece)

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
        // console.log("NO KING LOGIC YET")
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        // console.log("KING TOP ALLMOVES: ", this.moves)

        if (i - 1 >= 0) {
            if (j - 1 >= 0) {
                this.moves.push({ spot: [i - 1, j - 1], piece: board[i - 1][j - 1] })
            }
            this.moves.push({ spot: [i - 1, j], piece: board[i - 1][j] })
            if (j + 1 <= 7) {
                this.moves.push({ spot: [i - 1, j + 1], piece: board[i - 1][j + 1] })
            }
        }
        if (j - 1 >= 0) {
            this.moves.push({ spot: [i, j - 1], piece: board[i][j - 1] })
        }
        if (j + 1 <= 7) {
            this.moves.push({ spot: [i, j + 1], piece: board[i][j + 1] })
        }
        if (i + 1 <= 7) {
            if (j - 1 >= 0) {
                this.moves.push({ spot: [i + 1, j - 1], piece: board[i + 1][j - 1] })
            }
            this.moves.push({ spot: [i + 1, j], piece: board[i + 1][j] })
            if (j + 1 <= 7) {
                this.moves.push({ spot: [i + 1, j + 1], piece: board[i + 1][j + 1] })
            }
        }
        // console.log("KING MOVES: ", this.moves)
        this.moves.forEach((m, i) => {
            m.spot = JSON.stringify(m.spot)
            // console.log(`KING MOVE ${i}: `, m)
        })
        // console.log("KING BOTTOM ALLMOVES: ", this.moves)

    }
    checkMove() {
        // console.log("HITTING KING")
        let i = Number(this.pos.split('')[1])
        let j = Number(this.pos.split('')[3])
        let desiredI = state.selectedSquare[0]
        let desiredJ = state.selectedSquare[1]
        let selectedValue = board[desiredI][desiredJ]
        if (Math.abs(i - desiredI) > 1 || Math.abs(j - desiredJ) > 1) return false
        if (selectedValue == null) return true
        else if (selectedValue.team != this.team) {
            // console.log("HIT OPPONENT : ", state.movingPiece)

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

// function doesCheckStillExist(potentialMovingPiece) {
//     let possibleMoves = potentialMovingPiece.moves
//     let foundEscape = false
//     // let oldBoard = JSON.stringify(board)

//     // let oldBoard = [...board]
//     // let oldBoard = []


//     // console.log(oldBoard)
//     console.log("potential moving piece: ", potentialMovingPiece)
//     console.log("current board layout for potential moving piece: ", board)
//     console.log("possible moves for potential moving piece: ", possibleMoves)
//     // debugger

//     // console.log('potentialMovingPiece: ', potentialMovingPiece)
//     let oldI = potentialMovingPiece.pos.split('')[1]
//     let oldJ = potentialMovingPiece.pos.split('')[3]
//     let piece = board[oldI][oldJ]
//     // let piece = potentialMovingPiece
//     let isMoveValid = false
//     let newI
//     let newJ
//     // console.log("Piece: ", piece)
//     for(let x = 0; x < potentialMovingPiece.moves.length || foundEscape == false; x++){
//         let m = potentialMovingPiece.moves[x]
//     // potentialMovingPiece.moves.forEach((m, x) => {
//         let s = JSON.parse(m.spot)
//         console.log("m.spot please have a value parsed correctly! :", s)
//         newI = s[0]
//         newJ = s[1]
//         // console.log(board[newI][newJ].team)
//         if(board[newI][newJ] == null || board[newI][newJ].team != players[state.turn]){
//             console.log("NEW I & J: ",newI, newJ)
//             board[newI][newJ] = piece
//             board[oldI][oldJ] = null
//             console.log("New Potential Board: ", board)
//             console.log("Piece Being Observer: ", piece)
//             // debugger
//             // right here we need to check if this new potential board still has a check
//             let isCheck = findEveryMoveInCheckMate(board)
//             console.log(isCheck)
//             if(isCheck){
//                 console.log('Old piece location on board (should be null): ',board[oldI][oldJ])
//                 console.log('New piece location on board (should be == piece (line 836)): ',board[newI][newJ])
//                 board[oldI][oldJ] = piece

//                 board[newI][newJ] = null
//                 console.log('Old piece location on board after swap back(should be  == piece (line 836)): ',board[oldI][oldJ])
//                 console.log('New piece location on board (should be null): ',board[newI][newJ])

//                 // board = JSON.parse(oldBoard)
//                 console.log("PUT BOARD BACK TO NORMAL")
//                 console.log("Board back to normal: ", board)
//                 // after the knight makes all of it's moves, the board needs to return to normal 
//                 // AND the pieces need to get their moves back to old board
//                 findEveryMoveInCheckMate(board)
//             } else {
//                 console.log("NO CHECK HERE! MOVE IS POSSIBLE")
//                 console.log("NO CHECK HERE! MOVE IS POSSIBLE")
//                 console.log("NO CHECK HERE! MOVE IS POSSIBLE")
//                 console.log("NO CHECK HERE! MOVE IS POSSIBLE")
//                 console.log("THIS IS THE BOARD WHERE NO CHECK EXISTS: ", board)
//                 foundEscape = true
//                 return true
//             }
//         } else {
//             console.log("Moving Forward...")
//             console.log("Board... ", board)
//         }
//         console.log("JUST RAN FOR EACH, X: ", x)

//     // })
//     }


//     return false
// }

function movePiece(i, j) {
    // state.checkBlock = []
    // new check logic below
    let oldBoard = [...board]
    let oldPiece = board[i][j]
    // IT DOESNT MATTER IF YOU START IN CHECK, ONLY MATTERS IF YOU CAN GET OUT!
    // new check logic above
    console.log("Top of movePiece: ", state.movingPiece, state.selectedSquare, i, j)
    board[i][j] = state.movingPiece
    let oldI = state.movingPiece.pos.split('')[1]
    let oldJ = state.movingPiece.pos.split('')[3]
    // state.movingPiece.pos = `r${i}c${j}`
    // state.movingPiece.prev.push(`r${oldI}c${oldJ}`)
    board[oldI][oldJ] = null
    // state.movingPiece = null
    // state.selectedSquare = null
    // state.tempBoard = board
    // }
    // new check logic above
    console.log('about to hit findEveryMove in MovePiece Func')
    // if (findEveryMove(board)) {
    findEveryMove(board)
    if(state.whiteCheck.length || state.blackCheck.length){
        // findChecks()
        console.log("HITTING FIND EVERY MOVE BOARD")
        console.log("state.allPossibleMoves: ", state.allPossibleMoves)
        console.log(state.whiteCheck, state.blackCheck)
        if (players[state.turn] == 'white') {
            console.log('check still here, white turn')
            if (state.whiteCheck.length) {
                console.log("THIS IS STATE.WHITECHECK: ", state.whiteCheck)
                console.log("THIS IS STATE.WHITECHECK: ", state.allPossibleMoves)
                console.log("INVALID MOVE")
                console.log("All Possible Moves: ", state.allPossibleMoves)
                msg.textContent = "Invalid Move"
                board[oldI][oldJ] = state.movingPiece
                board[i][j] = oldPiece
                // debugger
                return
            }
        }
        if (players[state.turn] == 'black') {
            console.log('check still here, black turn')
            // IF BLACK IS CHECKED, CAN THIS MOVE GET YOU OUT OF CHECK?
            if (state.blackCheck.length) {
                console.log("INVALID MOVE")
                console.log("All Possible Moves: ", state.allPossibleMoves)
                msg.textContent = "Invalid Move"

                board[oldI][oldJ] = state.movingPiece
                board[i][j] = oldPiece
                // debugger
                // board = oldBoard
                return
            }

        }

    }
    state.movingPiece.pos = `r${i}c${j}`
    state.movingPiece.prev.push(`r${oldI}c${oldJ}`)
    board[oldI][oldJ] = null
    state.movingPiece = null
    state.selectedSquare = null
    state.turn *= -1
    msg.textContent = "Chess"
    console.log("Bottom of movePiece: ", state.movingPiece, state.selectedSquare)
    console.log("VERY bottom of movePiece: (state.allPossibleMoves): ", state.allPossibleMoves)
}

function findEveryMove(b) {
    state.allPossibleMoves = []
    state.checkBlock = []
    // let whiteKingLoc;
    // let blackKingLoc;
    b.forEach((r, i) => {
        r.forEach((sq, j) => {
            if (sq) {
                // console.log("SQ, top of findEveryMove inside forEach: ", sq)
                sq.allMoves()
                if (sq instanceof King) {
                    sq.team == 'white' ? state.whiteKingLoc = sq : state.blackKingLoc = sq
                }
                // state.allPossibleMoves.push({ team: sq.team, piece: sq, moves: sq.moves })
                state.allPossibleMoves.push(sq)
            }
        })
    })
    state.blackMoves = state.allPossibleMoves.filter(e => e.team == 'black')
    state.whiteMoves = state.allPossibleMoves.filter(e => e.team == 'white')
    //     NOW THAT WE CAN DETERMINE CHECK:
    console.log(state.allPossibleMoves)
    // we need a function that will determine all possible moves AFTER a hypothetical move has been made
    // if that hypothetical move is made & a check is no longer present, the hypothetical move is valid.
    // if that hypothetical move is made & there is still a check for that same player, the move is invalid.
    // if ALL hypothetical moves are unable to get rid of check, we have found checkmate!
    findChecks()
}

function findChecks(){
    state.blackCheck = []
    state.whiteCheck = []
    // if (state.whiteCheck) {
    //     whiteMoves
    // }
    state.whiteMoves.forEach(e => {
        // console.log(e.moves)
        e.moves.forEach(m => {
            // console.log(m)
            if (m.piece instanceof King && m.piece.team == 'black') {
                // state.blackCheck.push({ piece: e })
                state.blackCheck.push(e)
            }

        })
    })
    state.blackMoves.forEach(e => {
        // console.log(e.moves)
        e.moves.forEach(m => {
            // console.log(m)
            if (m.piece instanceof King && m.piece.team == 'white') {
                // state.whiteCheck.push({ piece: e })
                state.whiteCheck.push(e)
            }

        })
    })


    console.log("STATE AL POSSIBLE MOVES: ", state.allPossibleMoves)
    console.log("WHITE CHECK", state.whiteCheck)
    console.log("BLACK CHECK", state.blackCheck)
    console.log("WHITE KING LOC", state.whiteKingLoc)
    console.log("BLACK KING LOC", state.blackKingLoc)

    if(state.whiteCheck.length){
        // checkForCheckMate()
    }
}

function checkForCheckMate(){
    if (state.whiteCheck.length) {
        state.checkMate = undefined
        let whiteKingI = Number(state.whiteKingLoc.pos.split('')[1])
        let whiteKingJ = Number(state.whiteKingLoc.pos.split('')[3])
        let rowOne = []
        state.checkBlock.push(rowOne)
        for (let i = 0; i < state.whiteCheck.length; i++) {
            let p = state.whiteCheck[i]
            let idx = Number(p.pos.split('')[1])
            let jdx = Number(p.pos.split('')[3])

            if (p instanceof Queen || p instanceof Rook) {
                // console.log("PIECE CHECKING KING IS QUEEN")
                if (whiteKingI == idx) {
                    while (jdx > whiteKingJ) {
                        state.checkBlock[0].push([idx, jdx])
                        jdx--
                    }
                    while (jdx < whiteKingJ) {
                        state.checkBlock[0].push([idx, jdx])
                        jdx++
                    }
                } else if (whiteKingJ == jdx) {
                    while (idx > whiteKingI) {
                        state.checkBlock[0].push([idx, jdx])
                        idx--
                    }
                    while (idx < whiteKingI) {
                        state.checkBlock[0].push([idx, jdx])
                        idx++
                    }
                }
            }
            if (p instanceof Queen || p instanceof Bishop || p instanceof Pawn) {
                if (whiteKingI != idx && whiteKingJ != jdx) {
                    if (whiteKingI < idx) {
                        if (whiteKingJ < jdx) {
                            while (whiteKingI < idx) {
                                state.checkBlock[0].push([idx, jdx])
                                idx--
                                jdx--
                            }
                        } else {
                            while (whiteKingI < idx) {
                                state.checkBlock[0].push([idx, jdx])
                                idx--
                                jdx++
                            }
                        }
                    } else {
                        if (whiteKingJ < jdx) {
                            while (whiteKingI > idx) {
                                state.checkBlock[0].push([idx, jdx])
                                idx++
                                jdx--
                            }
                        } else {
                            while (whiteKingI > idx) {
                                state.checkBlock[0].push([idx, jdx])
                                idx++
                                jdx++
                            }
                        }
                    }
                }
            } if (p instanceof Knight) {

            // if knight can be captured (or king can move away), no mate, if not, mate
                // if (whiteKingI - 1 == idx) {
                //     if (whiteKingJ - 2 == jdx) {

                //     }
                // }
            }
            console.log("STATE CHECKBLOCK: ", state.checkBlock, state.checkMate)

            for (let ii = 0; ii < state.whiteMoves.length; ii++) {
                let m = state.whiteMoves[ii]
                for (let jj = 0; jj < m.moves.length; jj++) {
                    let s = m.moves[jj]

                    // console.log(`${jj}: `, s)
                    for (let k = 0; k < state.checkBlock.length; k++) {
                        // console.log("STATE CHECKBLOCK K: ", state.checkBlock[k])
                        for (let l = 0; l < state.checkBlock[k].length; l++) {
                            // console.log("STATE CHECKBLOCK @ 0: ", state.checkBlock[k][l])
                            if (s.spot == JSON.stringify(state.checkBlock[k][l])) {
                                console.log("THIS IS S SPOT: ", s.spot)
                                if (m instanceof King) {
                                    let directKingAttack = board[state.checkBlock[k][l][0]][state.checkBlock[k][l][1]]
                                    console.log("THIS IS THE KING: ", m)
                                    console.log("PIECE OF BOARD THAT KING CAN ATTACK: ", directKingAttack)
                                    if (directKingAttack != null) {
                                        // state.checkMate = false
                                        let queenIsProtected = false
                                        console.log("ANY BLACK MOVES TO DEFEND PIECE? : ", state.blackMoves)
                                        for (let bM = 0; bM < state.blackMoves.length; bM++) {
                                            let curMoves = state.blackMoves[bM].moves
                                            console.log(curMoves)

                                            for (let c = 0; c < curMoves.length; c++) {
                                                // if (curMoves[c].piece instanceof Queen && curMoves[c].piece.team == 'black') {
                                                if(curMoves[c].piece == directKingAttack){
                                                    console.log("PIECE is Protected!: ", curMoves[c])
                                                    queenIsProtected = true
                                                }
                                            }
                                            // if(curMoves.includes())
                                            // if()
                                        }
                                        if (!queenIsProtected) {
                                            state.checkMate = false
                                        }
                                    }
                                } else {
                                    // need to check here to see if this move is valid

                                    console.log("CHECK CAN BE STOPPED!: ", s, m)
                                    state.checkMate = false
                                }
                            }
                        }
                    }
                }
            }


        }
    }
    if (state.checkMate == null && (state.whiteCheck.length || state.blackCheck.length)) { console.log("We have found checkmate"); msg.textContent = "CHECKMATE"; return }
    else console.log("State Checkmate: ", state.checkMate)

    if (state.blackCheck.length && msg.textContent != "Invalid Move"){  msg.textContent = "Black is Checked"; return}
    else if (state.whiteCheck.length && msg.textContent != "Invalid Move") { msg.textContent = "White is Checked"; return}
    else if (msg.textContent == "Invalid Move") { msg.textContent != "Invalid Move"; console.log(msg); return }
    else msg.textContent = "Chess";  
    if (state.blackCheck.length || state.whiteCheck.length) return { black: state.blackCheck, white: state.whiteCheck }
    else return false
}





// FIND EVERY POTENTIAL MOVE IN CHECKMATE BELOW vvvvvvvvvvv
// FIND EVERY POTENTIAL MOVE IN CHECKMATE BELOW vvvvvvvvvvv
// FIND EVERY POTENTIAL MOVE IN CHECKMATE BELOW vvvvvvvvvvv
// FIND EVERY POTENTIAL MOVE IN CHECKMATE BELOW vvvvvvvvvvv
// FIND EVERY POTENTIAL MOVE IN CHECKMATE BELOW vvvvvvvvvvv
// FIND EVERY POTENTIAL MOVE IN CHECKMATE BELOW vvvvvvvvvvv
// FIND EVERY POTENTIAL MOVE IN CHECKMATE BELOW vvvvvvvvvvv
// FIND EVERY POTENTIAL MOVE IN CHECKMATE BELOW vvvvvvvvvvv


// function findEveryMoveInCheckMate(b) {
//     console.log("findEveryMoveInCheckMate is HITTING")
//     let allPotentialMoves = []
//     let allBlackMoves = []
//     let allWhiteMoves = []
//     let blackCheck = []
//     let whiteCheck = []
//     b.forEach((r, i) => {
//         r.forEach((sq, j) => {
//             if (sq) {
//                 console.log("SQ, top of findEveryMove inside forEach: ", sq)
//                 console.log("SQ MOVES, top of findEveryMove inside forEach: ", sq.moves)
//                 sq.allMoves()
//                 if(sq instanceof Bishop){
//                     console.log("HERE's THE Bishop!: ", sq)
//                 }
//                 allPotentialMoves.push({ team: sq.team, piece: sq, moves: sq.moves })
//             }
//         })
//     })
//     allBlackMoves = allPotentialMoves.filter(e => e.team == 'black')
//     allWhiteMoves = allPotentialMoves.filter(e => e.team == 'white')

//     console.log('allWhiteMoves: ', allWhiteMoves)
//     console.log('allBlackMoves: ', allBlackMoves)
//     //     NOW THAT WE CAN DETERMINE CHECK:
//     // console.log(state.allPossibleMoves)

//     // we need a function that will determine all possible moves AFTER a hypothetical move has been made
//     // if that hypothetical move is made & a check is no longer present, the hypothetical move is valid.
//     // if that hypothetical move is made & there is still a check for that same player, the move is invalid.
//     // if ALL hypothetical moves are unable to get rid of check, we have found checkmate!
//     blackCheck = []
//     whiteCheck = []
//     // if (state.whiteCheck) {
//     //     whiteMoves
//     // }
//     allWhiteMoves.forEach(e => {
//         // console.log(e.moves)
//         e.moves.forEach(m => {
//             console.log('checking if check remains for potential white move')
//             if (m.piece instanceof King && m.piece.team == 'black') {
//                 blackCheck.push({ piece: e })
//             }

//         })
//     })
//     allBlackMoves.forEach(e => {
//         // console.log(e.moves)
//         e.moves.forEach(m => {
//             // console.log(m)
//             console.log('checking if check remains for potential black move')
//             if (m.piece instanceof King && m.piece.team == 'white') {
//                 whiteCheck.push({ piece: e })
//             }

//         })
//     })

//     // if(state.turn === 1 && whiteCheck.length) return whiteCheck
//     // if(state.turn === -1 && whiteCheck.length) return whiteCheck
//     if (blackCheck.length || whiteCheck.length) return { black: blackCheck, white: whiteCheck }
//     else return false
// }


// FIND EVERY POTENTIAL MOVE IN CHECKMATE ABOVE^^^^^^^^^^^^^
// FIND EVERY POTENTIAL MOVE IN CHECKMATE ABOVE^^^^^^^^^^^^^
// FIND EVERY POTENTIAL MOVE IN CHECKMATE ABOVE^^^^^^^^^^^^^
// FIND EVERY POTENTIAL MOVE IN CHECKMATE ABOVE^^^^^^^^^^^^^
// FIND EVERY POTENTIAL MOVE IN CHECKMATE ABOVE^^^^^^^^^^^^^
// FIND EVERY POTENTIAL MOVE IN CHECKMATE ABOVE^^^^^^^^^^^^^
// FIND EVERY POTENTIAL MOVE IN CHECKMATE ABOVE^^^^^^^^^^^^^
// FIND EVERY POTENTIAL MOVE IN CHECKMATE ABOVE^^^^^^^^^^^^^



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
            // state.movingPiece = attemptedSelect
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
    console.log('about to hit findEveryMove in HandleClick Func')
    findEveryMove(board)
    // findChecks()
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
    if(!state.whiteCheck.length && !state.whiteCheck.length){
        msg.textContent = `Chess! - Turn: ${players[state.turn]}`
    } else if(state.whiteCheck.length){
        msg.textContent = `white is in check!`
    } else {
        msg.textContent = `black is in check!`
    }
}

