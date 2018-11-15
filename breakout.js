// the canvas where the game is painted
const canvas = document.getElementById("breakout");
canvas.classList.add('no-cursor');
const pen = canvas.getContext("2d");

const BALL_SPEED = 5;
const BLOCK_ROW_COUNT = 3;
const BLOCK_COLUMN_COUNT = 5;
let blocks = [];

// resize the canvas to the window size
window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
	pen.canvas.width = document.documentElement.clientWidth;
	pen.canvas.height = document.documentElement.clientHeight-4;
	blocks = calculateBlocks();
}
resizeCanvas();


// background images

const background = document.createElement('img');
background.src = 'background.jpg';
const storm=document.createElement('img');
storm.src = 'storm.jpg';


// our game data


const game = {
  leftDown: false,
  rightDown: false,
  state: 'starting'
}

const box = {
  width: 150,
  height: 15,
  x: canvas.width/2-150/2,
  y: canvas.height-15,
  speed: 7
}

const ball = {
  speed: BALL_SPEED,
  size: 15,
  x: 250,
  y: canvas.height-15-box.height,
  moveX: BALL_SPEED,
  moveY: -BALL_SPEED,
}


// our main game loop


function paintgame() {
  paintBackground();
  paintBall(ball);
  paintBox(box);
	blocks.forEach(paintBox);

  if (game.state==='starting') {
    moveBallAlongWithBox(ball);
  }
  else if (game.state==='running') {
    moveBall(ball);
    checkEdgeHit(ball);
    checkBallHitsBox(ball);
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

window.requestAnimationFrame(paintgame);


// game paint code


function paintBackground() {
  if (game.state==='crashed') {
    pen.drawImage(storm,0, 0,canvas.width, canvas.height);
  }
  else {
    pen. drawImage(background, 0, 0,canvas.width, canvas.height);
  }
}


function paintBall(ball) {
  pen.beginPath();
  pen.fillStyle='red';
  pen.arc(ball.x, ball.y, ball.size, 0, 2 * Math.PI);
  pen.fill();
}


function paintBox(box) {
  pen.beginPath();
  pen.fillStyle='blue';
  pen.rect(box.x,box.y,box.width,box.height);
  pen.fill();
}


// game animation code


function moveBallAlongWithBox(ball) {
  ball.x=box.x+box.width/2;
}


function moveBall(ball) {
  ball.x=ball.x+ball.moveX;
  ball.y=ball.y+ball.moveY;
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
  box.x=event.offsetX-box.width/2;
});


canvas.addEventListener('click', ()=> {
  game.state='running';
});


// crash detection code


function checkEdgeHit(ball) {
  if (ball.y <= ball.size) {
    ball.moveY = ball.speed;
  }
  if (ball.x >= canvas.width-ball.size) {
    ball.moveX =-ball.speed;
  }
  if (ball.x <= ball.size) {
    ball.moveX = ball.speed;
  }
}


function checkBallHitsBox(ball) {
  if (hitsBox(ball,box)) {
    ball.moveY =- ball.speed;
  }
}


function checkBallHitsBlocks(ball,blocks) {
	blocks.forEach(block => {
		if (hitsBox(ball,block)) {
			ball.moveY = -ball.moveY;
	  }
	});
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
		}
	}
	return blocks;
}


function calculateBlock(row, column) {
	let height = canvas.height * 0.3 / BLOCK_ROW_COUNT;
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
