import GameBoard from "../classes/game-board";
import { Player, Computer } from "../classes/player";
import Ship from "../classes/ship";
import renderBoard from "./renderBoard";

// DOM elements
const infoTitle = document.querySelector(".info h2");
const infoText = document.querySelector(".info p");

const menuScreen = document.querySelector(".menu");
const gameScreen = document.querySelector(".game");

const playerNameInput = document.querySelector(".menu input");
const placementBoardDisplay = document.querySelector(".menu .board");
const randomizeBtn = document.querySelector(".menu .randomize");
const rotateBtn = document.querySelector(".menu .rotate");
const resetBtn = document.querySelector(".menu .reset");
const playBtn = document.querySelector(".menu .play");

const playerBoardDisplay = document.querySelector(".game .left .board");
const playerNameDisplay = document.querySelector(".game .left .name");

const computerBoardDisplay = document.querySelector(".game .right .board");
const computerNameDisplay = document.querySelector(".game .right .name");

const newGameBtn = document.querySelector(".new-game");
let delay = 1200;

// Game variables
const SHIP_FLEET = [
  { name: "Carrier", length: 5 },
  { name: "Battleship", length: 4 },
  { name: "Cruiser", length: 3 },
  { name: "Submarine", length: 3 },
  { name: "Destroyer", length: 2 },
];

let player, computer, playerBoard;
let placementIndex = 0;
let placementDirection = "horizontal";

export default function initializeGame() {
  // Show menu and hide game screen
  menuScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");

  // Disable play button
  playBtn.disabled = true;

  // Update info
  updateInfo(
    "Place your ships",
    `Click to place your ${SHIP_FLEET[placementIndex].name} (${SHIP_FLEET[placementIndex].length} spaces)`,
  );

  // Initialize player
  playerBoard = new GameBoard();
  player = new Player("Player", playerBoard); //initialize early to enable randomize button

  // Render placement board
  renderBoard(placementBoardDisplay, playerBoard);

  setupPlacementListeners();
}

function updateInfo(title, text) {
  if (title) infoTitle.textContent = title;
  infoText.textContent = text;
}

// Placement phase
function setupPlacementListeners() {
  placementBoardDisplay.addEventListener("mouseover", handlePlacementMouseOver);
  placementBoardDisplay.addEventListener("mouseout", handlePlacementMouseOut);
  placementBoardDisplay.addEventListener("click", handlePlacementClick);
}

function clearPlacementListeners() {
  placementBoardDisplay.removeEventListener(
    "mouseover",
    handlePlacementMouseOver,
  );
  placementBoardDisplay.removeEventListener(
    "mouseout",
    handlePlacementMouseOut,
  );
  placementBoardDisplay.removeEventListener("click", handlePlacementClick);
}

function handlePlacementMouseOver(e) {
  // Early return when no ships are left to place or cell is invalid
  if (placementIndex >= SHIP_FLEET.length || !e.target.dataset.x) return;

  const x = parseInt(e.target.dataset.x);
  const y = parseInt(e.target.dataset.y);
  const shipLength = SHIP_FLEET[placementIndex].length;
  const ship = new Ship(shipLength);
  const canPlace = playerBoard.canPlace(ship, x, y, placementDirection);

  previewShipPlacement(x, y, shipLength, canPlace);
}

function handlePlacementMouseOut() {
  clearPlacementPreview();
}

function handlePlacementClick(e) {
  // Early return when no ships are left to place or cell is invalid
  if (placementIndex >= SHIP_FLEET.length || !e.target.dataset.x) return;

  const x = parseInt(e.target.dataset.x);
  const y = parseInt(e.target.dataset.y);
  const shipLength = SHIP_FLEET[placementIndex].length;
  const ship = new Ship(shipLength);

  if (playerBoard.placeShip(ship, x, y, placementDirection)) {
    clearPlacementPreview();
    renderBoard(placementBoardDisplay, playerBoard);
    placementIndex++;
    if (placementIndex < SHIP_FLEET.length) {
      const nextShip = SHIP_FLEET[placementIndex];
      updateInfo(
        "Place your ships",
        `Click to place your ${nextShip.name} (${nextShip.length} spaces)`,
      );
    } else {
      clearPlacementListeners();
      playBtn.disabled = false;
      updateInfo("Ready to play", "Click Start Game to play");
    }
  }
}

