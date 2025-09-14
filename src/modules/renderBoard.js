export default function renderBoard(board, gameBoard, isEnemy = false) {
  board.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = i;
      cell.dataset.y = j;
      // show player ships
      if (!isEnemy && gameBoard.board[i][j] !== null) {
        cell.classList.add("ship");
      }
      board.appendChild(cell);
    }
  }
  return board;
}
