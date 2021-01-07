// -------------------- DEFINITION OF CONSTANTS --------------------

const HEIGHT = 30; // number of vertical squares
const WIDTH = 30; // number of horizontal squares
const SQUARE_SIZE = 20; // square size in pixels
const INIT_LENGTH = 3; // number of snake squares at game start
const INIT_SPEED = 250; // pause between snake movement in ms at game start
const SPEED_MULT = 0.95; // speed decrease multiplier after eating apple
const APPLE_PTS = 1; // number of points per apple eaten
const APPLE_MULT = 10; // apple appearance time multiplier
const DIRECTIONS = [1, -1, WIDTH, -WIDTH];

const ROUND_NUM = 3; // number of wins needed for victory
const SCORE_DIFF = 5; // score difference needed to win round

const gameArea = document.querySelector('.game-board'); // '.game_board' div
const squares = []; // array of '.square' divs (filled via createGrid function)

const redScoreboard = document.querySelector('#red-score'); // '#red-score' span
const blueScoreboard = document.querySelector('#blue-score'); // '#blue-score' span
const redWinboard = document.querySelector('#red-won'); // '#red-won' span
const blueWinboard = document.querySelector('#blue-won'); // '#red-won' span
const topScoreboard = document.querySelector('#top-score'); // '#top-score' span
const roundNum = document.querySelector('#round-num'); // '#round-num' span
roundNum.textContent = ROUND_NUM.toString();
const scoreDiff = document.querySelector('#score-diff'); // '#score-diff' span
scoreDiff.textContent = SCORE_DIFF.toString();


// -------------------- FUNCTION DEFENITIONS --------------------

// Function adds height and width properties to square class in CSS stylesheet
function updateStylesheet() {
  const stylesheet = document.createElement('style');
  stylesheet.textContent = ".square { height: " + SQUARE_SIZE.toString() + "px; }";
  stylesheet.textContent = ".square { width: " + SQUARE_SIZE.toString() + "px; }";
  document.body.append(stylesheet);
}

// Function creates HTML grid of divs with square class
function createGrid() {
  gameArea.style.height = (HEIGHT * SQUARE_SIZE).toString() + "px";
  gameArea.style.width = (WIDTH * SQUARE_SIZE).toString() + "px";
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      const square = document.createElement('div');
      square.classList.add('square');
      gameArea.append(square);
      squares.push(square);
    }
  }
}

// Function creates snake array
function createSnake(head, direction) {
  let snakeArray = [head];
  for (let i = 1; i < INIT_LENGTH; i++) {
    snakeArray.push(head - i * direction);
  }
  return snakeArray;
}

// Function returns random direction
function getRandomDirection() {
  return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
}

// Function return random game area location
function getRandomLocation() {
  return Math.floor(Math.random() * HEIGHT * WIDTH);
}

// Function places new apple
function placeNewApple() {
  let location;
  do {
    location = getRandomLocation();
  } while (squares[location].classList.contains('red-snake') || squares[location].classList.contains('blue-snake') || squares[location].classList.contains('apple'));
  apples.unshift(location);
  squares[apples[0]].classList.add('apple');
}

// Function resets game state
function resetGame() {
  if (gameOver) {
    redWins = 0;
    blueWins = 0;
    redWinboard.textContent = redWins.toString();
    blueWinboard.textContent = blueWins.toString();
  }
  gameOver = false;
  clearInterval(moveTimerId);
  clearInterval(appleTimerId);
  if (redSnake) {
    redSnake.forEach(index => squares[index].classList.remove('red-snake'));
  }
  if (blueSnake) {
    blueSnake.forEach(index => squares[index].classList.remove('blue-snake'));
  }
  if (apples) {
    apples.forEach(index => squares[index].classList.remove('apple'));
  }
  gameArea.style.border = "solid 20px burlywood";
  redDirection = getRandomDirection();
  blueDirection = getRandomDirection();
  const blueHead = Math.floor(HEIGHT / 3 * WIDTH - WIDTH / 1.5 - 1);
  const redHead = Math.ceil(HEIGHT / 1.5 * WIDTH + WIDTH / 1.5);
  blueSnake = createSnake(blueHead, blueDirection);
  redSnake = createSnake(redHead, redDirection);
  speed = INIT_SPEED;
  blueScore = 0;
  redScore = 0;
  blueScoreboard.textContent = blueScore.toString();
  redScoreboard.textContent = redScore.toString();
  blueSnake.forEach(index => squares[index].classList.add('blue-snake'));
  redSnake.forEach(index => squares[index].classList.add('red-snake'));
  apples = [];
  moveTimerId = setInterval(moveSnakes, speed);
  appleTimerId = setInterval(placeNewApple, speed * APPLE_MULT);
}

// Function returns true if snake hits wall
function hasCollidedWithWall(location, direction) {
  if (location < 0 || location >= WIDTH * HEIGHT || location % WIDTH === 0 && direction === 1 || location % WIDTH === WIDTH - 1 && direction === -1)
  {
    return true;
  }
  return false;
}

// Function returns true if snake hits itself or opponent
function hasCollidedWithSnake(location1, location2) {
  if (squares[location1].classList.contains('blue-snake') || squares[location1].classList.contains('red-snake') || location1 === location2)
  {
    return true;
  }
  return false;
}

