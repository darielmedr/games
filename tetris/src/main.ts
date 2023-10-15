import { Coord } from "./models/coord.model";
import { Piece, PieceName, PieceShape } from "./models/piece.model";
import "./style.css";

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 30;
const SCORE_PER_ROW = 10;

const $score = document.querySelector<HTMLElement>("#score")!;
const canvas = document.querySelector<HTMLCanvasElement>("#board")!;
const context = canvas.getContext("2d")!;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

let board: number[][] = createNewBoard();
let piece: Piece = createRandomPiece();
let score: number = 0;

let dropDownTimeStamp = 0;

function start(): void {
  updateScore();
  handleKeyboardEvents();
  refresh();
}

function createNewBoard(): number[][] {
  return createEmptyMatrix(BOARD_WIDTH, BOARD_HEIGHT);
}

function createEmptyMatrix(x: number, y: number): number[][] {
  return Array(y)
    .fill(0)
    .map(() => Array(x).fill(0));
}

function createRandomPiece(): Piece {
  const position: Coord = {
    x: createRandomNumber(BOARD_WIDTH / 2),
    y: 0,
  };
  const randomPieceName = PieceName[createRandomNumber(PieceName.length)];
  const pieceShapeAndSize = PieceShape[randomPieceName];

  return { position, ...pieceShapeAndSize };
}

function createRandomNumber(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}

function refresh(timeStamp: number = 0): void {
  draw();
  autoDropPiece(timeStamp);
  window.requestAnimationFrame(refresh);
}

function autoDropPiece(timeStamp: number = 0): void {
  const elapsed = timeStamp - dropDownTimeStamp;

  if (elapsed < 1000) return;

  dropDownTimeStamp = timeStamp;
  moveDown();
}

function draw(): void {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawBoard();
  drawPiece();
}

function drawBoard(): void {
  board.forEach((row, y) =>
    row.forEach((value, x) => {
      if (!value) return;

      context.fillStyle = "yellow";
      context.fillRect(x, y, 1, 1);
    })
  );
}

function drawPiece(): void {
  const { position, shape } = piece;
  const { x: posX, y: PosY } = position;

  shape.forEach((row, y) =>
    row.forEach((value, x) => {
      if (!value) return;

      context.fillStyle = "red";
      context.fillRect(x + posX, y + PosY, 1, 1);
    })
  );
}

function handleKeyboardEvents(): void {
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") moveLeft();
    if (event.key === "ArrowRight") moveRight();
    if (event.key === "ArrowDown") moveDown();
    if (event.key === "ArrowUp") rotate();
  });
}

const moveLeft = () => {
  piece.position.x--;
  if (checkCollision()) piece.position.x++;
};
const moveRight = () => {
  piece.position.x++;
  if (checkCollision()) piece.position.x--;
};
const moveDown = () => {
  piece.position.y++;
  if (checkCollision()) {
    piece.position.y--;
    solidify();
    removeFullRowsAndUpdateScore();
    spawnNewPiece();
  }
};

const rotate = () => {
  const rotatedPiece = createEmptyMatrix(piece.height, piece.width);
  piece.shape.forEach((row, y) =>
    row.forEach((value, x) => {
      rotatedPiece[x][piece.shape.length - 1 - y] = value;
    })
  );
  piece.shape = rotatedPiece;
};

function checkCollision(): boolean {
  return piece.shape.some((row, y) =>
    row.some(
      (value, x) =>
        value && board[piece.position.y + y]?.[piece.position.x + x] !== 0
    )
  );
}

function solidify(): void {
  const { position, shape } = piece;
  const { x: posX, y: PosY } = position;

  shape.forEach((row, y) =>
    row.forEach((value, x) => {
      if (!value) return;
      board[y + PosY][x + posX] = 1;
    })
  );
}

function removeFullRowsAndUpdateScore(): void {
  board.forEach((row, x) => {
    const isFullRow = row.every(Boolean);
    if (!isFullRow) return;

    calculateScore();
    board.splice(x, 1);
    board.unshift(Array(BOARD_WIDTH).fill(0));
  });
}

function calculateScore(): void {
  score += SCORE_PER_ROW;
  updateScore();
}

function updateScore(): void {
  $score.innerText = `${score}`;
}

function spawnNewPiece(): void {
  piece = createRandomPiece();
  if (checkCollision()) gameOver();
}

function gameOver(): void {
  alert(`Game over!. Your score is ${score}.`);
  startOver();
}

function startOver(): void {
  updateScore();
  board = createNewBoard();
  piece = createRandomPiece();
}

start();
