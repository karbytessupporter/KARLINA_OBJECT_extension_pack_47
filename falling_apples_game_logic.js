/**
 * file: falling_apples_game_logic.js
 * type: JavaScript
 * date: 06_AUGUST_2025
 * author: karbytes
 * license: PUBLIC_DOMAIN
 */

// Global Variables 

/**
 * The following two statements retrieve a reference to the HTML canvas element
 * with the ID "game-canvas" and assign it to the constant variable canvas,
 * and then retrieve that canvas element’s 2D rendering context and assign it
 * to the constant variable ctx. 
 * 
 * The ctx object provides the methods used to draw the graphical components 
 * of the Falling Apples Game (e.g., basket and apples).
 */
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

/**
 * The following variable declarations define the size and initial placement
 * of the rectangular basket used to catch falling apples in the game interface.
 * 
 * basketWidth and basketHeight specify the dimensions of the basket in pixels.
 * 
 * basketX represents the current horizontal position of the basket’s top-left corner
 * and will be initialized at runtime (e.g., in resetGame).
 * 
 * basketY is statically calculated such that the basket appears near the bottom
 * edge of the canvas with a 10-pixel margin between the basket and the canvas boundary.
 */
const basketWidth = 60;
const basketHeight = 20;
let basketX;
const basketY = canvas.height - basketHeight - 10;

/**
 * The following variable declarations define the state of the falling apples game
 * in terms of apple generation, scorekeeping, and game control.
 * 
 * apples is a list which stores the currently active apple objects,
 * each of which has an x and y coordinate.
 * 
 * appleCount tracks how many apples have been spawned since the game began.
 * 
 * maxApples defines the maximum number of apples that will fall during one game session.
 * 
 * score records how many apples the player has successfully caught in the basket.
 * 
 * gameRunning is a Boolean flag indicating whether the game is currently active.
 */
let apples = [];
let appleCount;
let maxApples = 100;
let score;
let gameRunning = true;

/**
 * The following variable declarations support the game session timer functionality.
 * 
 * timerInterval stores the identifier returned by the setInterval function,
 * which is used to increment and display the elapsed game time at one-second intervals.
 * 
 * secondsElapsed keeps track of the total number of seconds that have passed
 * since the current game session began.
 */
let timerInterval;
let secondsElapsed;

// Functions

/**
 * This function (resetGame) reinitializes the global variables and HTML elements
 * associated with the Falling Apples Game interface to their respective default
 * values such that a new game session can be started from a blank slate.
 * 
 * The apple list is cleared, the score and timer are reset to 0, and the basket
 * is repositioned to the horizontal center of the canvas.
 * 
 * The apple falling animation loop and game timer loop are both (re)started.
 */
function resetGame() {
  apples = [];
  basketX = (canvas.width - basketWidth) / 2;
  appleCount = 0;
  score = 0;
  secondsElapsed = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = secondsElapsed;
  document.getElementById("restart-btn").style.display = "none";
  gameRunning = true;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsElapsed++;
    document.getElementById("timer").textContent = secondsElapsed;
  }, 1000);
  gameLoop();
}

/**
 * This function (spawnApple) appends a newly generated apple object
 * to the global apples list provided that the total number of apples
 * generated so far is less than the maximum allowed and the game is
 * currently running. 
 * 
 * Each apple object has an x-coordinate randomly selected from a range 
 * of integers which ensures that the apple will appear fully within the 
 * bounds of the canvas when drawn, and its y-coordinate is
 * initialized to zero (the top edge of the canvas).
 */
function spawnApple() {
  if (appleCount >= maxApples || !gameRunning) return;
  const x = Math.random() * (canvas.width - 20);
  apples.push({ x, y: 0 });
  appleCount++;
}

/**
 * This function (drawBasket) draws a solid rectangle on the canvas using
 * the fill color #795548 (a brown hue) to visually represent the basket.
 * 
 * The basket is rendered at the current basketX and basketY coordinates
 * and is assigned the dimensions specified by the basketWidth and basketHeight
 * global variables. 
 * 
 * This function is typically called once per animation frame
 * to render the most current basket position during gameplay.
 */
function drawBasket() {
  ctx.fillStyle = "#795548";
  ctx.fillRect(basketX, basketY, basketWidth, basketHeight);
}

/**
 * This function (drawApples) renders each apple in the global apples list
 * as a red circle on the canvas. Each circle has a radius of 10 pixels and is
 * centered slightly offset from the apple object's x and y coordinates to account
 * for its radius (so that the circle is visually aligned with the intended position).
 * 
 * The canvas context's fill style is set to red prior to drawing the apples, and
 * each apple is drawn using the arc and fill methods within a new path.
 */