// Function moves snake and checks for collisions and apple
function moveSnakes() {

  const newBlueLocation = blueSnake[0] + blueDirection;
  const newRedLocation = redSnake[0] + redDirection;
  let blueLoss = false;
  let redLoss = false;

  if (hasCollidedWithWall(newBlueLocation, blueDirection) || hasCollidedWithSnake(newBlueLocation, newRedLocation) || redScore >= blueScore + SCORE_DIFF)
    blueLoss = true;

  if (hasCollidedWithWall(newRedLocation, redDirection) || hasCollidedWithSnake(newRedLocation, newBlueLocation) || blueScore >= redScore + SCORE_DIFF)
    redLoss = true;

  if (blueLoss || redLoss) {
    clearInterval(moveTimerId);
    clearInterval(appleTimerId);
    if (blueLoss && redLoss)
      setTimeout(function() { alert("It's a tie!"); }, 10);
    else if (blueLoss) {
      gameArea.style.border = "solid 20px indianred";
      redWins++;
      redWinboard.textContent = redWins.toString();
      if (redWins < ROUND_NUM)
        setTimeout(function() { alert("Red player wins this round!"); }, 200);
    } else {
      gameArea.style.border = "solid 20px blue";
      blueWins++;
      blueWinboard.textContent = blueWins.toString();
      if (blueWins < ROUND_NUM)
        setTimeout(function() { alert("Blue player wins this round!"); }, 200);
    }

    if (blueScore > topScore)
      topScore = blueScore;
    else if (redScore > topScore)
      topScore = redScore;
    topScoreboard.textContent = topScore.toString();

    if (blueWins === ROUND_NUM) {
      gameOver = true;
      setTimeout(function() { alert("Blue player wins the game!"); }, 200);
    } else if (redWins === ROUND_NUM) {
      gameOver = true;
      setTimeout(function() { alert("Red player wins the game!"); }, 200);
    }
  }

  else {
    squares[newBlueLocation].classList.add('blue-snake');
    squares[newRedLocation].classList.add('red-snake');
    blueSnake.unshift(newBlueLocation);
    redSnake.unshift(newRedLocation);

    if (!(squares[newBlueLocation].classList.contains('apple'))) {
      const blueTail = blueSnake.pop();
      squares[blueTail].classList.remove('blue-snake');
    }
    else {
      blueScore += APPLE_PTS;
      blueScoreboard.textContent = blueScore.toString();
      apples.splice(apples.indexOf(newBlueLocation), 1);
      squares[newBlueLocation].classList.remove('apple');
      speed = Math.floor(speed * SPEED_MULT);
      clearInterval(moveTimerId);
      moveTimerId = setInterval(moveSnakes, speed);
    }

    if (!(squares[newRedLocation].classList.contains('apple'))) {
      const redTail = redSnake.pop();
      squares[redTail].classList.remove('red-snake');
    }
    else {
      redScore += APPLE_PTS;
      redScoreboard.textContent = redScore.toString();
      apples.splice(apples.indexOf(newRedLocation), 1);
      squares[newRedLocation].classList.remove('apple');
      speed = Math.floor(speed * SPEED_MULT);
      clearInterval(moveTimerId);
      moveTimerId = setInterval(moveSnakes, speed);
    }
  }
}

// Function deals with keypresses
function control(e) {
  if (e.keyCode === 39 && blueSnake[0] != blueSnake[1] - 1) {
    blueDirection = 1;
  } else if (e.keyCode === 40 && blueSnake[0] != blueSnake[1] - WIDTH) {
    blueDirection = WIDTH;
  } else if (e.keyCode === 37 && blueSnake[0] != blueSnake[1] + 1) {
    blueDirection = -1;
  } else if (e.keyCode === 38 && blueSnake[0] != blueSnake[1] + WIDTH) {
    blueDirection = -WIDTH;
  } else if (e.keyCode === 68 && redSnake[0] != redSnake[1] - 1) {
    redDirection = 1;
  } else if (e.keyCode === 83 && redSnake[0] != redSnake[1] - WIDTH) {
    redDirection = WIDTH;
  } else if (e.keyCode === 65 && redSnake[0] != redSnake[1] + 1) {
    redDirection = -1;
  } else if (e.keyCode === 87 && redSnake[0] != redSnake[1] + WIDTH) {
    redDirection = -WIDTH;
  }
}

// -------------------- DECLARATION OF VARIABLES --------------------

// 1 = right, -1 = left, WIDTH = down, -WIDTH = up
let blueDirection;
let redDirection;

// arrays of snake locations
let blueSnake;
let redSnake;

// scores
let blueScore;
let redScore;

// wins
let blueWins = 0;
let redWins = 0;

let topScore = 0; // top score
let apples; // array of apple locations
let speed; // snakes' current speed

let moveTimerId = null; // timer ID for movement setInterval function
let appleTimerId = null; // timer ID for apple appearance setInterval function

let gameOver = false; // true if game results must be shown, otherwise false

// -------------------- GAME START --------------------

updateStylesheet();
createGrid();
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', resetGame);
document.addEventListener('keydown', control);
