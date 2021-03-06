console.log("JS LOADED")


/*----- constants -----*/
const letterLookup = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].reverse()
const players = {
    '1': 'white',
    '-1': 'black'
}
/*----- state -----*/
let board;

let state = {
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
    checkMate: false,
    whiteKingLoc: undefined,
    blackKingLoc: undefined,
    invalidMove: undefined,
    kingLook: undefined
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
    console.log("BOARD: ", board)
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


function movePiece(i, j) {
    state.invalidMove = undefined
    console.log("Top of movePiece: ", state.movingPiece, state.selectedSquare, i, j)
    let oldPiece = board[i][j]
    board[i][j] = state.movingPiece
    let oldI = state.movingPiece.pos.split('')[1]
    let oldJ = state.movingPiece.pos.split('')[3]
    board[oldI][oldJ] = null

    console.log('about to hit findEveryMove in MovePiece Func')

    findEveryMove(board)
    // We Can Use This Later.  If Checkmate, no need to look for check
    // if(state.checkMate) {
    //     renderBoard()
    //     return
    // }
    if (doesMoveNotResultInCheck(i, j, oldI, oldJ, oldPiece)) {
        if (state.kingLook) {
            state.checkMate = false
            return
        }
        state.movingPiece.pos = `r${i}c${j}`
        state.movingPiece.prev.push(`r${oldI}c${oldJ}`)
        board[oldI][oldJ] = null
        state.movingPiece = null
        state.selectedSquare = null
        state.turn *= -1
    }
    console.log("Bottom of movePiece: ", state.movingPiece, state.selectedSquare)
    console.log("VERY bottom of movePiece: (state.allPossibleMoves): ", state.allPossibleMoves)
}

function doesMoveNotResultInCheck(i, j, oldI, oldJ, oldPiece) {
    console.log("Hitting doesMoveNotResultInCheck. state movingpiece: ", state.movingPiece)
    console.log("state.allPossibleMoves: ", state.allPossibleMoves)
    console.log(state.whiteCheck, state.blackCheck)
    if (players[state.turn] == 'white' && state.whiteCheck.length) {
        if (state.whiteCheck.length) {
            console.log("THIS IS STATE.WHITECHECK: ", state.whiteCheck)
            console.log("THIS IS STATE.WHITECHECK: ", state.allPossibleMoves)
            console.log("INVALID MOVE")
            console.log("All Possible Moves: ", state.allPossibleMoves)
            state.invalidMove = { i, j, name: state.movingPiece.constructor.toString().split(' ')[1] }
            board[oldI][oldJ] = state.movingPiece
            board[i][j] = oldPiece
            // debugger
            return false
        }
    }
    if (players[state.turn] == 'black' && state.blackCheck.length) {
        console.log('check still here, black turn')
        // IF BLACK IS CHECKED, CAN THIS MOVE GET YOU OUT OF CHECK?
        if (state.blackCheck.length) {
            console.log("INVALID MOVE")
            console.log("All Possible Moves: ", state.allPossibleMoves)
            state.invalidMove = { i, j, name: state.movingPiece.constructor.toString().split(' ')[1] }

            board[oldI][oldJ] = state.movingPiece
            board[i][j] = oldPiece
            // debugger
            // board = oldBoard
            return false
        }

    }
    return true
}

function findEveryMove(b) {
    if (state.kingLook) {
        console.log("LOOKING FOR CHECKMATE RN: ", state.kingLook)
    }
    state.allPossibleMoves = []
    state.checkBlock = []

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
    console.log("ALL POSSIBLE MOVES: ", state.allPossibleMoves)
    findChecks()
}

function findChecks() {
    state.blackCheck = []
    state.whiteCheck = []

    state.whiteMoves.forEach(e => {
        // console.log(e.moves)
        e.moves.forEach(m => {
            // console.log(m)
            if (m.piece instanceof King && m.piece.team == 'black') {
                state.blackCheck.push(e)
            }
        })
    })
    state.blackMoves.forEach(e => {
        // console.log(e.moves)
        e.moves.forEach(m => {
            // console.log(m)
            if (m.piece instanceof King && m.piece.team == 'white') {
                state.whiteCheck.push(e)
            }
        })
    })

    console.log("WHITE CHECK", state.whiteCheck)
    console.log("BLACK CHECK", state.blackCheck)
    console.log("WHITE KING LOC", state.whiteKingLoc)
    console.log("BLACK KING LOC", state.blackKingLoc)

    if (state.kingLook == 'white') {
        console.log("STATE.KINGLOOK == WHITE: ", state.kingLook)
        console.log("STATE.WHITECHECK?: ", state.whiteCheck)
    }

    if (state.whiteCheck.length && state.kingLook == undefined) {
        buildCheckBlock(state.whiteKingLoc)
    } else if (state.blackCheck.length && state.kingLook == undefined) {
        buildCheckBlock(state.blackKingLoc)
    }
}

function buildCheckBlock(king) {
    console.log("HITTING buildCheckBlock, KING & turn: ", king, state.turn)
    // if (state.whiteCheck.length) {
    // state.checkMate = true
    let checkingPieces = king.team == 'white' ? state.whiteCheck : state.blackCheck
    let kingI = Number(king.pos.split('')[1])
    let kingJ = Number(king.pos.split('')[3])
    // let rowOne = []
    for (let i = 0; i < checkingPieces.length; i++) {
        state.checkBlock.push([])
        console.log("THIS IS I: ", i)
        console.log("THIS IS STATE CHECK BLOCK: ", JSON.stringify(state.checkBlock))
        console.log("THIS IS STATE CHECK BLOCK AT I: ", JSON.stringify(state.checkBlock[i]))
        let p = checkingPieces[i]
        let idx = Number(p.pos.split('')[1])
        let jdx = Number(p.pos.split('')[3])

        if (p instanceof Queen || p instanceof Rook) {
            // console.log("PIECE CHECKING KING IS QUEEN")
            if (kingI == idx) {
                while (jdx > kingJ) {
                    state.checkBlock[i].push([idx, jdx])
                    jdx--
                }   
                while (jdx < kingJ) {
                    state.checkBlock[i].push([idx, jdx])
                    jdx++
                }
            } else if (kingJ == jdx) {
                while (idx > kingI) {
                    state.checkBlock[i].push([idx, jdx])
                    idx--
                }
                while (idx < kingI) {
                    state.checkBlock[i].push([idx, jdx])
                    idx++
                }
            }
        }
        if (p instanceof Queen || p instanceof Bishop || p instanceof Pawn) {
            if (kingI != idx && kingJ != jdx) {
                if (kingI < idx) {
                    if (kingJ < jdx) {
                        while (kingI < idx) {
                            state.checkBlock[i].push([idx, jdx])
                            idx--
                            jdx--
                        }
                    } else {
                        while (kingI < idx) {
                            state.checkBlock[i].push([idx, jdx])
                            idx--
                            jdx++
                        }
                    }
                } else {
                    if (kingJ < jdx) {
                        while (kingI > idx) {
                            state.checkBlock[i].push([idx, jdx])
                            idx++
                            jdx--
                        }
                    } else {
                        while (kingI > idx) {
                            state.checkBlock[i].push([idx, jdx])
                            idx++
                            jdx++
                        }
                    }
                }
            }
        } if (p instanceof Knight) {
            state.checkBlock[i].push([idx, jdx])
            // if knight can be captured (or king can move away), no mate, if not, mate
        }

    }
    // IF THERE IS NO OVERLAP BETWEEN ALL OF THE ARRAYS INSIDE CHECKBLOCK 
    // ONLY WAY TO ESCAPE CHECK IS FOR KING TO MOVE TO FREE SPACE

    // IF THERE IS OVERLAP, TURN STATE.CHECKBLOCK INTO THOSE OVERLAPPING SPOTS

    // Later on, for efficiency, i believe if 2 or more pieces are checking a king,
    // the only way to escape is for the king to move
    // thus, if state.whiteCheck.length > 1, no need to run thru checkblock. 
    // only need to run kingEscape
    if (state.checkBlock.length > 1) {
        let result = state.checkBlock.shift().reduce(function (res, v) {
            if (res.indexOf(v) === -1 && state.checkBlock.every(function (a) {
                return a.indexOf(v) !== -1;
            })) res.push(v);
            return res;
        }, []);
        state.checkBlock = result
    }

    console.log("bottom of buildCheckBlock function: ", state.whiteMoves)
    if (state.whiteCheck.length) {
        checkForCheckMate('white')
    } else if (state.blackCheck.length) {
        checkForCheckMate('black')
    }
}

function kingEscape(king) {

    console.log("WE've FOUND KING INSTANCE")
    // console.log("IS KING LAST MOVE IN WHITEMOVES? :", i == state.whiteMoves.length - 1)
    // THIS IS THE LAST PART, CHECK FOR KING 
    // if the king is the piece that can potentially block the check
    // determine if the king can capture the piece checking
    // if not, determine if the king can move out of check (into a safe spot)
    // if not, checkmate!
    let opponentMoves = king.team == 'white' ? state.whiteMoves : state.blackMoves

    // see which moves the king can ACTUALLY make within it's moves array
    let allKingMoves = king.moves
    let numOfKingMoves = allKingMoves.length
    let spotsChecked = []
    allKingMoves.forEach(m => {
        if (m.piece != null && m.piece.team == 'white') {
            numOfKingMoves -= 1
        }
    })
    console.log("ALL OF THE KING's POSSIBLE MOVES: ", allKingMoves)


    for (let x = 0; x < king.moves.length; x++) {
        // state.checkMate = true
        let m = king.moves[x]
        // king.moves.forEach((m, x) => {
        // let [newI,newJ] = JSON.parse(m.spot)
        console.log(m.spot)
        // console.log( state.movingPiece = king
        // console.log("STATE MOVING PIECE: :",state.movingPiece)
        // movePiece(newI, newJ)
        console.log("STATE BLACK MOVES, to see if king can evade check: ", opponentMoves)

        for (let movesIdx = 0; movesIdx < opponentMoves.length; movesIdx++) {
            console.log(`BLACK PIECE MOVES ${movesIdx}`, opponentMoves[movesIdx])
            for (let oneMove = 0; oneMove < opponentMoves[movesIdx].moves.length; oneMove++) {
                let individualMove = opponentMoves[movesIdx].moves[oneMove].spot
                // console.log('EACH INDIVIDUAL BLACK MOVE: ',opponentMoves[blackMoveIdx].moves[oneMove])
                console.log("INDIVIDUAL MOVE: ", individualMove)
                if (m.spot == individualMove) {
                    console.log("FOUND M SPOT = INDIV MOVE")
                    if (!spotsChecked.includes(individualMove)) {
                        let [checkI, checkJ] = JSON.parse(individualMove)
                        if (!board[checkI][checkJ] || board[checkI][checkJ].team != king.team) {

                            numOfKingMoves -= 1
                        }
                        // if()
                    }
                    spotsChecked.push(individualMove)
                    // NEED TO MAKE SURE HERE THAT IF MULTIPLE PIECES ARE ATTACKING THE SAME
                    // POTENTIAL KING MOVE SPOT, THAT numOfKingMoves ONLY
                    // GOES DOWN BY ONE
                    // debugger
                }

            }
            console.log("HOW MANY KING MOVES LEFT: ", numOfKingMoves)
            if (numOfKingMoves == 0) {
                state.checkMate = true
            } else {
                state.checkMate = false
            }
        }

    }
    if (state.checkMate) {
        return
    }
    

    // EVEN IF this occurs, we still need to make sure that there are
    // no other pieces that can intercept check 
    // ( i suppose the best way to do this would to be not putting a return statement
    // in this if block, so that if it ever hits the else after it will set 
    // state.checkMate back to false)
}

function checkForCheckMate(team) {
    let king = team == 'white' 
    ? state.whiteMoves.filter(p => p instanceof King)[0] 
    : state.blackMoves.filter(p => p instanceof King)[0] 

    let teamMoves = team == 'white' ? state.whiteMoves : state.blackMoves
    if (state.checkBlock.length == 0) {
        // state.checkMate = true

        kingEscape(king)
        return
    }
    console.log("HITTING checkForCheckMate")
    for (let i = 0; i < teamMoves.length; i++) {
        // I WANT TO LOOK AT THE KING LAST, SO THAT IF WE FINALLY DO LOOK AT THE KING AND 
        // HE CANNOT MOVE, WE ARE CERTAIN OF CHECKMATE 
        if (teamMoves[i] instanceof King && i != teamMoves.length - 1) {
            let currentKing = teamMoves.splice(i, 1)
            teamMoves.push(currentKing[0])
        }
        console.log("STATE WHITE MOVES: ", teamMoves)
        console.log("CURRENT PIECE BEING LOOKED AT: ", teamMoves[i])
        console.log("ALL CURRENT MOVES FOR PARTICULAR PIECE", teamMoves[i].moves)
        // console.log(teamMoves[i])
        for (let j = 0; j < teamMoves[i].moves.length; j++) {
            // check king last

            for (let k = 0; k < state.checkBlock.length; k++) {
                console.log("STRINGIFY CHECKBLOCK AT K ", k, JSON.stringify(state.checkBlock[k]))
                console.log("PIECE BEING LOOKED AT: ", teamMoves[i])
                console.log(" WHITEMOVES AT J ", j, teamMoves[i].moves[j].spot)
                if (JSON.stringify(state.checkBlock[k]).includes(teamMoves[i].moves[j].spot)) {
                    console.log("INCLUDED! ", teamMoves[i].moves[k])
                    console.log("PIECE: ", teamMoves[i])
                    if (teamMoves[i] instanceof King) {
                        kingEscape(teamMoves[i])
                    } else {
                        state.checkMate = false
                        console.log('state checkMate: ', state.checkMate)
                        if (k == state.checkBlock.length - 1) {
                            return
                        }
                    }
                } else {
                    if (k == state.checkBlock.length - 1) {
                        state.checkMate = true
                    }
                }

            }

        }

    }
    // state.checkMate = true
    console.log('state checkMate: ', state.checkMate)
    return
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
            console.log("THIS IS THE SELECTED PIECE", state.movingPiece)
        } else {
            console.log("STATE MOVING PIECE :", state.movingPiece)
            if (state.movingPiece && state.movingPiece.checkMove()) {
                movePiece(i, j)
                findEveryMove(board)
            } else {
                // state.invalidMove = {i,j,name: state.movingPiece.constructor.toString().split(' ')[1]}
                console.log("Not your turn :(", attemptedSelect, state.movingPiece)
            }
        }
    } else {
        console.log(attemptedSelect)
        if (state.movingPiece && !attemptedSelect) {
            if (state.movingPiece.checkMove()) {
                movePiece(i, j)
                findEveryMove(board)
            } else {
                console.log("Invalid move, please try again!")
                // state.invalidMove = {i,j,name: state.movingPiece.constructor.toString().split(' ')[1]}
            }
        }
    }
    // console.log('about to hit findEveryMove in HandleClick Func')
    // findEveryMove(board)
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

    if (!state.whiteCheck.length && !state.blackCheck.length) {
        msg.textContent = `Chess! - Turn: ${players[state.turn].charAt(0).toUpperCase()}${players[state.turn].slice(1)}`
    } else if (state.whiteCheck.length) {
        state.checkMate ? msg.textContent = `CHECKMATE!` : msg.textContent = `White is in check!`
    } else {
        state.checkMate ? msg.textContent = `CHECKMATE!` : msg.textContent = `Black is in check!`
    }
    if (state.invalidMove) {
        console.log(state.invalidMove)
        if (state.whiteCheck.length) {
            msg.textContent = `${state.invalidMove.name} ${letterLookup[state.invalidMove.j]}${state.invalidMove.i + 1} is invalid. White king is checked`
        } else if (state.blackCheck.length) {
            msg.textContent = `${state.invalidMove.name} ${letterLookup[state.invalidMove.j]}${state.invalidMove.i + 1} is invalid. Black king is checked`
        } else {
            msg.textContent = `${state.invalidMove.name} ${letterLookup[state.invalidMove.j]}${state.invalidMove.i + 1} is invalid.`

        }
    }
    if (state.checkMate) gameBoard.removeEventListener('click', handleClick)
}

