export class Player {
  constructor(name, gameBoard) {
    this.name = name;
    this.gameBoard = gameBoard;
  }

  // Randomly place ships on the board
  randomizeBoard(ships) {
    this.gameBoard.clearBoard(); // Clear the board
    ships.forEach((ship) => {
      let x, y, direction;
      do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        direction = Math.random() < 0.5 ? "horizontal" : "vertical";
      } while (!this.gameBoard.canPlace(ship, x, y, direction));
      this.gameBoard.placeShip(ship, x, y, direction);
    });
  }

  attack(enemy, x, y) {
    const result = enemy.gameBoard.receiveAttack(x, y);
    return { x, y, result };
  }
}

export class Computer extends Player {
  #mode; // hunt - random attack on board, target - attack based on last hit
  #huntTargets; // Contains targets in checkered pattern to improve efficiency
  #hitQueue; // Queue ship coordinates that are hit but not sunk
  #targetQueue; // Queue of coordinates to attack
  #targetVector;
  constructor(name, gameBoard) {
    super(name, gameBoard);
    this.#initializeHuntTargets();
    this.#resetAIState();
  }

  #resetAIState() {
    this.#mode = "hunt";
    this.#targetQueue = [];
    this.#hitQueue = [];
    this.#targetVector = null;
  }

  #initializeHuntTargets() {
    this.#huntTargets = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        if ((x + y) % 2 === 0) {
          this.#huntTargets.push({ x, y });
        }
      }
    }

    // Shuffle the array to randomize hunt attacks
    this.#shuffleArray(this.#huntTargets);
  }

  #shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  attack(player) {
    let x, y, result;
    if (this.#mode === "hunt") {
      ({ x, y, result } = this.#huntAttack(player.gameBoard));
    } else {
      ({ x, y, result } = this.#targetAttack(player.gameBoard));
    }
    // If ship is sunk, remove it from hitQueue
    const attackedShip = player.gameBoard.board[x][y];
    if (attackedShip && attackedShip.isSunk()) {
      this.#hitQueue = this.#hitQueue.filter(
        (hit) => player.gameBoard.board[hit.x][hit.y] !== attackedShip,
      );

      // if hitQueue is empty, switch to hunt mode
      if (this.#hitQueue.length === 0) {
        this.#resetAIState();
      } else {
        // rebuild target queue
        this.#targetVector = null;
        this.#rebuildTargetQueue(player.gameBoard);
      }
    }
    return { x, y, result };
  }

  #huntAttack(board) {
    const { x, y } = this.#huntTargets.pop();
    const result = board.receiveAttack(x, y);

    // If cell is already attacked, attack again
    if (result === -1) {
      return this.#huntAttack(board);
    }

    // If hit, switch to target mode
    if (result === 1) {
      this.#mode = "target";
      this.#hitQueue.push({ x, y });
      this.#addPotentialTargets(x, y, board);
    }
    return { x, y, result };
  }

  #targetAttack(board) {
    // If queue is empty, rebuild target queue
    if (this.#targetQueue.length === 0) {
      this.#rebuildTargetQueue(board);
      // If queue is still empty, switch to hunt mode
      if (this.#targetQueue.length === 0) {
        this.#resetAIState();
        return this.#huntAttack(board);
      }
    }
    const [x, y] = this.#targetQueue.shift();
    const result = board.receiveAttack(x, y);
    // if hit, determine direction and build queue accordingly
    if (result === 1) {
      this.#hitQueue.push({ x, y });
      if (!this.#targetVector) {
        // if direction is not yet known, establish direction and build targetQueue
        this.#establishDirectionAndBuildQueue({ x, y }, board);
      }
    } else if (result === 0 && this.#targetVector) {
      // if miss, reverse direction
      const firstHitOfLine = this.#hitQueue[this.#hitQueue.length - 2];
      this.#targetQueue = []; // clear queue
      const reverseDx = -this.#targetVector.dx;
      const reverseDy = -this.#targetVector.dy;
      this.#addTargetsInLine(firstHitOfLine, reverseDx, reverseDy, board);
      this.#targetVector = null;
    }
    return { x, y, result };
  }

  #establishDirectionAndBuildQueue(currentHit, board) {
    for (const prevHit of this.#hitQueue) {
      // If hit is in the same row or column, establish direction
      if (prevHit.x === currentHit.x || prevHit.y === currentHit.y) {
        const dx = Math.sign(currentHit.x - prevHit.x);
        const dy = Math.sign(currentHit.y - prevHit.y);
        this.#targetVector = { dx, dy };
        this.#targetQueue = [];
        this.#addTargetsInLine(currentHit, dx, dy, board);
        return; // Exit when direction is found
      }
    }
  }

  #addTargetsInLine(startHit, dx, dy, board) {
    let nx = startHit.x + dx;
    let ny = startHit.y + dy;
    while (this.#isValidCoordinate(nx, ny, board)) {
      this.#targetQueue.push([nx, ny]);
      nx += dx;
      ny += dy;
    }
  }

  #rebuildTargetQueue(board) {
    this.#targetQueue = [];
    for (const hit of this.#hitQueue) {
      this.#addPotentialTargets(hit.x, hit.y, board);
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
