const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const linesElement = document.getElementById('lines');
const startBtn = document.getElementById('start-btn');
const nextTetrominoElement = document.getElementById('nextTetromino');

let game;
let gameOver = false;

const sizes = {
    rows: 20,
    columns: 10,
    width: 200,
    height: 400,
    sq: 20 //square size (20px x 20px)
}
const vacant = '#1D1C1B'; //color of empty square
const strokeColor = 'black';
const finishColor = 'rgba(112,169,161,0.6)';
let score = 0;
let lines = 0;
let nextX;
let nextY;
let p; //it will be Piece object
let board = [];
let nextTetromino;


for (r = 0; r < sizes.rows; r++) {
    board[r] = [];
    for (c = 0; c < sizes.columns; c++) {
        board[r][c] = vacant;
    }
}

//drawing a board
let drawSquare = (x, y, color) => {
    ctx.clearRect(x * sizes.sq, y * sizes.sq, sizes.sq, sizes.sq)
    ctx.fillStyle = color;
    ctx.fillRect(x * sizes.sq, y * sizes.sq, sizes.sq, sizes.sq);
    ctx.strokeStyle = strokeColor;
    ctx.strokeRect(x * sizes.sq, y * sizes.sq, sizes.sq, sizes.sq)
}

let drawBoard = (color) => {
    for (let c = 0; c < sizes.columns; c++) {
        for (let r = 0; r < sizes.rows; r++) {
            drawSquare(c, r, (color ? color : board[r][c]))
        }
    }
}
drawBoard();

//colors of pieces
const pieces = [
    [Z, "#F90408"],
    [S, "#DF5206"],
    [T, "#DD7B03"],
    [O, "#FBB30A"],
    [L, "#6DCB25"],
    [I, "#28B258"],
    [J, "#01BAEF"]
];

//random number of tetromino from tetrominoes.js file
const randomTetromino = () => {
    let random = Math.floor((Math.random() * pieces.length));
    //p variable become an instance of Piece class 
    return new Piece(pieces[random][0], pieces[random][1]);
}
const drawNextTetromino = () => {
    //clear the board
    [...nextTetrominoElement.children].forEach(block => block.style.backgroundColor = vacant)
    //draw new tetromino
    nextTetromino.activeTetromino.forEach((row, index) => {
        row.forEach((element, id) => {
            if (element) nextTetrominoElement.children[id + index * 4].style.backgroundColor = nextTetromino.color;
            console.log(element);
        })
    })
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
            p = nextTetromino;
            nextTetromino = randomTetromino();
            drawNextTetromino();
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
                if (nextX >= sizes.columns || nextY >= sizes.rows || nextX < 0) {
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
                if (this.y + r <= 1) {
                    console.log("Game over");
                    // stop request animation frame
                    gameOver = true;
                    window.clearInterval(game);
                    ctx.fillStyle = finishColor;
                    ctx.fillRect(sizes.sq, sizes.sq, 0.8 * sizes.width, 0.9 * sizes.height);
                    ctx.font = 'normal 30px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#FBFBFF';
                    ctx.fillText(`Score${score ? ':' + score : ''}`, sizes.width / 2, sizes.height / 2);
                    break;
                }
                //lock the piece
                score++;
                board[this.y + r][this.x + c] = this.color;

            }
        }
        for (let r = 0; r < sizes.rows; r++) {
            if (board[r].every((element) => element !== vacant)) {
                board.splice(r, 1);
                let newLine = new Array(10).fill(vacant)
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
    if (!gameOver) {
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
}

window.addEventListener('keydown', e => {
    controlGame(e);
})
const startGame = () => {
    gameOver = false;
    score = 0;
    lines = 0;
    scoreElement.textContent = score;
    linesElement.textContent = lines;
    window.clearInterval(game);
    for (r = 0; r < sizes.rows; r++) {
        for (c = 0; c < sizes.columns; c++) {
            board[r][c] = vacant;
        }
    }
    drawBoard(vacant);
    p = randomTetromino();
    nextTetromino = randomTetromino();
    game = window.setInterval(() => p.moveDown(), 600);
    drawNextTetromino();
}
startBtn.addEventListener('click', startGame)