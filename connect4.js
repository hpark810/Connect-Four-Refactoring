/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(player1, player2, height = 6, width = 7) {
    this.players = [player1, player2];
    this.HEIGHT = height;
    this.WIDTH = width;
    this.htmlBoard = document.getElementById("htmlBoard");
    this.currPlayer = this.players[0]; // active player: 1 or 2
    /** makeBoard: create in-JS board structure:
     *   board = array of rows, each row is array of cells  (board[y][x])
     */
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }
  makeBoard() {
    this.boardInMemory = []; // array of rows, each row is array of cells  (board[y][x])
    for (let y = 0; y < this.HEIGHT; y++) {
      this.boardInMemory.push(Array.from({ length: this.WIDTH }));
    }
  }
  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    // make column tops (clickable area for adding a piece to that column)
    this.htmlBoard.innerHTML = "";
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    const handleClickBound = this.handleClick.bind(this);
    top.addEventListener("click", handleClickBound);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    this.htmlBoard.append(top);

    // make main part of boardInMemory
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      this.htmlBoard.append(row);
    }
  }
  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.boardInMemory[y][x]) {
        return y;
      }
    }
    return null;
  }
  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;
    // piece.classList.add(`player${this.players.indexOf(this.currPlayer) + 1}`);
    piece.style.top = -52 * (y + 1) + "px";

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  /** endGame: announce game end */
  endGame(msg) {
    this.gameOver = true;
    setTimeout(() => alert(msg), 1000);
  }
  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    if (this.gameOver) return;
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.boardInMemory[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.id} won!`);
    }

    // check for tie
    if (this.boardInMemory.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }

    // switch players
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    // use arrow function for _win so 'this' will refer to the Game instance
    const _win = (cells) =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.boardInMemory[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(id, color) {
    this.id = id;
    this.color = color;
  }
}
let color1 = document.querySelector("#p1-color").value;
let color2 = document.querySelector("#p2-color").value;
// Add a button to start/restart the game
const startButton = document.querySelector("#start-game");
startButton.addEventListener("click", function () {
  color1 = document.querySelector("#p1-color").value;
  color2 = document.querySelector("#p2-color").value;
  const player1 = new Player("1", color1);
  const player2 = new Player("2", color2);

  new Game(player1, player2, 6, 7);
});
