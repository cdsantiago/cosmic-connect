class Game {
  constructor(columns = 7, rows = 6, players) {
    this.currPlayer = players.playerNumber[1];
    this.players = players;
    this.board = [];
    this.rows = rows;
    this.columns = columns;
    //make this available everywhere so I can pass it to removeEventListener and addEventListener refering to the same function.
    this.boundHandleClick = this.handleClick.bind(this);
  }

  makeBoard() {
    for (let row = 0; row < this.rows; row++) {
      this.board.push([]);
    }

    this.board.forEach((value) => {
      for (let i = 0; i < this.columns; i++) {
        value.push(null);
      }
    });
  }

  makeHtmlBoard() {
    const body = document.querySelector("body");
    body.classList.add("star-cursor");
    document.querySelector("#app-container").innerHTML = "";
    const container = document.querySelector("#app-container");

    const board = document.createElement("table");
    board.setAttribute("id", "game-board");

    const top = document.createElement("tr");
    top.addEventListener("click", this.boundHandleClick, true);
    top.setAttribute("id", "column-top");
    for (let x = 0; x < this.columns; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("class", x);

      top.appendChild(headCell);
    }

    container.appendChild(top);

    for (let y = 0; y < this.rows; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.columns; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("data-coordinates", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
    container.appendChild(board);
  }

  resetGame() {
    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
  }

  addReplayBtn() {
    const container = document.querySelector("#app-container");
    const replayBtn = document.createElement("button");
    replayBtn.setAttribute("id", "replay-btn");
    replayBtn.addEventListener("click", this.resetGame.bind(this));

    const replayIcon = document.createElement("img");
    replayIcon.src = "replay.svg";
    replayIcon.alt = "Replay";

    replayBtn.appendChild(replayIcon);

    container.appendChild(replayBtn);
  }

  placeInTable(y, x, evt) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.querySelectorAll(`[data-coordinates = "${y}-${x}"]`);

    if (spot.length === 1) {
      spot[0].append(piece);
    } else if (spot.length > 1) {
      spot[spot.length - 1].append(piece);
    }
  }

  endGame(msg) {
    //wait a few seconds bedore loading message, this makes it so the piece is actually appended
    //to the board before the alert blocks it
    setTimeout(() => {
      const removeClicks = () => {
        const top = document.querySelector("#column-top");
        top.removeEventListener("click", this.boundHandleClick, true);
      };
      removeClicks();
      alert(msg);
    }, 100);

    // document.getElementById("body").style.cursor = "default";
    this.addReplayBtn();
  }

  findSpotForCol(x) {
    for (let y = this.board.length - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.className;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);

    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x, evt);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(
        `${this.players.playerSimbol[this.currPlayer]} wins this round 🎉`
      );
    }

    // check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }

    // switch players

    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    this.fancyCursor();
  }

  fancyCursor() {
    const body = document.getElementById("body");

    if (body.classList.contains("star-cursor")) {
      body.classList.remove("star-cursor");
      body.classList.add("moon-cursor");
    } else {
      body.classList.remove("moon-cursor");
      body.classList.add("star-cursor");
    }
  }

  checkForWin() {
    const { columns, rows, board, currPlayer } = this;

    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < rows &&
          x >= 0 &&
          x < columns &&
          board[y][x] === currPlayer
      );
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
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

  initGame() {
    this.makeBoard();
    this.makeHtmlBoard();
  }
}

let players = { playerNumber: [0, 1, 2], playerSimbol: ["NA", "Star", "Moon"] };
let myGame = new Game(7, 6, players);

myGame.initGame();
