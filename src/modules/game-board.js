export default class GameBoard {
  constructor() {
    this.board = [];
    for (let i = 0; i < 10; i++) {
      const arr = new Array(10);
      arr.fill(null);
      this.board.push(arr);
    }
  }

  placeShip(ship, x, y, direction) {
    if (this.canPlace(ship.length, x, y, direction)) {
      if (direction === "horizontal") {
        for (let i = 0; i < ship.length; i++) {
          this.board[x][y + i] = ship;
        }
      } else {
        for (let i = 0; i < ship.length; i++) {
          this.board[x + i][y] = ship;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  canPlace(shipLength, x, y, direction) {
    if (x < 0 || y < 0 || x + shipLength > 10 || y + shipLength > 10) {
      return false;
    }
    if (direction === "horizontal") {
      for (let i = 0; i < shipLength; i++) {
        if (this.board[x][y + i] !== null) {
          return false;
        }
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        if (this.board[x + i][y] !== null) {
          return false;
        }
      }
    }
    return true;
  }
}
