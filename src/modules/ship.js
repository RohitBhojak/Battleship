export default class Ship {
  #hitCount;
  constructor(length) {
    this.length = length;
    this.#hitCount = 0;
  }

  hit() {
    this.#hitCount++;
  }

  isSunk() {
    return this.#hitCount === this.length;
  }
}
