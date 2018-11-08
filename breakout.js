// the canvas where the game is painted
const canvas = document.getElementById("breakout");
canvas.classList.add('no-cursor');
const pen = canvas.getContext("2d");


// resize the canvas to the window size
window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
	pen.canvas.width = document.documentElement.clientWidth;
	pen.canvas.height = document.documentElement.clientHeight-4;
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
  size: 150,
  height: 15,
  x: canvas.width/2-150/2,
  y: canvas.height-15,
  speed: 7
}

const ball = {
  speed: 5,
  size: 15,
  x: 250,
  y: canvas.height-15-box.height,
  moveX: 5,
  moveY: -5,
}


const blocks = [
  { size: 75, height: 20, x: 20, y: 20 },
  { size: 75, height: 20, x: 20+90, y: 20 },
  { size: 75, height: 20, x: 20+90*2, y: 20 },
  { size: 75, height: 20, x: 20+90*3, y: 20 },
  { size: 75, height: 20, x: 20+90*4, y: 20 },
];


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
  pen.rect(box.x,box.y,box.size,box.height);
  pen.fill();
}


// game animation code


function moveBallAlongWithBox(ball) {
  ball.x=box.x+box.size/2;
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
  if (box.x > canvas.width-box.size) {
    box.x = canvas.width-box.size;
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
  box.x=event.offsetX-box.size/2;
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


function hitsBox(ball,box) {
  const bounds = {
    left: ball.x-ball.size/2,
    right: ball.x+ball.size/2,
    top: ball.y-ball.size/2,
    bottom: ball.y+ball.size/2
  }
  const boxRight = box.x + box.size;
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
