console.log("JS LOADED")

let board = [
  ['wR','wKn','wB','wK','wQ','wB','wKn','wR',],
  ['wP','wP','wP','wP','wP','wP','wP','wP',],
  [null,null,null,null,null,null,null,null,],
  [null,null,null,null,null,null,null,null,],
  [null,null,null,null,null,null,null,null,],
  [null,null,null,null,null,null,null,null,],
  ['bP','bP','bP','bP','bP','bP','bP','bP',],
  ['bR','bKn','bB','bQ','bK','bB','bKn','bR',],
]

let gameBoard = document.getElementById('board')

init()


function init(){

    appendBoard()
    render()
}



function appendBoard(){
    board.forEach((e,i) => {
        e.forEach((f, j) => {
            let square = document.createElement('div')
            square.setAttribute('id', `c${i}r${j}`)
            square.setAttribute('class', 'square')
            console.log(f)
            let x = (j + i) %2
            x ? square.style.backgroundColor = 'brown' 
            : square.style.backgroundColor = 'beige'
            square.textContent = f
            gameBoard.appendChild(square)
        })
    })
}

function render(){

}