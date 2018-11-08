const canvas = document.getElementById("breakout");
canvas.classList.add('no-cursor');
const pen = canvas.getContext("2d");

// background images

const background = document.createElement('img');
background.src = 'background.jpg';
const storm=document.createElement('img');
storm.src = 'storm.jpg';


// our game data


const box = {
  size: 150,
  height: 15,
  position: canvas.width/2-150/2,
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

const game = {
  leftDown: false,
  rightDown: false,
  state: 'starting'
}


// our main game loop


function paintgame() {
  clear();
  paintBackground();
  paintball(ball.x,ball.y,ball.size);
  paintBox(box.position);

  if (game.state==='starting') {
    moveBallAlong();
  }
  else if (game.state==='running') {
    moveBall();
    checkEdgeHit();
  }

  if (game.leftDown===true) {
    moveBoxLeft();
  }
  if (game.rightDown===true) {
    moveBoxRight();
  }

  checkBallHitsBox();
  checkCrashed();

  window.requestAnimationFrame(paintgame);
}

window.requestAnimationFrame(paintgame);


// game paint code


function clear() {
  pen.beginPath();
  pen.fillStyle='white';
  pen.moveTo(0, 0);
  pen.lineTo(500, 0);
  pen.lineTo(500, 400);
  pen.lineTo(0, 400);
  pen.lineTo(0, 0);
  pen.fill();
  pen.stroke();
}


function paintBackground() {
  if (game.state==='crashed') {
    pen.drawImage(storm,0, 0,canvas.width, canvas.height);
  }
  else {
    pen. drawImage(background, 0, 0,canvas.width, canvas.height);
  }
}


function paintball(x,y,size) {
  pen.beginPath();
  pen.fillStyle='red';
  pen.arc(x, y, size, 0, 2 * Math.PI);
  pen.fill();
}


function paintBox (x) {
  pen.beginPath();
  pen.fillStyle='blue';
  pen.rect(x,canvas.height-box.height,box.size,box.height);
  pen.fill();
}


// game animation code


function moveBallAlong() {
  ball.x=box.position+box.size/2;
}


function moveBall() {
  ball.x=ball.x+ball.moveX;
  ball.y=ball.y+ball.moveY;
}


function moveBoxLeft() {
  box.position=box.position-box.speed;
  if (box.position<0) {
    box.position=0;
  }
}


function moveLeft() {
  box.position=box.position-box.speed;
  if (box.position<0) {
    box.position=0;
  }
}


function moveBoxRight() {
  box.position=box.position+box.speed;
  if (box.position>500-box.size) {
    box.position=500-box.size;
  }
}


function moveRight() {
  box.position=box.position+box.speed;
  if (box.position>500-box.size) {
    box.position=500-box.size;
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
  box.position=event.offsetX-box.size/2;
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
  if (ball.x >= box.position && ball.x <= box.position+box.size) {
    return true;
  }
  else {
    return false;
  }
}


function checkCrashed() {
  if (ball.y>=canvas.height+ball.size/2) {
    if (game.state !== 'crashed') {
      setTimeout(function(){
        y=canvas.height-ball.size-box.height;
        game.state='starting';
      },3000);
    }
    game.state = 'crashed';
  }
}
