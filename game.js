const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }];
let food = spawnFood();

let dir = { x: 1, y: 0 };
let last_dir = dir;
let nextDir = dir;

let gameOver = false;
let paused = false;

let eye_radius = 4;

function spawnFood() {
    let snake_pos = new Set();
    snake.forEach(i => snake_pos.add(i));

    let avail_pos = [];
    for (let i = 0; i < tileCount; i++) {
        for (let j = 0; j < tileCount; j++) {
            if (snake_pos.has({x: j, y: i})) continue;

            avail_pos.push({x: j, y: i});
        }
    }

    return avail_pos[Math.floor(Math.random() * avail_pos.length)];
}

function update() {
    if (nextDir.x !== -last_dir.x || nextDir.y !== -last_dir.y) {
        dir = nextDir;
    }

    // Move snake
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Wrap around
    head.x = (head.x + tileCount) % tileCount;
    head.y = (head.y + tileCount) % tileCount;

    const body = snake.slice(0, -1); // exclude the tail (last segment)
    if (body.some(part => part.x === head.x && part.y === head.y)) {    
        gameOver = true;
        return;
    }

    snake.unshift(head);

    // Check food
    if (head.x === food.x && head.y === food.y) {
        food = spawnFood();
    } else {
        snake.pop();
    }

    last_dir = dir;
    console.log("gameOver", gameOver);
}

function drawText(text, color = "white", font = "bold 32px Arial") {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function drawEye(x, y, offsetX, offsetY) {
    ctx.beginPath();
    ctx.arc(x, y, eye_radius, 0, Math.PI * 2);
    ctx.fill();
}

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let p = 0; p < snake.length; p++) {
        ctx.fillStyle = "#0f0";
        ctx.fillRect(snake[p].x * gridSize, snake[p].y * gridSize, gridSize, gridSize);

        // Draw head with eyes
        if (p === 0) {
            ctx.fillStyle = "#0ff";

            // Offsets perpendicular to direction for spacing eyes
            let perpX = -last_dir.y;
            let perpY = last_dir.x;

            // Center of the tile
            let centerX = snake[p].x * gridSize + gridSize / 2;
            let centerY = snake[p].y * gridSize + gridSize / 2;

            // Offset eyes slightly in the direction the snake is moving
            let eyeDistance = 4;
            let forwardOffset = 4;

            drawEye(centerX + perpX * eyeDistance + last_dir.x * forwardOffset, centerY + perpY * eyeDistance + last_dir.y * forwardOffset);
            drawEye(centerX - perpX * eyeDistance + last_dir.x * forwardOffset, centerY - perpY * eyeDistance + last_dir.y * forwardOffset);
        }
    }

    // Draw food
    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function loop() {
    if (gameOver) {
        drawText("Game over!");
        return;
    } else if (paused && !gameOver) {
        console.log("paused");
        drawText("Paused");
    } else {
        update()
        draw()
    }
}

setInterval(loop, 100);

document.addEventListener("keydown", e => {
    const key = e.key;
    if ((key === "ArrowUp" || key === "w") && last_dir.y === 0) {
        nextDir = { x: 0, y: -1 };
    } else if ((key === "ArrowDown" || key === "s") && last_dir.y === 0) {
        nextDir = { x: 0, y: 1 };
    } else if ((key === "ArrowLeft" || key === "a") && last_dir.x === 0) {
        nextDir = { x: -1, y: 0 };
    } else if ((key === "ArrowRight" || key === "d") && last_dir.x === 0) {
        nextDir = { x: 1, y: 0 };
    } else if (key === " ") {
        paused = !paused;
    }
});

document.getElementById("upBtn").addEventListener("click", () => {
    if (last_dir.y === 0) nextDir = { x: 0, y: -1 };
});
document.getElementById("downBtn").addEventListener("click", () => {
    if (last_dir.y === 0) nextDir = { x: 0, y: 1 };
});
document.getElementById("leftBtn").addEventListener("click", () => {
    if (last_dir.x === 0) nextDir = { x: -1, y: 0 };
});
document.getElementById("rightBtn").addEventListener("click", () => {
    if (last_dir.x === 0) nextDir = { x: 1, y: 0 };
});
document.getElementById("pauseBtn").addEventListener("click", () => {
    paused = !paused;
});