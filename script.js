const Gameboard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => [...board];

  const setMarker = (index, marker) => {
    if (index >= 0 && index < 9 && board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    for (let i = 0; i < 9; i++) {
      board[i] = "";
    }
  };

  return {
    getBoard,
    setMarker,
    resetBoard,
  };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const GameController = (function () {
  const players = [Player("Adam", "X"), Player("Eve", "O")];

  let activePlayer = players[0];
  let isGameOver = false;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const playRound = (index) => {
    if (isGameOver) return;

    if (Gameboard.setMarker(index, activePlayer.marker)) {
      if (checkWin()) {
        console.log(`${activePlayer.name} won!`);
        isGameOver = true;
        return;
      }

      if (!Gameboard.getBoard().includes("")) {
        console.log("Draw!");
        isGameOver = true;
        return;
      }

      switchPlayerTurn();
    } else {
      console.log("Mark already exist.");
    }
  };

  const resetGame = () => {
    isGameOver = false;
    activePlayer = players[0];
    Gameboard.resetBoard();
  };

  return {
    playRound,
    getActivePlayer,
    resetGame,
  };
})();

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkWin = () => {
  const board = Gameboard.getBoard();

  return winConditions.some((condition) => {
    const [a, b, c] = condition;

    return board[a] !== "" && board[a] === board[b] && board[a] === board[c];
  });
};

const displayController = (function () {
  const boardElement = document.getElementById("game-board");
  const statusElement = document.getElementById("status-message");
  const resetBtn = document.getElementById("reset-btn");

  resetBtn.addEventListener("click", () => {
    GameController.resetGame();
    updateDisplay();
  });

  const updateDisplay = () => {
    const board = Gameboard.getBoard();
    const activePlayer = GameController.getActivePlayer();

    boardElement.innerHTML = "";

    if (checkWin()) {
      statusElement.textContent = `Congratulations! ${activePlayer.name} won!`;
    } else if (!board.includes("")) {
      statusElement.textContent = "Draw! Do you wanna play again?";
    } else {
      statusElement.textContent = `${activePlayer.name}s turn (${activePlayer.marker})`;
    }

    board.forEach((marker, index) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = marker;

      cell.addEventListener("click", () => {
        GameController.playRound(index);
        updateDisplay();
      });

      boardElement.appendChild(cell);
    });
  };

  return { updateDisplay };
})();

displayController.updateDisplay();
