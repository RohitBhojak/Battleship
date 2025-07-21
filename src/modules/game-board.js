export default class GameBoard {
  #attacked;
  #ships = [];
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
    if (this.canPlace(ship, x, y, direction)) {
      this.#ships.push(ship);
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

  canPlace(ship, x, y, direction) {
    if (
      x < 0 ||
      y < 0 ||
      x + ship.length > 10 ||
      y + ship.length > 10 ||
      this.#ships.includes(ship)
    ) {
      return false;
    }
    if (direction === "horizontal") {
      for (let i = 0; i < ship.length; i++) {
        if (this.board[x][y + i] !== null) {
          return false;
        }
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
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

  allShipsSunk() {
    return this.#ships.every((ship) => ship.isSunk());
  }
}