function drawApples() {
  ctx.fillStyle = "red";
  apples.forEach(apple => {
    ctx.beginPath();
    ctx.arc(apple.x + 10, apple.y + 10, 10, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * This function (updateApples) updates the vertical positions of all apples
 * in the global apples list and checks whether each apple has either been caught
 * by the basket or has fallen beyond the bottom edge of the canvas.

 * Each apple's y-coordinate is incremented by 3 pixels to simulate downward motion.
 * If an apple's position intersects with the current position of the basket,
 * that apple is removed from the list and the player's score is incremented by 1.

 * If an apple falls below the visible canvas area without being caught,
 * it is also removed from the list (but the score remains unchanged).
 */
function updateApples() {
  for (let i = apples.length - 1; i >= 0; i--) {
    const apple = apples[i];
    apple.y += 3;
    if (
      apple.y + 20 >= basketY &&
      apple.x + 10 >= basketX &&
      apple.x + 10 <= basketX + basketWidth
    ) {
      apples.splice(i, 1);
      score++;
      document.getElementById("score").textContent = score;
    } else if (apple.y > canvas.height) {
      apples.splice(i, 1); // Missed
    }
  }
}

/*
 * This function (draw) refreshes the entire canvas by first clearing its
 * current contents and then redrawing both the basket and all currently
 * falling apples in their latest positions. 
 *
 * This function is intended to be called once per animation frame to 
 * visually reflect the current game state.
 *
 * The canvas is cleared using clearRect, and the subsequent drawing functions
 * (drawBasket and drawApples) handle rendering the appropriate game elements.
 */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawApples();
}

/**
 * This function (gameLoop) is the primary animation loop for the Falling Apples Game.
 * 
 * It repeatedly updates the game state and redraws the canvas as long as the game is active.
 * 
 * If the gameRunning flag is true, the function updates apple positions and re-renders the scene.
 * 
 * If fewer than maxApples apples have been spawned or if there are still apples falling,
 * the loop schedules itself to run again on the next animation frame.
 * 
 * Once all apples have either been caught or missed, the game ends and gameOver() is invoked.
 */
function gameLoop() {
  if (!gameRunning) return;

  updateApples();
  draw();

  if (appleCount < maxApples || apples.length > 0) {
    requestAnimationFrame(gameLoop);
  } else {
    gameOver();
  }
}

/**
 * This function (gameOver) halts all ongoing game activity and signals the end
 * of the current Falling Apples Game session. 
 * 
 * The gameRunning flag is set to false to prevent further updates or user input 
 * from affecting the game state.
 * 
 * The game timer interval is cleared to stop time tracking.
 * 
 * A browser alert displays the final score to the player,
 * and the restart button is made visible to allow the player to initiate a new game.
 */
function gameOver() {
  gameRunning = false;
  clearInterval(timerInterval);
  alert("Game over! Your score: " + score);
  document.getElementById("restart-btn").style.display = "inline-block";
}

// Game Controls

/*
 * This event listener triggers when the HTML button element with the ID "left-btn"
 * is clicked. 
 * 
 * If the game is currently active (i.e., gameRunning is true),
 * the basket's horizontal position is updated to move 20 pixels to the left.
 * 
 * The Math.max function ensures that the basket does not move past the left edge
 * of the canvas (i.e., basketX is never less than 0).
 */
document.getElementById("left-btn").addEventListener("click", () => {
  if (!gameRunning) return;
  basketX = Math.max(0, basketX - 20);
});

/**
 * This event listener triggers when the HTML button element with the ID "right-btn"
 * is clicked. 
 * 
 * If the game is currently active (i.e., gameRunning is true),
 * the basket's horizontal position is updated to move 20 pixels to the right.
 * 
 * The Math.min function ensures that the basket does not move past the right edge
 * of the canvas (i.e., basketX is never greater than canvas.width minus basketWidth).
 */
document.getElementById("right-btn").addEventListener("click", () => {
  if (!gameRunning) return;
  basketX = Math.min(canvas.width - basketWidth, basketX + 20);
});

/**
 * This event listener triggers whenever a key is pressed while the document is in focus.
 * 
 * If the game is currently active (i.e., gameRunning is true), the basket is moved
 * horizontally in response to the following key inputs:
 * 
 * Pressing either the left arrow key or the "A" key (case-insensitive)
 * moves the basket 20 pixels to the left (bounded by the left edge of the canvas),
 * while pressing either the right arrow key or the "D" key moves the basket 20 pixels
 * to the right (bounded by the right edge of the canvas).
 */
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
    basketX = Math.max(0, basketX - 20);
  } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
    basketX = Math.min(canvas.width - basketWidth, basketX + 20);
  }
});

/**
 * This event listener triggers when the HTML button element with the ID "restart-btn"
 * is clicked. 
 * 
 * When activated, it calls the resetGame function, which reinitializes
 * all game state variables and interface elements to their default values
 * and starts a new game session from a blank slate.
 * 
 * This allows the player to immediately begin another round after the previous one ends.
 */
document.getElementById("restart-btn").addEventListener("click", resetGame);

// Apple spawn loop
setInterval(spawnApple, 500);

// Start initial game
resetGame();
