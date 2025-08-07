/**
 * file: falling_apples_game_logic.js
 * type: JavaScript
 * date: 06_AUGUST_2025
 * author: karbytes
 * license: PUBLIC_DOMAIN
 */

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const basketWidth = 60;
const basketHeight = 20;
let basketX;
const basketY = canvas.height - basketHeight - 10;

let apples = [];
let appleCount;
let maxApples = 100;
let score;
let gameRunning = true;

let timerInterval;
let secondsElapsed;

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

function spawnApple() {
  if (appleCount >= maxApples || !gameRunning) return;
  const x = Math.random() * (canvas.width - 20);
  apples.push({ x, y: 0 });
  appleCount++;
}

function drawBasket() {
  ctx.fillStyle = "#795548";
  ctx.fillRect(basketX, basketY, basketWidth, basketHeight);
}

function drawApples() {
  ctx.fillStyle = "red";
  apples.forEach(apple => {
    ctx.beginPath();
    ctx.arc(apple.x + 10, apple.y + 10, 10, 0, Math.PI * 2);
    ctx.fill();
  });
}

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawApples();
}

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

function gameOver() {
  gameRunning = false;
  clearInterval(timerInterval);
  alert("Game over! Your score: " + score);
  document.getElementById("restart-btn").style.display = "inline-block";
}

// Controls
document.getElementById("left-btn").addEventListener("click", () => {
  if (!gameRunning) return;
  basketX = Math.max(0, basketX - 20);
});

document.getElementById("right-btn").addEventListener("click", () => {
  if (!gameRunning) return;
  basketX = Math.min(canvas.width - basketWidth, basketX + 20);
});

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
    basketX = Math.max(0, basketX - 20);
  } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
    basketX = Math.min(canvas.width - basketWidth, basketX + 20);
  }
});

document.getElementById("restart-btn").addEventListener("click", resetGame);

// Apple spawn loop
setInterval(spawnApple, 500);

// Start initial game
resetGame();
