export default class GameBoard {
  #attacked;
  constructor() {
    this.board = [];
    this.#attacked = [];
    for (let i = 0; i < 10; i++) {
      const nullArr = new Array(10);
      nullArr.fill(null);
      this.board.push(nullArr);

      const falseArr = new Array(10);
      falseArr.fill(false);
      this.#attacked.push(falseArr);
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

  receiveAttack(x, y) {
    if (this.#attacked[x][y]) {
      return false;
    } else if (this.board[x][y] !== null) {
      this.board[x][y].hit();
      this.#attacked[x][y] = true;
    } else {
      this.#attacked[x][y] = true;
    }
    return true;
  }
}
