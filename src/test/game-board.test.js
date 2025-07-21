import GameBoard from "../modules/game-board.js";
import Ship from "../modules/ship.js";

test("10x10 game board is initialized", () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.board.length).toBe(10);
  expect(gameBoard.board[0].length).toBe(10);
});

describe("placeShip", () => {
  let gameBoard;
  let shipObj;
  beforeEach(() => {
    gameBoard = new GameBoard();
    shipObj = new Ship(3);
  });

  test("place ship horizontally on game board", () => {
    gameBoard.placeShip(shipObj, 0, 0, "horizontal");
    expect(gameBoard.board[0][0]).toBe(shipObj);
    expect(gameBoard.board[0][1]).toBe(shipObj);
    expect(gameBoard.board[0][2]).toBe(shipObj);
  });

  test("place ship vertically on game board", () => {
    gameBoard.placeShip(shipObj, 5, 5, "vertical");
    expect(gameBoard.board[5][5]).toBe(shipObj);
    expect(gameBoard.board[6][5]).toBe(shipObj);
    expect(gameBoard.board[7][5]).toBe(shipObj);
  });

  test("ship cannot be placed on same spot", () => {
    gameBoard.placeShip(shipObj, 0, 0, "horizontal");
    expect(gameBoard.placeShip(shipObj, 0, 0, "horizontal")).toBe(false);
  });

  test("ship cannot be placed more than once", () => {
    gameBoard.placeShip(shipObj, 0, 0, "horizontal");
    expect(gameBoard.placeShip(shipObj, 0, 0, "horizontal")).toBe(false);
  });

  test("ship cannot be placed out of bounds", () => {
    gameBoard.placeShip(shipObj, 0, 0, "horizontal");
    expect(gameBoard.placeShip(shipObj, 2, 9, "horizontal")).toBe(false);
  });

  test("ship cannot be placed out of bounds", () => {
    gameBoard.placeShip(shipObj, 0, 0, "horizontal");
    expect(gameBoard.placeShip(shipObj, 9, 2, "vertical")).toBe(false);
  });
});

describe("receiveAttack", () => {
  const gameBoard = new GameBoard();
  beforeAll(() => {
    const shipObj = new Ship(3);
    gameBoard.placeShip(shipObj, 0, 0, "horizontal");
  });
  test("successful attacks", () => {
    expect(gameBoard.receiveAttack(0, 0)).toBe(true);
    expect(gameBoard.receiveAttack(0, 1)).toBe(true);
    expect(gameBoard.receiveAttack(0, 2)).toBe(true);
  });

  test("missed attacks", () => {
    expect(gameBoard.receiveAttack(3, 0)).toBe(true);
    expect(gameBoard.receiveAttack(0, 6)).toBe(true);
    expect(gameBoard.receiveAttack(5, 5)).toBe(true);
  });

  test("cannot attack on already attacked coordinates", () => {
    expect(gameBoard.receiveAttack(0, 0)).toBe(false);
    expect(gameBoard.receiveAttack(3, 0)).toBe(false);
    expect(gameBoard.receiveAttack(5, 5)).toBe(false);
  });
});

describe("allShipsSunk", () => {
  const gameBoard = new GameBoard();
  beforeAll(() => {
    const ship1 = new Ship(3);
    const ship2 = new Ship(4);
    gameBoard.placeShip(ship1, 0, 0, "horizontal");
    gameBoard.placeShip(ship2, 5, 5, "vertical");
  });

  test("no ships are sunk", () => {
    expect(gameBoard.allShipsSunk()).toBe(false);
  });

  test("not all ships are sunk", () => {
    gameBoard.receiveAttack(0, 0);
    gameBoard.receiveAttack(0, 1);
    gameBoard.receiveAttack(0, 2);
    expect(gameBoard.allShipsSunk()).toBe(false);
  });

  test("all ships are sunk", () => {
    gameBoard.receiveAttack(5, 5);
    gameBoard.receiveAttack(6, 5);
    gameBoard.receiveAttack(7, 5);
    gameBoard.receiveAttack(8, 5);
    expect(gameBoard.allShipsSunk()).toBe(true);
  });
});
