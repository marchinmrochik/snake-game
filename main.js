const snakeCanvas = document.getElementById("snake");
const snakeCanvasContext = snakeCanvas.getContext("2d");

let snake = [
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200}
];

const foodBorder = 'darkgreen';
const foodBackground = 'red';
const boardBorder = 'black';
const boardBackground = "white";
const snakeCol = 'gray';
const snakeBorder = 'black';

let score = 0;
let changingDirection = false;
let foodX;
let foodY;
let dx = 10;
let dy = 0;

main();

genFood();

document.addEventListener("keydown", changeDirection)

function main() {
    if (gameOver()) return;

    changingDirection = false;

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, 100)
}

function clearCanvas() {
    snakeCanvasContext.fillStyle = boardBackground;
    snakeCanvasContext.strokeStyle = boardBorder;
    snakeCanvasContext.fillRect(0,0, snakeCanvas.width, snakeCanvas.height);
    snakeCanvasContext.strokeRect(0,0, snakeCanvas.width, snakeCanvas.height);
}

function drawSnakePart(snakePart) {
    snakeCanvasContext.fillStyle = snakeCol;
    snakeCanvasContext.strokeStyle = snakeBorder;
    snakeCanvasContext.fillRect(snakePart.x, snakePart.y, 10, 10);
    snakeCanvasContext.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    snake.forEach(drawSnakePart)
}

function drawFood() {
    snakeCanvasContext.fillStyle = foodBackground;
    snakeCanvasContext.strokestyle = foodBorder;
    snakeCanvasContext.fillRect(foodX, foodY, 10, 10);
    snakeCanvasContext.strokeRect(foodX, foodY, 10, 10);
}

function randomFood(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function genFood() {
    foodX = randomFood(0, snakeCanvas.width - 10);
    foodY= randomFood(0, snakeCanvas.height - 10);
    snake.forEach(function has_snake_eaten_food(part) {
        const hasEaten = part.x === foodX && part.y === foodY;
        if (hasEaten) genFood();
    });
}

function moveSnake() {
    const headSnake = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    snake.unshift(headSnake);

    const has_eaten_food = snake[0].x === foodX && snake[0].y === foodY;

    if (has_eaten_food) {
        score += 1;
        document.getElementById('score').innerHTML = score;
        genFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function gameOver() {
    for (let i = 4; i < snake.length; i++) {
        const has_collided = snake[i].x === snake[0].x && snake[i].y === snake[0].y
        if (has_collided) return true
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeCanvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeCanvas.height - 10;

    return hitLeftWall ||  hitRightWall || hitTopWall || hitBottomWall
}