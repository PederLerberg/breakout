const canvas = document.getElementById("breakout");
canvas.classList.add('no-cursor');
const pen = canvas.getContext("2d");

let background = document.createElement('img');
background.src = 'background.jpg';
let storm=document.createElement('img');
storm.src = 'storm.jpg';
let hitwall = new Audio('hitwall.mp3');
let hitbox = new Audio('hitbox.mp3');
let crash = new Audio('crash.mp3');
let speed=5;
let ballsize=15;

let movex=speed;
let movey=-speed;
let boxsize=150;
let boxheight=15;
let boxposition=canvas.width/2-boxsize/2;
let boxspeed=7;
let leftdown=false;
let rightdown=false;
let gamestate='starting';

let ballPos= {
   x:250,
   y:canvas.height-ballsize-boxheight
}


function paintgame() {
  clear();
  if (gamestate==='crashed') {
    pen.drawImage(storm,0, 0,canvas.width, canvas.height);
  }
  else {
    pen. drawImage(background, 0, 0,canvas.width, canvas.height);
  }
  paintball(ballPos,ballsize);
  paintBox(boxposition);


  if (gamestate==='starting') {
    ballPos.x=boxposition+boxsize/2;
  }
  if (gamestate==='running') {
    ballPos.x += movex;
    ballPos.y+=movey;
    checkEdgeHit();
  }


  if (leftdown===true) {
    boxposition=boxposition-boxspeed;
    if (boxposition<0) {
      boxposition=0;
    }
  }
  if (rightdown===true) {
    boxposition=boxposition+boxspeed;
    if (boxposition>500-boxsize) {
      boxposition=500-boxsize;
    }
  }

  checkBallHitsBox();
  checkCrashed();

  window.requestAnimationFrame(paintgame);
}


document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  if (keyName==='ArrowRight') {
    rightdown=true;
  }
  if (keyName==='ArrowLeft') {
    leftdown=true;
  }
  if (event.code==='Space') {
    gamestate='running';
  }

});

document.addEventListener('keyup', (event) => {
  const keyName = event.key;
  if (keyName==='ArrowRight') {
    rightdown=false;
  }
  if (keyName==='ArrowLeft') {
    leftdown=false;
  }
});

canvas.addEventListener('mousemove', event => {
  boxposition=event.offsetX-boxsize/2;
});
canvas.addEventListener('click', ()=> {
  gamestate='running';
});
// canvas.addEventListener('mouseenter', ()=> {
//   canvas.classList
// });

function moveRight() {
  boxposition=boxposition+boxspeed;
  if (boxposition>500-boxsize) {
    boxposition=500-boxsize;
  }
}
function moveLeft() {
  boxposition=boxposition-boxspeed;
  if (boxposition<0) {
    boxposition=0;
  }
}


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

function paintball(pos,size) {
  pen.beginPath();
  pen.fillStyle='red';
  pen.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
  pen.fill();
}


function paintBox (x) {
  pen.beginPath();
  pen.fillStyle='blue';
  pen.rect(x,canvas.height-boxheight,boxsize,boxheight);
  pen.fill();
}


function checkEdgeHit() {
  let y= ballPos.y;
  let x=ballPos.x;
  if (y <= 0+ballsize) {
    movey= speed;
    hitwall.play();
  }
  if (x >= 500-ballsize) {
    movex=-speed;
    hitwall.play();
  }
  if (x <= 0+ballsize) {
    movex= speed;
    hitwall.play();
  }
}


function checkBallHitsBox() {
  if (ballHitsBox()) {
    movey=-speed;
    if (gamestate==='running') {
      hitbox.play();
    }

  }
}

function ballHitsBox() {
  return ballHitsTopBox() && ballHitsInsideBox();
}

function ballHitsTopBox() {
  let topbox=canvas.height-boxheight-ballsize;
  if (ballPos.y>=topbox && ballPos.y<=topbox+speed) {
    return true;
  }
  else {
    return false;
  }
}

function ballHitsInsideBox() {
  let x= ballPos.x;
  if (x >= boxposition && x <= boxposition+boxsize) {
    return true;
  }
  else {
    return false;
  }
}

function checkCrashed() {
  if (ballPos.y>=canvas.height+ballsize/2) {
    if (gamestate !== 'crashed') {
        crash.play();
        setTimeout(function(){
          ballPos.y=canvas.height-ballsize-boxheight;
          gamestate='starting';
        },3000);
    }

    gamestate = 'crashed';
  }
}

window.requestAnimationFrame(paintgame);
