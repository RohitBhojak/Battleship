export default class GameBoard {
  #attacked;
  #ships;
  constructor() {
    this.#ships = [];
    this.board = this.#createGrid(null); // Create a grid filled with null
    this.#attacked = this.#createGrid(false); // Create a grid filled with false
  }

  // Private helper method to create a 10x10 grid
  #createGrid(fillValue, n = 10) {
    const grid = [];
    for (let i = 0; i < n; i++) {
      grid.push(new Array(n).fill(fillValue));
    }
    return grid;
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
    // Perform initial, direction-independent checks first
    if (x < 0 || y < 0 || x > 9 || y > 9 || this.#ships.includes(ship)) {
      return false;
    }

    // Perform direction-dependent checks
    if (direction === "horizontal") {
      // Check if it goes out of bounds horizontally
      if (y + ship.length > 10) {
        return false;
      }
      // Check if any spot is already occupied
      for (let i = 0; i < ship.length; i++) {
        if (this.board[x][y + i] !== null) {
          return false;
        }
      }
    } else {
      // Vertical
      // Check if it goes out of bounds vertically
      if (x + ship.length > 10) {
        return false;
      }
      // Check if any spot is already occupied
      for (let i = 0; i < ship.length; i++) {
        if (this.board[x + i][y] !== null) {
          return false;
        }
      }
    }

    // If all checks pass, it's a valid placement
    return true;
  }

  receiveAttack(x, y) {
    if (this.#attacked[x][y]) {
      return -1;
    }
    this.#attacked[x][y] = true;
    if (this.board[x][y] !== null) {
      this.board[x][y].hit();
      return 1;
    }
    return 0;
  }

  allShipsSunk() {
    return this.#ships.every((ship) => ship.isSunk());
  }
}
