// the canvas where the game is painted
const canvas = document.getElementById("breakout");
canvas.classList.add('no-cursor');
const pen = canvas.getContext("2d");
pen.lineJoin = 'round';

const BALL_SPEED = 5;
const BALL_SIZE = 12;
const BLOCK_ROW_COUNT = 6;
const BLOCK_COLUMN_COUNT = 5 ;

let blocks = [];
let blockState = new Array(BLOCK_ROW_COUNT*BLOCK_COLUMN_COUNT);


// background images


const background = document.createElement('img');
background.src = 'images/sunset.jpg';
const storm = document.createElement('img');
storm.src = 'images/storm.jpg';
const paddle = document.createElement('img');
paddle.src = 'images/paddle.png';


// our game data


const game = {
  leftDown: false,
  rightDown: false,
  state: 'starting',
  touchStart: 0,
  hasTouch: false
}

const box = {
  width:  canvas.width/6,
  x: canvas.width/2-canvas.width/20,
  height: canvas.width/6/4,
  y: canvas.height-15,
  speed: 7
}

const ball = {
  speed: BALL_SPEED,
  x: 250,
  size: BALL_SIZE,
  y: canvas.height-15-box.height,
  moveX: BALL_SPEED,
  moveY: -BALL_SPEED,
}


// our main game loop


function paintgame() {
  paintBackground();
  paintBall(ball);
  paintPadle(box);
	blocks.forEach(paintBlock);

  if (game.state==='starting') {
    moveBallAlongWithBox(ball);
		blockState.fill(true, 0, blockState.length);
  }
  else if (game.state==='running') {
    moveBall(ball);
    checkEdgeHit(ball);
    checkBallHitsPadle(ball);
		checkBallHitsBlocks(ball,blocks);
    checkCrashed(ball);
  }

  if (game.leftDown===true) {
    moveBoxLeft(box);
  }
  if (game.rightDown===true) {
    moveBoxRight(box);
  }

  window.requestAnimationFrame(paintgame);
}


// game paint code


function paintBackground() {
  if (game.state==='crashed') {
    pen.drawImage(storm,0, 0, canvas.width, canvas.height);
  }
  else {
    pen.drawImage(background, 0, 0, canvas.width, canvas.height);
  }
}


function clear() {
  pen.fillStyle = 'white';
  pen.fillRect(0, 0, canvas.width, canvas.height);
}


function paintBall(ball) {
  pen.beginPath();
  pen.fillStyle='red';
  pen.arc(ball.x, ball.y, ball.size, 0, 2 * Math.PI);
  pen.fill();
}


function paintPadle(box) {
	// paintBox(box);
	pen.drawImage(paddle, box.x, box.y, box.width, box.height);
}

function paintBox(box, color, offset = 0) {
  pen.beginPath();
  pen.fillStyle = color || 'blue';
  pen.rect(box.x + offset, box.y + offset, box.width, box.height);
  pen.fill();
}


function paintBlock(block) {
	if (blockState[block.index]) {
		paintBox(block, 'rgba(0,0,0,0.2)', 3);
		paintBox(block, block.color);
	}
}


// game animation code


function moveBallAlongWithBox(ball) {
  ball.x=box.x+box.width/2;
}


function moveBall(ball) {
  ball.x = ball.x + ball.moveX;
  ball.y = ball.y + ball.moveY;
}


function moveBoxLeft(box) {
  box.x=box.x-box.speed;
  if (box.x<0) {
    box.x=0;
  }
}


function moveBoxRight(box) {
  box.x = box.x + box.speed;
  if (box.x > canvas.width-box.width) {
    box.x = canvas.width-box.width;
  }
}


// event handling code


document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  if (keyName==='ArrowRight') {
    game.rightDown=true;
  }
  if (keyName==='ArrowLeft') {
    game.leftDown=true;
  }
  if (event.code==='Space') {
    game.state='running';
  }
});


document.addEventListener('keyup', (event) => {
  const keyName = event.key;
  if (keyName==='ArrowRight') {
    game.rightDown=false;
  }
  if (keyName==='ArrowLeft') {
    game.leftDown=false;
  }
});


canvas.addEventListener('mousemove', event => {
  if (!game.hasTouch) {
    box.x = event.offsetX - box.width/2;
  }
});

canvas.addEventListener("touchstart", event => {
  game.touchStart = event.touches[0].clientX;
  game.hasTouch = true;
});

