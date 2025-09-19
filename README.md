# [Battleship: A Classic Naval Combat Game](https://rohitbhojak.github.io/Battleship/)

A modern, web-based implementation of the classic Battleship board game, built with vanilla JavaScript, HTML, and CSS. This project focuses on clean code architecture, a robust game controller, and a challenging AI opponent that provides a compelling single-player experience.

[Play Battleship](https://rohitbhojak.github.io/Battleship/)

## Features

- **Interactive Ship Placement**: Manually place your fleet on the board using a simple and intuitive click-to-place system. See a live preview of your ship's position and get instant feedback on valid placements.

- **Randomize Fleet**: Don't want to place ships manually? Use the "Randomize" button to instantly generate a valid, random layout for your fleet.

- **Classic Turn-Based Gameplay**: Engage in a turn-based battle, calling out coordinates to fire upon the enemy's grid.

- **Dynamic UI**: The game provides clear visual feedback for hits, misses, and sunk ships, with a clean and responsive user interface.

## Robust AI Opponent

The single-player mode features a challenging AI that does not simply guess randomly. It employs a two-phase strategy to hunt and destroy the player's fleet with maximum efficiency.

### 1. The "Hunt" Phase: Strategic Searching

The AI's initial search is not random. It uses a **checkerboard (or parity) hunting pattern** to guarantee it finds every ship on the board by attacking, at most, half of the cells. Since the smallest ship is two cells long, it is guaranteed to lie on at least one square of the checkerboard pattern. This makes the hunt phase incredibly efficient.

### 2. The "Target" Phase: Logical Destruction

Once the AI scores a hit, it immediately switches to a "Target" mode.

- **Establishes Direction**: After a second hit, the AI determines the ship's orientation (horizontal or vertical) and creates a focused attack plan.

- **Line Attack**: It aggressively attacks along the confirmed axis until it misses.

- **Intelligent Recovery**: The AI has a robust memory.
  - If it hits the end of a ship and gets a "miss", it will intelligently reverse its line of attack from the initial hits.

  - If it is tricked by two adjacent ships and its attack line fails, it will re-evaluate all known hits and form a new hypothesis rather than giving up and returning to a random hunt. This makes it resilient to common player strategies.

## How to Play

1. **Place Your Ships**:
   - Click on your board to place the currently selected ship.

   - Use the "Rotate" button to change the ship's orientation.

   - Use the "Randomize" button for an instant fleet layout.

   - Once all ships are placed, click "Start Game".

2. **Engage in Combat**:
   - Click on a cell on the enemy's grid to fire a missile.

   - A red marker indicates a "hit," and a white marker indicates a "miss."

   - Sink all five of the enemy's ships to win the game!

## Project Structure

This project is built using vanilla JavaScript and follows a modular structure to separate concerns, making the code clean and maintainable.

- `main.js`: The main game controller, responsible for managing the game state, player turns, and high-level logic.

- `player.js`: Contains the `Player` and `Computer` classes, including the advanced AI logic.

- `game-board.js`: The `GameBoard` class, which manages the state of the grid, ship placements, and attacks.

- `ship.js`: A simple `Ship` class to track its length and hits.

## Built With

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
