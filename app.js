const canvas = document.getElementById('tetris');
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById('score');
const linesElement = document.getElementById('lines');
const startBtn = document.getElementById('start-btn');

let game;
let gameOver = false;

const rows = 20;
const columns = 10;
const sq = 20; //square size (20px x 20px)
const vacant = "white"; //color of empty square
let score = 0;
let lines = 0;
let nextX;
let nextY;
let p; //it will be Piece object
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
            drawSquare(c, r, board[r][c])
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

//random number of tetromino from tetrominoes.js file
const randomTetromino = () => {
    let random = Math.floor((Math.random() * pieces.length));
    //p variable become an instance of Piece class 
    return new Piece(pieces[random][0], pieces[random][1]);
}

//main class - every tetromino
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
            p = randomTetromino();
        }
    }

    rotate() {
        let nextTetromino = this.tetromino[(this.currTetromino + 1) % this.tetromino.length];

        if (!this.collisionDetect(0, 0, nextTetromino) && this.activeTetromino == O[0]) {
            this.undraw();
            this.draw();
        }
        else if (!this.collisionDetect(0, 0, nextTetromino) && this.activeTetromino != O[0]) {
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

                nextX = this.x + c + x;
                nextY = this.y + r + y;
                if (nextY < 0) continue;
                if (nextX >= columns || nextY >= rows || nextX < 0) {
                    return true;
                }
                if (board[nextY][nextX] != vacant) {
                    return true;
                }
            }
        }
        return false;
    }

    lock() {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                if (!this.activeTetromino[r][c]) {
                    continue;
                }
                // pieces to lock on top = game over
                if (this.y + r < 0) {
                    console.log("Game over");
                    // stop request animation frame
                    gameOver = true;
                    break;
                }
                //lock the piece
                score++;
                board[this.y + r][this.x + c] = this.color;
            }
        }
        for (let r = 0; r < rows; r++) {
            if (board[r].every((element) => element !== vacant)) {
                board.splice(r, 1);
                let newLine = new Array(10).fill("white")
                board.unshift(newLine);
                drawBoard();
                score += 20;
                lines++;
            }
            else {
                continue;
            }
        }
        scoreElement.textContent = score;
        linesElement.textContent = lines;
    }

}


const controlGame = (e) => {
    if (e.keyCode == 37 || e.keyCode == 65) {
        p.moveLeft();
    }
    else if (e.keyCode == 38 || e.keyCode == 87) {
        p.rotate();
    }
    else if (e.keyCode == 39 || e.keyCode == 68) {
        p.moveRight();
    }
    else if (e.keyCode == 40 || e.keyCode == 83) {
        p.moveDown();
    }
}

window.addEventListener('keydown', e => {
    controlGame(e);
})
const startGame = () => {
    p = randomTetromino();
    game = window.setInterval(() => p.moveDown(), 600);
}
const stopGame = () => {
    window.clearInterval(game);
}
startBtn.addEventListener('click', startGame)