canvas.addEventListener("touchmove", event => {
  const x = event.touches[0].clientX;
  const move = x - game.touchStart;
  box.x += move;
  game.touchStart = x;
} ,false);


canvas.addEventListener('click', ()=> {
  game.state='running';
});


// resize the canvas to the window size
window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
	pen.canvas.width = document.documentElement.clientWidth;
	pen.canvas.height = document.documentElement.clientHeight-4;
  canvas.width = pen.canvas.width;
	blocks = calculateBlocks();
  canvas.height = pen.canvas.height;
  updatePaddleSize();
  updateBallSizeAndSpeed();
}


function updatePaddleSize() {
  box.height = box.width/4;
  box.width = canvas.width/6;
  box.y = canvas.height - box.height - 5;
}


function updateBallSizeAndSpeed() {
  ball.size = box.width/6;
  ball.y = box.y - ball.size - 2;
  ball.speed = ball.size/4;
}


// crash detection code


function checkEdgeHit(ball) {
  if (ball.y <= ball.size) {
    ball.moveY = ball.speed;
  }
  if (ball.x >= canvas.width-ball.size) {
    ball.moveX = -ball.moveX;
  }
  if (ball.x <= ball.size) {
    ball.moveX = -ball.moveX;
  }
}


function checkBallHitsPadle(ball) {
  if (hitsBox(ball,box)) {
    ball.moveY = -ball.speed;
    if (hitsLeftSide(ball,box)) {
      ball.moveX -= 2;
    }
    else if (hitsRightSide(ball,box)){
      ball.moveX += 2;

    }
  }
}
function hitsLeftSide(ball,box) {
  if (ball.x < box.x + box.width / 5) {
    return true;
  }
  else {
    return false;
  }

}
function hitsRightSide(ball,box) {
  if (ball.x > box.x + box.width - box.width / 5) {
    return true;
  }
  else {
    return false;
  }
}

function checkBallHitsBlocks(ball,blocks) {
	blocks.forEach(block => {
		if (hitsBlock(ball,block)) {
			ball.moveY = -ball.moveY;
			blockState[block.index] = false;
	  }
	});
}


function hitsBlock(ball,block) {
	return blockState[block.index] && hitsBox(ball, block);
}


function hitsBox(ball,box) {
  const bounds = {
    left: ball.x-ball.size/2,
    right: ball.x+ball.size/2,
    top: ball.y-ball.size/2,
    bottom: ball.y+ball.size/2
  }
  const boxRight = box.x + box.width;
  const boxBottom = box.y + box.height;
  const insideLeftRight = bounds.right >= box.x && bounds.left <= boxRight;
  const insideTopBottom = bounds.bottom >= box.y && bounds.top <= boxBottom;
  return insideLeftRight && insideTopBottom;
}

function checkCrashed(ball) {

  const ballAtBottom = ball.y >= canvas.height + ball.size/2;
  if (ballAtBottom) {
    if (game.state !== 'crashed') {
      setTimeout(() => {
        ball.y = canvas.height - ball.size - box.height;
        game.state = 'starting';
      },3000);
    }
    game.state = 'crashed';
  }
}


// calculations


function calculateBlocks() {
	const blocks = [];
	for (let row = 0; row < BLOCK_ROW_COUNT; row++) {
		for (let column = 0; column < BLOCK_COLUMN_COUNT; column++) {
			const index = BLOCK_COLUMN_COUNT * row + column;
			blocks[index] = calculateBlock(row, column);
			blocks[index].index = index;
			blocks[index].color = randomColor();
		}
	}
	return blocks;
}


function calculateBlock(row, column) {
	let height = canvas.height * 0.4 / BLOCK_ROW_COUNT;
	let width = canvas.width / BLOCK_COLUMN_COUNT;
	const space_x = width / 10;
	const space_y = height / 5;
	let x = column * width;
	let y = row * height;
	width = width - space_x * 2;
	height = height - space_y * 2;
	x = x + space_x;
	y = y + space_y;
	return { height, width, x, y };
}


function randomColor() {
	const r = Math.round(Math.random()*255);
	const g = Math.round(Math.random()*255);
	const b = Math.round(Math.random()*255);
	return `rgba(${r},${g},${b},0.75)`;
}

resizeCanvas();
window.requestAnimationFrame(paintgame);
