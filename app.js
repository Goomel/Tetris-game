const canvas = document.getElementById('tetris');
const ctx = canvas.getContext("2d");

const rows = 20;
const columns = 10;
const sq = 20; //square size (20px x 20px)
const vacant = "white"; //color of empty square
const startBtn = document.getElementById('start-btn');
//it will be Piece class object
let p;

//creating a board and filling by vacant
let board = [...Array(rows).fill([])];
board.forEach((arr) => {
    for (let c = 0; c < columns; c++) {
        arr[c] = vacant;
    }
})

//drawing a board
let drawSquare = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * sq, y * sq, sq, sq);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x * sq, y * sq, sq, sq)
}

let drawBoard = () => {
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            drawSquare(c, r, vacant)
        }
    }
}
drawBoard();

//colors of pieces
const pieces = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

const randomTetromino = () => {
    let random = Math.round((Math.random() * pieces.length));
    //p variable become an instance of Piece class 
    return new Piece(pieces[random][0], pieces[random][1]);
}

class Piece {
    constructor(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;
        this.currTetromino = 0;
        this.activeTetromino = this.tetromino[this.currTetromino];
        this.x = 3;
        this.y = -2;
    }
}

Piece.prototype.fill = (color) => {
    for (let c = 0; c < p.activeTetromino.length; c++) {
        for (let r = 0; r < p.activeTetromino.length; r++) {
            if (p.activeTetromino[r][c]) {
                drawSquare(p.x + c, p.y + r, color)
            }
        }
    }
}
Piece.prototype.draw = () => {
    p.fill(p.color);
}
Piece.prototype.undraw = () => {
    p.fill(vacant);
}
Piece.prototype.moveDown = () => {
    p.undraw();
    p.y++;
    p.draw();
}
Piece.prototype.rotate = () => {
    p.undraw();
    p.currTetromino < 3 ? p.currTetromino++ : p.currTetromino = 0;
    p.activeTetromino = p.tetromino[p.currTetromino];
    p.draw();
}
Piece.prototype.moveRight = () => {
    p.undraw();
    p.x++;
    p.draw();
}
Piece.prototype.moveLeft = () => {
    p.undraw();
    p.x--;
    p.draw();
}


window.addEventListener('keydown', (e) => {
    if (e.keyCode == 37) {
        p.moveLeft();
    }
    else if (e.keyCode == 38) {
        p.rotate();
    }
    else if (e.keyCode == 39) {
        p.moveRight();
    }
    else if (e.keyCode == 40) {
        p.moveDown();
    }
})

const startGame = () => {
    p = randomTetromino();
    window.setInterval(p.moveDown, 600);
}

startBtn.addEventListener('click', startGame)

