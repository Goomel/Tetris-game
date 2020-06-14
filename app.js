const canvas = document.getElementById('tetris');
const ctx = canvas.getContext("2d");
let game;

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
    fill(color) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            for (let r = 0; r < this.activeTetromino.length; r++) {
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
        // console.log(this);
    }
    draw() {
        this.fill(this.color);
        // console.log(this);
    }
    undraw() {
        // console.log(this);
        this.fill(vacant);
    }
    moveDown() {
        this.collisionDetect(0, 2, this.activeTetromino);

        this.undraw();
        this.y++;
        this.draw();
        // console.log(this.x);
    }
    rotate() {
        // this.collisionDetect();
        this.undraw();
        this.currTetromino < 3 ? this.currTetromino++ : this.currTetromino = 0;
        this.activeTetromino = this.tetromino[this.currTetromino];
        this.draw();
    }
    moveRight() {
        this.collisionDetect(2, 0, this.activeTetromino);
        this.undraw();
        this.x++;
        this.draw();
        window.clearInterval(game);
    }
    moveLeft() {
        this.collisionDetect(-2, 0, this.activeTetromino);
        this.undraw();
        this.x--;
        this.draw();
    }
    collisionDetect(x, y, piece) {
        for (let c = 0; c < piece.length; c++) {
            for (let r = 0; r < piece.length; r++) {
                //if the square is empty - continue
                if (!piece[c][r])
                    continue;
                //p.x is one less than should be
                let nextX = this.x + r + x;
                let nextY = this.y + c + y;
                // console.log(this);
                console.log('x ', x, y);
                console.log('this.x ', this.x, this.y);
                console.log('next ', nextX, nextY);
                if (nextX >= columns || nextY >= rows || nextX <= 0) {
                    console.log("Border!");
                    return true;
                }
            }
        }
    }
}


const controlGame = e => {
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
}

window.addEventListener('keydown', e => {
    controlGame(e);
})
const startGame = () => {
    p = randomTetromino();
    game = window.setInterval(() => p.moveDown(), 1000);
}

startBtn.addEventListener('click', startGame)