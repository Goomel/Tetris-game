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
// let board = [...Array(rows).fill([])];
// board.forEach((arr) => {
//     for (let c = 0; c < columns; c++) {
//         arr[c] = vacant;
//     }
// })
let board = [];
for (r = 0; r < rows; r++) {
    board[r] = [];
    for (c = 0; c < columns; c++) {
        board[r][c] = vacant;
    }
}

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
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }
    draw() {
        this.fill(this.color);
    }
    undraw() {
        this.fill(vacant);
    }
    moveDown() {
        if (!this.collisionDetect(0, 1, this.activeTetromino)) {
            this.undraw();
            this.y++;
            this.draw();
        } else {
            this.lock();

            // p = randomTetromino();
        }
    }

    rotate() {
        let nextTetromino = this.tetromino[(this.currTetromino + 1) % this.tetromino.length];
        if (!this.collisionDetect(0, 0, nextTetromino)) {
            this.undraw();
            this.currTetromino < 3 ? this.currTetromino++ : this.currTetromino = 0;
            this.activeTetromino = this.tetromino[this.currTetromino];
            this.draw();
        }
    }

    moveRight() {
        if (!this.collisionDetect(1, 0, this.activeTetromino)) {
            this.undraw();
            this.x++;
            this.draw();
        }
    }

    moveLeft() {
        if (!this.collisionDetect(-1, 0, this.activeTetromino)) {
            this.undraw();
            this.x--;
            this.draw();
        }
    }

    collisionDetect(x, y, piece) {
        for (let r = 0; r < piece.length; r++) {
            for (let c = 0; c < piece.length; c++) {
                //if the square is empty - continue
                if (!piece[r][c]) continue;

                let nextX = this.x + c + x;
                let nextY = this.y + r + y;
                if (nextY < 0) continue;
                if (nextX >= columns || nextY >= rows || nextX < 0) {
                    return true;
                }
                // if (board[nextX][nextY] != vacant) {
                //     console.log('Other piece!');
                //     return true;
                // }
            }
        }
    }

    lock() {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                if (!this.activeTetromino[r][c]) {
                    continue;
                }
                // pieces to lock on top = game over
                if (this.y + r < 0) {
                    alert("Game Over");
                    // stop request animation frame
                    // gameOver = true;
                    break;
                }
                //lock the piece
                console.log("Y: ", this.y, " X: ", this.x);
                console.log("r: " + r, " c: " + c);
                board[this.y + r][this.x + c] = this.color;
                console.log(board);
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
    game = window.setInterval(() => p.moveDown(), 800);
}

startBtn.addEventListener('click', startGame)