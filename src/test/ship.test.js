import Ship from "../modules/ship.js";

test("ship is initialized", () => {
  const shipObj = new Ship(3);
  expect(shipObj.length).toBe(3);
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
