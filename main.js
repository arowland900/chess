console.log("JS LOADED")

let board = new Array(8).fill(new Array(8).fill(null))

let gameBoard = document.getElementById('board')

init()


function init(){

    appendBoard()
}

function appendBoard(){
    board.forEach((e,i) => {
        // let row = document.createElement('div')
        // row.setAttribute('id', `row${i}`)
        // gameBoard.appendChild(row)
        
        e.forEach((f, j) => {
            let square = document.createElement('div')
            square.setAttribute('id', `c${i}r${j}`)
            square.setAttribute('class', 'square')
            console.log((j + i) %2)
            let x = (j + i) %2
            x ? square.style.backgroundColor = 'brown' 
            : square.style.backgroundColor = 'beige'
            // console.log("HELL)
            gameBoard.appendChild(square)
        })
    })
}

console.log(gameBoard)