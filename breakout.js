const canvas = document.getElementById("breakout");
const pen = canvas.getContext("2d");

let speed=5;
let ballsize=15;
let x=250;
let y=200;
let movex=speed;
let movey=speed;
let boxposition=15;
let boxspeed=20;
let boxsize=150;

function paintgame() {
  clear();
  paintball(x,y,ballsize);
  paintBox(boxposition);

  x=x+movex;
  y=y+movey;
  checkEdgeHit();

  checkBallHitsBox();

  window.requestAnimationFrame(paintgame);
}


document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  if (keyName==='ArrowRight') {
    moveRight();
  }
  if (keyName==='ArrowLeft') {
    moveLeft();
  }
});

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

function paintball(x,y,size) {
  pen.beginPath();
  pen.fillStyle='red';
  pen.arc(x, y, size, 0, 2 * Math.PI);
  pen.fill();
}


function paintBox (x) {
  pen.beginPath();
  pen.fillStyle='blue';
  pen.rect(x,400-20,boxsize,15);
  pen.fill();
}


function checkEdgeHit() {
  if (y <= 0+ballsize) {
    movey= speed;
  }
  if (x >= 500-ballsize) {
    movex=-speed;
  }
  if (x <= 0+ballsize) {
    movex= speed;
  }
}


function checkBallHitsBox() {
  if (ballHitsBox()) {
    movey=-speed;
  }
}

function ballHitsBox() {
  return ballHitsTopBox() && ballHitsInsideBox();
}

function ballHitsTopBox() {
  if (y>400-20-ballsize) {
    return true;
  }
  else {
    return false;
  }
}

function ballHitsInsideBox() {
  if (x >= boxposition && x <= boxposition+boxsize) {
    return true;
  }
  else {
    return false;
  }
}
window.requestAnimationFrame(paintgame);
