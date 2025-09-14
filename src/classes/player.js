export class Player {
  constructor(name, gameBoard) {
    this.name = name;
    this.gameBoard = gameBoard;
  }

  // Randomly place ships on the board
  randomizeBoard(ships) {
    let x, y, direction;
    ships.forEach((ship) => {
      do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        direction = Math.random() < 0.5 ? "horizontal" : "vertical";
      } while (!this.gameBoard.canPlace(ship, x, y, direction));
      this.gameBoard.placeShip(ship, x, y, direction);
    });
  }
}

export class Computer extends Player {
  static DIRECTIONS = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  constructor(name, gameBoard) {
    super(name, gameBoard);
  }

  attack(player, lastX = null, lastY = null) {
    let result = 1;
    let x, y;
    while (result == -1) {
      if (lastX != null && lastY != null) {
        const direction = Computer.DIRECTIONS[Math.floor(Math.random() * 4)];
        x = lastX + direction[0];
        y = lastY + direction[1];
      } else {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      }

      result = player.gameBoard.receiveAttack(x, y);
    }
    return result ? [x, y] : [lastX, lastY];
  }
}
