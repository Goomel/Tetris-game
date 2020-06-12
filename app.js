const canvas = document.getElementById('tetris');
const ctx = canvas.getContext("2d");

const rows = 20;
const columns = 10;
const sq = 20; //square size (20px x 20px)
const vacant = "white"; //color of empty square

//tetrominoes shapes
const I = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ]
];

const J = [
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ]
];

const L = [
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]
];

const O = [
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ]
];

const S = [
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const T = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const Z = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ]
];

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
    return new Piece(pieces[random][0], pieces[random][1]);
}

class Piece {
    constructor(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;
        this.currTetromino = 0;
        this.activeTetromino = this.tetromino[this.currTetromino];
        this.x = 3;
        this.y = 0;
    }
}
const p = randomTetromino();
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

//falling down of tetromino
Piece.prototype.moveDown = () => {

}
