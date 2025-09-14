// Pong Game Logic

const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12, PADDLE_HEIGHT = 90;
const BALL_SIZE = 14;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = BALL_SPEED * (Math.random() * 2 - 1);
let animationId;

// Draw functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}
function drawNet() {
  for (let y = 0; y < canvas.height; y += 32) {
    drawRect(canvas.width / 2 - 1, y, 2, 18, "#fff");
  }
}

function render() {
  // Clear
  drawRect(0, 0, canvas.width, canvas.height, "#232a36");
  // Net
  drawNet();
  // Player Paddle
  drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#5eead4");
  // AI Paddle
  drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#facc15");
  // Ball
  drawCircle(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE/2, "#fff");
}

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(evt) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = evt.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp paddle within bounds
  if (playerY < 0) playerY = 0;
  if (playerY + PADDLE_HEIGHT > canvas.height) playerY = canvas.height - PADDLE_HEIGHT;
});

// AI paddle movement
function moveAI() {
  const aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - 12) {
    aiY += PADDLE_SPEED;
  } else if (aiCenter > ballY + BALL_SIZE / 2 + 12) {
    aiY -= PADDLE_SPEED;
  }
  // Clamp
  if (aiY < 0) aiY = 0;
  if (aiY + PADDLE_HEIGHT > canvas.height) aiY = canvas.height - PADDLE_HEIGHT;
}

// Ball movement and collision
function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top and bottom wall collision
  if (ballY <= 0) {
    ballY = 0;
    ballSpeedY = -ballSpeedY;
  }
  if (ballY + BALL_SIZE >= canvas.height) {
    ballY = canvas.height - BALL_SIZE;
    ballSpeedY = -ballSpeedY;
  }

  // Left paddle collision
  if (
    ballX <= PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE >= playerY &&
    ballY <= playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH; // Prevent sticking
    ballSpeedX = -ballSpeedX;
    // Add a little randomness to Y speed
    let hitPoint = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
    ballSpeedY = hitPoint * 0.25;
  }

  // Right paddle collision (AI)
  if (
    ballX + BALL_SIZE >= AI_X &&
    ballY + BALL_SIZE >= aiY &&
    ballY <= aiY + PADDLE_HEIGHT
  ) {
    ballX = AI_X - BALL_SIZE;
    ballSpeedX = -ballSpeedX;
    // Add a little randomness to Y speed
    let hitPoint = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
    ballSpeedY = hitPoint * 0.25;
  }

  // Left or right wall (reset ball)
  if (ballX < 0 || ballX > canvas.width) {
    resetBall();
  }
}

function resetBall() {
  ballX = canvas.width / 2 - BALL_SIZE / 2;
  ballY = canvas.height / 2 - BALL_SIZE / 2;
  // Randomize direction
  ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Main game loop
function gameLoop() {
  moveAI();
  moveBall();
  render();
  animationId = requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();