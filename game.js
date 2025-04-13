const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }];
let direction = { x: 1, y: 0 };
let food = spawnFood();
let gameOver = false;
let paused = false;

function spawnFood() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function update() {
    if (gameOver) return;

    // Move snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wrap around
    head.x = (head.x + tileCount) % tileCount;
    head.y = (head.y + tileCount) % tileCount;

    // Check collision with self
    if (snake.some(part => part.x === head.x && part.y === head.y)) {
        gameOver = true;
        alert("Game Over!");
        return;
    }

    snake.unshift(head);

    // Check food
    if (head.x === food.x && head.y === food.y) {
        food = spawnFood();
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "#0f0";
    for (let part of snake) {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    }

    // Draw food
    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function loop() {
    if (!paused) {
        update();
        draw();
    }
}

setInterval(loop, 100);

document.addEventListener("keydown", e => {
    const key = e.key;

    if ((key === "ArrowUp" || key === "w") && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if ((key === "ArrowDown" || key === "s") && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if ((key === "ArrowLeft" || key === "a") && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if ((key === "ArrowRight" || key === "d") && direction.x === 0) {
        direction = { x: 1, y: 0 };
    } else if (key === " ") paused = !paused;
});