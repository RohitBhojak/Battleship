export default function renderBoard(boardDisplay, gameBoard, isEnemy = false) {
  boardDisplay.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = i;
      cell.dataset.y = j;
      // show player ships
      if (!isEnemy && gameBoard.board[i][j]) {
        cell.classList.add("ship");
      }
      // highlight hit cell
      if (gameBoard.isAttacked(i, j)) {
        cell.classList.add("hit");
      }
      // highlight sunk ship
      if (gameBoard.board[i][j] && gameBoard.board[i][j].isSunk()) {
        cell.classList.add("sunk");
      }
      boardDisplay.appendChild(cell);
    }
  }
}
