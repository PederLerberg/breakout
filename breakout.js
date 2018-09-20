const canvas = document.getElementById("breakout");
canvas.classList.add('no-cursor');
const pen = canvas.getContext("2d");

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
let x=250;
let y=canvas.height-ballsize-boxheight;

function paintgame() {
  clear();
  paintball(x,y,ballsize);
  paintBox(boxposition);


  if (gamestate==='starting') {
    x=boxposition+boxsize/2;
  }
  if (gamestate==='running') {
    x=x+movex;
    y=y+movey;
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

function paintball(x,y,size) {
  pen.beginPath();
  pen.fillStyle='red';
  pen.arc(x, y, size, 0, 2 * Math.PI);
  pen.fill();
}


function paintBox (x) {
  pen.beginPath();
  pen.fillStyle='blue';
  pen.rect(x,canvas.height-boxheight,boxsize,boxheight);
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
  if (y>=canvas.height-boxheight-ballsize && y<=canvas.height-boxheight-ballsize+speed) {
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