function previewShipPlacement(x, y, shipLength, canPlace) {
  // clear previous preview
  clearPlacementPreview();
  for (let i = 0; i < shipLength; i++) {
    const currX = x + (placementDirection === "horizontal" ? i : 0);
    const currY = y + (placementDirection === "vertical" ? i : 0);
    const cell = document.querySelector(
      `.menu .board .cell[data-x="${currX}"][data-y="${currY}"]`,
    );
    if (cell) {
      cell.classList.add(canPlace ? "can-place" : "cannot-place");
    }
  }
}

function clearPlacementPreview() {
  const cells = document.querySelectorAll(".menu .board .cell");
  cells.forEach((cell) => {
    cell.classList.remove("can-place", "cannot-place");
  });
}

// Game phase

function startGame() {
  // Hide menu and show game screen
  menuScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  // Set player name
  player.name = playerNameInput.value || "Player";

  // Initialize computer
  computer = new Computer("CPU", new GameBoard());
  computer.randomizeBoard(SHIP_FLEET.map((ship) => new Ship(ship.length)));

  // Render player names and boards
  playerNameDisplay.textContent = player.name;
  renderBoard(playerBoardDisplay, player.gameBoard);

  computerNameDisplay.textContent = computer.name;
  renderBoard(computerBoardDisplay, computer.gameBoard, true);

  // Start game with player's turn
  playerTurn();
}

function handlePlayerAttack(e) {
  if (!e.target.dataset.x) return;

  const x = parseInt(e.target.dataset.x);
  const y = parseInt(e.target.dataset.y);

  const { result } = player.attack(computer, x, y);
  // Player keeps turn if attack is invalid or successful hit
  switch (result) {
    case -1:
      updateInfo("", "You already attacked this cell");
      break;
    case 0:
      updateInfo("", "You missed");
      updateInfo(
        `${computer.name}'s turn`,
        `The ${computer.name} is attacking`,
      );
      setTimeout(computerTurn, delay);
      break;
    case 1:
      updateInfo("", "You hit a ship! Attack again");
      break;
  }
  renderBoard(computerBoardDisplay, computer.gameBoard, true);

  if (computer.gameBoard.allShipsSunk()) {
    endGame(true);
  }
}

function playerTurn() {
  updateInfo("Your turn", "Click on a cell to attack");
  computerBoardDisplay.addEventListener("click", handlePlayerAttack);
}

function computerTurn() {
  computerBoardDisplay.removeEventListener("click", handlePlayerAttack);
  const { result } = computer.attack(player);
  switch (result) {
    case 0:
      updateInfo("", `The ${computer.name} missed`);
      playerTurn();
      break;
    case 1:
      updateInfo("", `The ${computer.name} hit a ship! Attack again`);
      setTimeout(computerTurn, delay);
      break;
  }
  renderBoard(playerBoardDisplay, player.gameBoard);

  if (player.gameBoard.allShipsSunk()) {
    endGame(false);
  }
}

function endGame(playerWon) {
  computerBoardDisplay.removeEventListener("click", handlePlayerAttack);
  updateInfo(
    playerWon ? `Congrats ${player.name}! You won!` : "You lost!",
    "Click New Game to play again",
  );
}

// Event listeners
playBtn.addEventListener("click", startGame);

newGameBtn.addEventListener("click", initializeGame);

rotateBtn.addEventListener("click", () => {
  placementDirection =
    placementDirection === "horizontal" ? "vertical" : "horizontal";
});

resetBtn.addEventListener("click", initializeGame);

randomizeBtn.addEventListener("click", () => {
  playerBoard.randomizeBoard(SHIP_FLEET.map((ship) => new Ship(ship.length)));
  renderBoard(placementBoardDisplay, playerBoard);
});
