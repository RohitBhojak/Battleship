export class Player {
  constructor(name, gameBoard) {
    this.name = name;
    this.gameBoard = gameBoard;
  }

  // Randomly place ships on the board
  randomizeBoard(ships) {
    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let direction = Math.random() < 0.5 ? "horizontal" : "vertical";
      while (!this.gameBoard.canPlace(ship, x, y, direction)) {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        direction = Math.random() < 0.5 ? "horizontal" : "vertical";
      }
      this.gameBoard.placeShip(ship, x, y, direction);
    }
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
    if (lastX !== null && lastY !== null) {
      for (let i = 0; i < 4; i++) {
        const direction = Computer.DIRECTIONS[i];
        const x = lastX + direction[0];
        const y = lastY + direction[1];
        const result = player.gameBoard.receiveAttack(x, y);
        if (result) {
          return [x, y];
        }
      }
      return null;
    }
  }
}
