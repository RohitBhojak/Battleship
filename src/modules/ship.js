export default class Ship {
  #length;
  #hitCount;
  constructor(length) {
    if (length <= 0) {
      throw new Error("Length must be greater than 0");
    }
    this.#length = length;
    this.#hitCount = 0;
  }

  hit() {
    this.#hitCount++;
  }

  isSunk() {
    return this.#hitCount === this.#length;
  }
}
