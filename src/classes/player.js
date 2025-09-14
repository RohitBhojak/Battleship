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
  #mode; // hunt - random attack on board, target - attack based on last hit
  #firstHit; // First hit coordinates
  #attackDirection;
  #targetQueue; // Queue of coordinates to attack
  #targetVector;
  constructor(name, gameBoard) {
    super(name, gameBoard);
    this.#resetAIState();
  }

  #resetAIState() {
    this.#mode = "hunt";
    this.#targetQueue = [];
    this.#firstHit = null;
    this.#attackDirection = null;
    this.#targetVector = null;
  }

  attack(player) {
    let x, y, result;
    if (this.#mode === "hunt") {
      ({ x, y, result } = this.#huntAttack(player.gameBoard));
    } else {
      ({ x, y, result } = this.#targetAttack(player.gameBoard));
    }
    // If ship is sunk, reset AI state
    const attackedShip = player.gameBoard.board[x][y];
    if (attackedShip && attackedShip.isSunk()) {
      this.#resetAIState();
    }
    return { x, y, result };
  }

  #huntAttack(board) {
    let x, y, result;
    // Random attack
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      result = board.receiveAttack(x, y);
    } while (result === -1);

    // If hit, switch to target mode
    if (result === 1) {
      this.#mode = "target";
      this.#firstHit = { x, y };
      this.#addPotentialTargets(x, y, board);
    }
    return { x, y, result };
  }

  #targetAttack(board) {
    // if queue is empty, switch to hunt mode
    if (this.#targetQueue.length === 0) {
      this.#resetAIState();
      return this.#huntAttack(board);
    }
    let x, y, result;
    [x, y] = this.#targetQueue.shift();
    result = board.receiveAttack(x, y);
    // if hit, determine direction and build queue accordingly
    if (result === 1) {
      if (!this.#attackDirection) {
        // if direction is not yet known, this is second hit
        this.#establishDirectionAndBuildQueue(x, y, board);
      }
    } else if (result === 0 && this.#attackDirection) {
      // attack missed but direction is known
      this.#targetQueue = [];
      const reverseDx = -this.#targetVector.dx;
      const reverseDy = -this.#targetVector.dy;
      // add targets in reverse direction of the first hit
      this.#addTargetsInLine(
        this.#firstHit.x,
        this.#firstHit.y,
        reverseDx,
        reverseDy,
        board,
      );
    }
    return { x, y, result };
  }

  #establishDirectionAndBuildQueue(x, y, board) {
    const dx = x - this.#firstHit.x;
    const dy = y - this.#firstHit.y;
    this.#attackDirection = dx === 0 ? "horizontal" : "vertical";
    this.#targetVector = { dx, dy };
    this.#targetQueue = [];

    this.#addTargetsInLine(x, y, dx, dy, board);
  }

  #addTargetsInLine(x, y, dx, dy, board) {
    let nx = x + dx;
    let ny = y + dy;
    while (this.#isValidCoordinate(nx, ny, board)) {
      this.#targetQueue.push([nx, ny]);
      nx += dx;
      ny += dy;
    }
  }

  #addPotentialTargets(x, y, board) {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    directions.forEach(([dx, dy]) => {
      let nx = x + dx;
      let ny = y + dy;
      if (this.#isValidCoordinate(nx, ny, board)) {
        this.#targetQueue.push([nx, ny]);
      }
    });
  }

  // Check if a coordinate is valid
  #isValidCoordinate(x, y, board) {
    return x >= 0 && x < 10 && y >= 0 && y < 10 && !board.isAttacked(x, y);
  }
}
