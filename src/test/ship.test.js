import Ship from "../modules/ship.js";
let shipObj;
beforeEach(() => {
  shipObj = new Ship(3);
});

test("ship is initialized", () => {
  expect(shipObj.length).toBe(3);
});

test("ship is sunk", () => {
  shipObj.hit();
  shipObj.hit();
  shipObj.hit();
  expect(shipObj.isSunk()).toBe(true);
});

test("ship is not sunk", () => {
  shipObj.hit();
  shipObj.hit();
  expect(shipObj.isSunk()).toBe(false);
});
