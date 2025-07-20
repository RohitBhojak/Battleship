import GameBoard from "../modules/game-board.js";
import Ship from "../modules/ship.js";

let gameBoard;
beforeAll(() => {
  gameBoard = new GameBoard();
});

test("10x10 game board is initialized", () => {
  expect(gameBoard.board.length).toBe(10);
  expect(gameBoard.board[0].length).toBe(10);
});

describe("placeShip", () => {
  let shipObj;
  beforeEach(() => {
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

  test("ship cannot be placed out of bounds", () => {
    gameBoard.placeShip(shipObj, 0, 0, "horizontal");
    expect(gameBoard.placeShip(shipObj, 2, 9, "horizontal")).toBe(false);
  });

  test("ship cannot be placed out of bounds", () => {
    gameBoard.placeShip(shipObj, 0, 0, "horizontal");
    expect(gameBoard.placeShip(shipObj, 9, 2, "vertical")).toBe(false);
  });
});
