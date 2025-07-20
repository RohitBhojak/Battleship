import Ship from "../modules/ship.js";

test("ship is initialized", () => {
  const shipObj = new Ship(3);
  expect(shipObj).toBeTruthy();
});

test("ship length cannot be smaller than 1", () => {
  expect(() => new Ship(0)).toThrow();
});

test("ship is sunk", () => {
  const shipObj = new Ship(3);
  shipObj.hit();
  shipObj.hit();
  shipObj.hit();
  expect(shipObj.isSunk()).toBe(true);
});

test("ship is not sunk", () => {
  const shipObj = new Ship(3);
  shipObj.hit();
  shipObj.hit();
  expect(shipObj.isSunk()).toBe(false);
});
