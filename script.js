
//^---------------------------------------------------
//^------------- DOM variables declaration -----------
//^---------------------------------------------------

const ball1 = document.getElementsByClassName('ball1')[0];
const ball2 = document.getElementsByClassName('ball2')[0];
const ball3 = document.getElementsByClassName('ball3')[0];
const ball4 = document.getElementsByClassName('ball4')[0];

const container = document.getElementsByClassName('container')[0];
const root = document.documentElement;

const button1 = document.getElementsByClassName('button1')[0];
const button2 = document.getElementsByClassName('button2')[0];
const button3 = document.getElementsByClassName('button3')[0];
const playerInput = document.getElementById('player-name');

//^---------------------------------------------------
//^--------------- Variables declaration -------------
//^---------------- and initialization ---------------
//^---------------------------------------------------

let xDir = ['right','right','right','right'];
let yDir = ['down','down','down','down'];

let ballBound = [ball1.getBoundingClientRect(),
    ball2.getBoundingClientRect(),
    ball3.getBoundingClientRect(),
    ball4.getBoundingClientRect()];

let buttonBound1= button1.getBoundingClientRect();
let buttonBound2= button2.getBoundingClientRect();
let buttonBound3= button3.getBoundingClientRect();
let inputBound = playerInput.getBoundingClientRect();

const containerBound = container.getBoundingClientRect();
const computedPosition = getComputedStyle(root);
const containerBorder = parseInt(getComputedStyle(container).getPropertyValue('border-width'));

let ballPosition0x = [computedPosition.getPropertyValue('--position-Ox1'),
computedPosition.getPropertyValue('--position-Ox2'),
computedPosition.getPropertyValue('--position-Ox3'),
computedPosition.getPropertyValue('--position-Ox4')];
let ballPosition0y = [computedPosition.getPropertyValue('--position-Oy1'),
computedPosition.getPropertyValue('--position-Oy2'),
computedPosition.getPropertyValue('--position-Oy3'),
computedPosition.getPropertyValue('--position-Oy4')];

//^---------------------------------------------------
//^----------------- Functions section ---------------
//^---------------------------------------------------

const moveBall = (i) => {
    if (xDir[i-1] == 'right') {
      ballPosition0x[i-1]++;
      root.style.setProperty('--position-Ox'+i, ballPosition0x[i-1]);
  
    } else if (xDir[i-1] == 'left') {
      ballPosition0x[i-1]--;
      root.style.setProperty('--position-Ox'+i, ballPosition0x[i-1]);
  
    }
    if (yDir[i-1] == 'down') {
      ballPosition0y[i-1]++;
      root.style.setProperty('--position-Oy'+i, ballPosition0y[i-1]);
    } else if (yDir[i-1] == 'up') {
      ballPosition0y[i-1]--;
      root.style.setProperty('--position-Oy'+i, ballPosition0y[i-1]);
    }
  
  }

  const changeDirectionOfBall = (i,direction) => {
    direction == 'left' ? xDir[i-1] = 'left' :
      direction == 'right' ? xDir[i-1] = 'right' :
        direction == 'down' ? yDir[i-1] = 'down' :
          yDir[i-1] = 'up';
  
  
  }
  
  const checkCollisionWithWall = (i) => {
  
    if (ballBound[i-1].right >= containerBound.right) {
      changeDirectionOfBall(i,'left');
  
    } else if (ballBound[i-1].left <= containerBound.left) {
      changeDirectionOfBall(i,'right');
    } else if (ballBound[i-1].top <= containerBound.top) {
      changeDirectionOfBall(i,'down');
    }
    if (Math.floor(ballBound[i-1].bottom) == Math.floor(containerBound.bottom)
      ) {
      changeDirectionOfBall(i,'up');
    }
  }

  const checkCollisionWithButton = (item,i) => {
    if (yDir[i-1] == 'up' &&
      Math.floor(ballBound[i-1].top) == Math.floor(item.bottom) &&
      ballBound[i-1].left <= item.right &&
      ballBound[i-1].right >= item.left
    ) {
        changeDirectionOfBall(i,'down');

    } else if (yDir[i-1] == 'down' &&
      Math.floor(item.top) == Math.floor(ballBound[i-1].bottom) &&
      ballBound[i-1].left <= item.right &&
      ballBound[i-1].right >= item.left
        
    ) {
        changeDirectionOfBall(i,'up');

    } else if (xDir[i-1] == 'left' &&
      Math.floor(ballBound[i-1].left) == Math.floor(item.right) &&
      ballBound[i-1].top <= item.bottom &&
      ballBound[i-1].bottom >= item.top

    ) {
        changeDirectionOfBall(i,'right');

    } else if (xDir[i-1] == "right" &&
      Math.floor(item.left) == Math.floor(ballBound[i-1].right) &&
      ballBound[i-1].top <= item.bottom &&
      ballBound[i-1].bottom >= item.top

    ) {
        changeDirectionOfBall(i,'left');
    }
  }
  


  const gamePlay = () => {
    ballBound = [ball1.getBoundingClientRect(),
        ball2.getBoundingClientRect(),
        ball3.getBoundingClientRect(),
        ball4.getBoundingClientRect()];

    for (let i=1; i<=4; i++) {
        moveBall(i);
        checkCollisionWithWall(i);
        checkCollisionWithButton(buttonBound1,i);
        checkCollisionWithButton(buttonBound2,i);
        checkCollisionWithButton(buttonBound3,i);
        checkCollisionWithButton(inputBound,i);
    }
    
  }

//^---------------------------------------------------
//^-------------------- Run code ---------------------
//^---------------------------------------------------

setInterval(gamePlay,5);

//^---------------------------------------------------
//^-------------------- Get Name ---------------------
//^---------------------------------------------------


const nameInput = document.getElementById("player-name");
const startPlay = document.getElementById("start-play-anchor");

let playerName = "";


const disableStartButton = () => {
  startPlay.style.opacity = playerName !== "" ? 1 : 0.5;
  startPlay.style.pointerEvents = "none";
}
disableStartButton();
nameInput.onchange = (e) => {
  startPlay.style.opacity = 1;
  startPlay.style.pointerEvents = "initial";
  playerName = e.target.value;
  if(playerName === "")disableStartButton();
}

startPlay.onclick = () => {
  sessionStorage.setItem("currentPlayer", playerName);
}




