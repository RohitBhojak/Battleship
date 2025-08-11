import GameBoard from "../game-board.js";
import Ship from "../ship.js";

test("10x10 game board is initialized", () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.board.length).toBe(10);
  expect(gameBoard.board[0].length).toBe(10);
});

describe("placeShip", () => {
  let gameBoard;

  beforeEach(() => {
    gameBoard = new GameBoard();
  });

  test("places a ship horizontally on the game board", () => {
    const ship = new Ship(3);
    gameBoard.placeShip(ship, 0, 0, "horizontal");
    expect(gameBoard.board[0][0]).toBe(ship);
    expect(gameBoard.board[0][1]).toBe(ship);
    expect(gameBoard.board[0][2]).toBe(ship);
  });

  test("places a ship vertically on the game board", () => {
    const ship = new Ship(3);
    gameBoard.placeShip(ship, 5, 5, "vertical");
    expect(gameBoard.board[5][5]).toBe(ship);
    expect(gameBoard.board[6][5]).toBe(ship);
    expect(gameBoard.board[7][5]).toBe(ship);
  });

  test("prevents placing a ship on an occupied spot", () => {
    const ship1 = new Ship(3);
    const ship2 = new Ship(4);
    gameBoard.placeShip(ship1, 0, 0, "horizontal");
    expect(gameBoard.placeShip(ship2, 0, 1, "vertical")).toBe(false);
  });

  test("prevents placing the same ship more than once", () => {
    const ship = new Ship(3);
    gameBoard.placeShip(ship, 0, 0, "horizontal");
    // Attempt to place the same ship instance again
    expect(gameBoard.placeShip(ship, 5, 5, "vertical")).toBe(false);
  });

  test("prevents placing a ship out of horizontal bounds", () => {
    const ship = new Ship(4);
    expect(gameBoard.placeShip(ship, 0, 7, "horizontal")).toBe(false);
  });

  test("prevents placing a ship out of vertical bounds", () => {
    const ship = new Ship(4);
    expect(gameBoard.placeShip(ship, 7, 0, "vertical")).toBe(false);
  });
});

describe("receiveAttack", () => {
  let gameBoard;

  // Use beforeEach to reset the board state before each test.
  // This is crucial for test isolation.
  beforeEach(() => {
    gameBoard = new GameBoard();
    const ship = new Ship(3);
    gameBoard.placeShip(ship, 0, 0, "horizontal");
  });

  test("correctly registers a successful hit on a ship", () => {
    expect(gameBoard.receiveAttack(0, 1)).toBe(true);
  });

  test("correctly registers a missed attack", () => {
    expect(gameBoard.receiveAttack(5, 5)).toBe(true);
  });

  test("prevents attacking the same coordinate more than once", () => {
    gameBoard.receiveAttack(0, 0); // First attack
    expect(gameBoard.receiveAttack(0, 0)).toBe(false); // Second attack fails
  });
});

describe("allShipsSunk", () => {
  let gameBoard;
  let ship1;
  let ship2;

  // Use beforeEach to ensure a fresh board for every test.
  beforeEach(() => {
    gameBoard = new GameBoard();
    ship1 = new Ship(2);
    ship2 = new Ship(1);
    gameBoard.placeShip(ship1, 0, 0, "horizontal");
    gameBoard.placeShip(ship2, 5, 5, "vertical");
  });

  test("returns false when no ships are sunk", () => {
    expect(gameBoard.allShipsSunk()).toBe(false);
  });

  test("returns false when only some ships are sunk", () => {
    // Sink the first ship
    ship1.hit();
    ship1.hit();
    expect(gameBoard.allShipsSunk()).toBe(false);
  });

  test("returns true when all ships are sunk", () => {
    // Sink both ships
    ship1.hit();
    ship1.hit();
    ship2.hit();
    expect(gameBoard.allShipsSunk()).toBe(true);
  });
});
