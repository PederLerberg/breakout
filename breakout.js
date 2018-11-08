const canvas = document.getElementById("breakout");
canvas.classList.add('no-cursor');
const pen = canvas.getContext("2d");

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
  speed: 7
}

const ball = {
  speed: 5,
  size: 15,
  x: 250,
  y: canvas.height-15-box.height,
  moveX: 5,
  moveY: 5,
}


// our main game loop


function paintgame() {
  paintBackground();
  paintBall(ball);
  paintBox(box);

  if (game.state==='starting') {
    moveBallAlongWithBox();
  }
  else if (game.state==='running') {
    moveBall();
    checkEdgeHit();
    checkBallHitsBox();
    checkCrashed();
  }

  if (game.leftDown===true) {
    moveBoxLeft();
  }
  if (game.rightDown===true) {
    moveBoxRight();
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
  pen.rect(box.x,canvas.height-box.height,box.size,box.height);
  pen.fill();
}


// game animation code


function moveBallAlongWithBox() {
  ball.x=box.x+box.size/2;
}


function moveBall() {
  ball.x=ball.x+ball.moveX;
  ball.y=ball.y+ball.moveY;
}


function moveBoxLeft() {
  box.x=box.x-box.speed;
  if (box.x<0) {
    box.x=0;
  }
}


function moveBoxRight() {
  box.x=box.x+box.speed;
  if (box.x>500-box.size) {
    box.x=500-box.size;
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


function checkEdgeHit() {
  if (ball.y <= 0+ball.size) {
    ball.moveY= ball.speed;
  }
  if (ball.x >= 500-ball.size) {
    ball.moveX=-ball.speed;
  }
  if (ball.x <= 0+ball.size) {
    ball.moveX= ball.speed;
  }
}


function checkBallHitsBox() {
  if (ballHitsBox()) {
    ball.moveY=-ball.speed;
  }
}


function ballHitsBox() {
  return ballHitsTopBox() && ballHitsInsideBox();
}


function ballHitsTopBox() {
  if (ball.y>=canvas.height-box.height-ball.size && ball.y<=canvas.height-box.height-ball.size+ball.speed) {
    return true;
  }
  else {
    return false;
  }
}


function ballHitsInsideBox() {
  if (ball.x >= box.x && ball.x <= box.x+box.size) {
    return true;
  }
  else {
    return false;
  }
}


function checkCrashed() {
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
