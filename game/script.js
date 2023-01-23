import { boxAudio, barAudio, loseAudio, boxBreakAudio, win, boost, clock } from "../modules/audio.js";
import {moveBall,changeDirectionOfBall,getCurrentPosition} from "../modules/motion_engine.js";
import {ball1,ball2,bar,container,root,square,centerText,resetButton,returnButton,reward1,reward2,reward3,reward4,rewardsContainer,ballsArray,timer,score,cursor} from "../modules/dom_variables.js"
import { mouseInit, moveBarWithMouse } from "../modules/mouse_mechanics.js";

export {containerBorder,containerBound}


//^---------------------------------------------------
//^--------------- Variables declaration -------------
//^---------------- and initialization ---------------
//^---------------------------------------------------

const containerBound = container.getBoundingClientRect();
const computedPosition = getComputedStyle(root);
const computedBar = getComputedStyle(bar);
const containerBorderString = getComputedStyle(container).getPropertyValue('border-width');
const containerBorder = parseInt(containerBorderString);

let box = [];


bar.bound = bar.getBoundingClientRect();
bar.cssVarName = '--bar-position';
bar.position = computedPosition.getPropertyValue(bar.cssVarName);
bar.width = parseInt(computedBar.width);

let remainingBoxes;

let currentScore = 0;
let scoreIncrement = 10;

let currentSeconds = 0;
let currentMinutes = 0;

let isRewardPresent = false;

//^---------------------------------------------------
//^---------------- Changing Variables ---------------
//^---------------------------------------------------


const nrOfBoxes = 10; // number of boxes on this level

reward1.boxNr = 9; // the position of the increasing bar reward
reward2.boxNr = 1; // the position of the 2x reward
reward3.boxNr = 3; // the position of the -10s reward
reward4.boxNr = 7; // the position of the double ball reward

const lengthOfBox = 50; // the length of one box in px
const spaceBetween = 10; // the space between boxes in px
const positionOfFirstBox = 50; // the position of the first box starts at 50px



//^---------------------------------------------------
//^----------------- Functions section ---------------
//^---------------------------------------------------


const createBoxesRow = (nr) => {
  const checkRewardPresent = (reward, increment) => {
    if (increment == reward.boxNr) {
      reward.positionOx = positionOfCurrentBox;
      box[increment].hasReward = true;
    }
  }
  let positionOfCurrentBox = positionOfFirstBox;
  remainingBoxes = nr;
  for (let i = 1; i <= nr; i++) {
    box[i] = document.createElement("div");
    box[i].classList.add("box3lives");
    box[i].style.left = positionOfCurrentBox + "px";
    square.appendChild(box[i]);
    box[i].lives = 3;
    box[i].bound = box[i].getBoundingClientRect();
    box[i].hasReward = false;

    checkRewardPresent(reward1, i);
    checkRewardPresent(reward2, i);
    checkRewardPresent(reward3, i);
    checkRewardPresent(reward4, i);

    positionOfCurrentBox += lengthOfBox + spaceBetween;
  }

};

const initializeBall = (ball, posOx, posOy, dirOx, dirOy) => {
  ball.style.display = 'block';

  ball.xDir = dirOx; // initial direction on the Ox axis
  ball.yDir = dirOy; // initial direction on the Oy axis
  ball.bound = ball.getBoundingClientRect();
  ball.cssVarName = {
    Ox: posOx,
    Oy: posOy
  }
  ballsArray.push(ball);
  if (ballsArray.indexOf(ball) == 0) {
    ball.positionOx = computedPosition.getPropertyValue(ball.cssVarName.Ox);
    ball.positionOy = computedPosition.getPropertyValue(ball.cssVarName.Oy);
  }
  else {
    ball.positionOx = ballsArray[ballsArray.indexOf(ball) - 1].positionOx;
    ball.positionOy = ballsArray[ballsArray.indexOf(ball) - 1].positionOy;
  }

}



//^---------------------------------------------------
//^---------------- Collision detection --------------
//^---------------------------------------------------


const checkCollisionWithWall = (ballNr) => {

  if (ballNr.bound.right >= containerBound.right) {
    changeDirectionOfBall(ballNr, 'left');


  } else if (ballNr.bound.left <= containerBound.left) {
    changeDirectionOfBall(ballNr, 'right');

  } else if (ballNr.bound.top <= containerBound.top) {
    changeDirectionOfBall(ballNr, 'down');

  } else if (collisionWithBar(ballNr.bound)) {
    barAudio.play();
    changeDirectionOfBall(ballNr, 'up');

  } else if (ballNr.bound.bottom > bar.bound.bottom) {
    ballNr.remove();
    ballsArray.splice(ballsArray.indexOf(ballNr), 1);
    if (ballsArray.length < 1) endGame(false);
  }
}

const collisionWithBar = (elem) => {
  return (Math.floor(elem.bottom) >= Math.floor(bar.bound.top)
    && elem.left <= bar.bound.right
    && elem.right >= bar.bound.left)
}

const collisionWithBox = (ball, elem, side) => {
  const condition =
    side == 'down' ? (Math.floor(ball.bound.top) == Math.floor(elem.bound.bottom) &&
      ball.bound.left <= elem.bound.right &&
      ball.bound.right >= elem.bound.left) :
      side == 'up' ? (Math.floor(elem.bound.top) == Math.floor(ball.bound.bottom) &&
        ball.bound.left <= elem.bound.right &&
        ball.bound.right >= elem.bound.left) :
        side == 'right' ? (Math.floor(ball.bound.left) == Math.floor(elem.bound.right) &&
          ball.bound.top <= elem.bound.bottom &&
          ball.bound.bottom >= elem.bound.top) :
          side == 'left' ? (Math.floor(elem.bound.left) == Math.floor(ball.bound.right) &&
            ball.bound.top <= elem.bound.bottom &&
            ball.bound.bottom >= elem.bound.top) :
            false;
  return condition;
}

const checkCollisionWithBox = (ballNr) => {
  const decreaseLives = (elem) => {
    increaseScore(1);
    boxAudio.play();
    elem.lives--;
    handleLives(elem);
  }
  box.forEach((elem) => {
    if (ballNr.yDir == 'up' && collisionWithBox(ballNr, elem, 'down')) {
      changeDirectionOfBall(ballNr, 'down');
      decreaseLives(elem);
    }
    if (ballNr.yDir == 'down' && collisionWithBox(ballNr, elem, 'up',)) {
      changeDirectionOfBall(ballNr, 'up');
      decreaseLives(elem);
    }
    if (ballNr.xDir == 'left' && collisionWithBox(ballNr, elem, 'right')) {
      changeDirectionOfBall(ballNr, 'right');
      decreaseLives(elem);
    }
    if (ballNr.xDir == "right" && collisionWithBox(ballNr, elem, 'left')) {
      changeDirectionOfBall(ballNr, 'left');
      decreaseLives(elem);
    }
  })
};

//^---------------------------------------------------
//^--------------- Animations & Rewards --------------
//^---------------------------------------------------


const handleLives = (item) => {
    const checkBoxHasReward = (item) => {
      if (item.hasReward) {
        if (box.indexOf(item) == reward1.boxNr) { makeRewardVisible(reward1); return };
        if (box.indexOf(item) == reward2.boxNr) { makeRewardVisible(reward2); return };
        if (box.indexOf(item) == reward3.boxNr) { makeRewardVisible(reward3); return };
        if (box.indexOf(item) == reward4.boxNr) { makeRewardVisible(reward4); return };
      }
    }
    if (item.lives == 2) {
        item.classList.remove('box3lives')
        item.classList.add("box2lives");
      }
      else if (item.lives == 1) {
        item.classList.remove("box2lives");
        item.classList.add("box1life");
      } else if (item.lives == 0) {
        boxBreakAudio.play();
        checkBoxHasReward(item);
        item.bound = [];
        item.style.backgroundColor = 'white';
        setTimeout(() => item.remove(), 50)
        increaseScore(4);
        remainingBoxes--;
      }
    };

const increaseScore = (multipliedBy) => {
  currentScore += scoreIncrement * multipliedBy;
  score.innerText = currentScore;
}

const showCursor = (condition) => {
  condition ? cursor.style.cursor = 'cell' : cursor.style.cursor = 'none';
}

const timeDisplay = (min, sec) => {
  return sec > 9 ?
    min + ':' + sec :
    min + ':0' + sec
}

const increaseTimer = () => {
  currentSeconds++;
  if (currentSeconds > 59) {
    currentSeconds = 0;
    currentMinutes++;
  }
  timer.innerText = timeDisplay(currentMinutes, currentSeconds);
}

const initializeTimeAndScore = () => {
  timer.innerText = timeDisplay(currentMinutes, currentSeconds);

  score.innerText = currentScore;
  score.classList.add('timer')
}

const makeRewardVisible = (reward) => {
  reward.isPresent = true;
  isRewardPresent = true;
  reward.style.display = 'block';
}

const catchReward = (elem) => {
  const rewardPos = elem.getBoundingClientRect();
  if (collisionWithBar(rewardPos)) {
    console.log('got it!')
    elem.remove();

  }
  else if (rewardPos.bottom > bar.bound.bottom) {
    console.log('missed it!')
    elem.remove();
  }
}; // template for adding new rewards later on


const catchBigBarReward = (elem) => {
  const rewardPos = elem.getBoundingClientRect();
  if (collisionWithBar(rewardPos)) {
    elem.remove();
    isRewardPresent = false;
    bar.style.animation = "clicking 2s linear"
    bar.width *= 1.33;
    boost.play();
    setTimeout(() => { bar.style.width = (bar.width + 'px') }, 2000)

  }
  else if (rewardPos.bottom > bar.bound.bottom) {
    elem.remove();
    isRewardPresent = false;
  }
}

const catch2xReward = (elem) => {
  const rewardPos = elem.getBoundingClientRect();
  if (collisionWithBar(rewardPos)) {
    scoreIncrement *= 2;
    elem.remove();
    boost.play();
    isRewardPresent = false;
  }
  else if (rewardPos.bottom > bar.bound.bottom) {
    elem.remove();
    isRewardPresent = false;
  }
}

const createFallingReward = (fallingElem, cssVarNameOy) => {

  let positionFallingOx = box[fallingElem.boxNr].bound.left - containerBorder - containerBound.left + lengthOfBox / 2;
  let positionFallingOy = 0;

  fallingElem.style.left = positionFallingOx + 'px';

  fallingElem.cssVarNameOy = cssVarNameOy;
  fallingElem.positionOy = positionFallingOy;
  root.style.setProperty(cssVarNameOy, fallingElem.positionOy);

  fallingElem.isPresent = false;
}// it creates a new reward and "attaches" it to the desired element

const catch10sReward = (elem) => {
  const rewardPos = elem.getBoundingClientRect();
  if (collisionWithBar(rewardPos)) {
    if (currentSeconds >= 10) {
      currentSeconds -= 10;
      timer.innerText = timeDisplay(currentMinutes, currentSeconds);
    }
    else {
      currentMinutes = currentMinutes < 1 ? '0' : currentMinutes--;
      currentSeconds += 50; //^ mai e de lucrat aici
      timer.innerText = timeDisplay(currentMinutes, currentSeconds);
    }
    elem.remove();
    boost.play();
    isRewardPresent = false;
  }
  else if (rewardPos.bottom > bar.bound.bottom) {
    elem.remove();
    isRewardPresent = false;
  }
}

const catchDoubleBallReward = (elem) => {
  const rewardPos = elem.getBoundingClientRect();
  if (collisionWithBar(rewardPos)) {
    boost.play();
    if (ball1.yDir == 'up') {
      const oppositeDirectionX = (ball1.xDir == 'left') ? 'right' : 'left';
      initializeBall(ball2, '--position-Ox2', '--position-Oy2', oppositeDirectionX, 'up');

    }
    else if (ball1.yDir == 'down') {
      initializeBall(ball2, '--position-Ox2', '--position-Oy2', ball1.xDir, 'up');

    }
    elem.remove();
    isRewardPresent = false;
  }
  else if (rewardPos.bottom > bar.bound.bottom) {
    elem.remove();
    isRewardPresent = false;
  }
};


const endGame = (condition) => {

  const endGameMessage = () => {

    if (condition) {
      centerText.style.animation = "textAnimation 1s cubic-bezier(.65,.23,.89,.51)";
      centerText.innerText = 'YOU WIN ! :)'
      setTimeout(() => {
        returnButton.innerText = 'Back to \n main menu ';
        returnButton.classList.add('button');
        returnButton.style.animation = 'resetButton 1s linear'
        showCursor(true);
      },
        1500)
      showCursor(true);
    }
    else {
      centerText.style.animation = "textAnimation 1s cubic-bezier(.65,.23,.89,.51)";
      centerText.innerText = 'YOU LOST ! :('
      setTimeout(() => {
        resetButton.innerText = 'Reset game';
        resetButton.classList.add('button');
        resetButton.style.animation = 'resetButton 1s linear'
        showCursor(true);
      },
        1500)
    }
  }
  ballsArray.forEach((item) => { item.remove() })

  if (isRewardPresent) {
    rewardsContainer.remove();
  }

  clearInterval(gameInterval);
  clearInterval(timerInterval);
  endGameMessage();
  
  condition == true ? win.play() : loseAudio.play();

  const storedData = localStorage.getItem('HighScore');
  const highScore = storedData ? JSON.parse(storedData) : {};
  const currentPlayer = sessionStorage.getItem("currentPlayer");
  if (!highScore[currentPlayer]) highScore[currentPlayer] = 0;
  if (currentPlayer && highScore[currentPlayer] < currentScore) {
    console.log(highScore[currentPlayer], highScore[currentPlayer] < currentScore)
    highScore[currentPlayer] = currentScore;
    localStorage.setItem('HighScore', JSON.stringify(highScore))
  }
}


//^---------------------------------------------------
//^--------------------- Gameplay --------------------
//^---------------------------------------------------

const gamePlay = () => {
  moveBarWithMouse();
  ballsArray.forEach((ball) => {
    getCurrentPosition(ball);
    moveBall(ball);
    checkCollisionWithWall(ball);
    checkCollisionWithBox(ball);
  })

  if (reward1.isPresent) { moveReward(reward1, 0.4); catchBigBarReward(reward1); }
  if (reward2.isPresent) { moveReward(reward2, 0.4); catch2xReward(reward2); }
  if (reward3.isPresent) { moveReward(reward3, 0.4); catch10sReward(reward3); }
  if (reward4.isPresent) { moveReward(reward4, 0.4); catchDoubleBallReward(reward4); }

  if (remainingBoxes == 0) endGame(true);
}


//^---------------------------------------------------
//^-------------------- Run code ---------------------
//^---------------------------------------------------

initializeBall(ball1, '--position-Ox1', '--position-Oy1', 'right', 'up');
mouseInit();//the addEventListener method for the mouse move must be applied only once
initializeTimeAndScore();
showCursor(false);

createBoxesRow(nrOfBoxes);

const startAnimation = () => {
  let n = 4;
  setTimeout(() => { clock.play() }, 1500);
  const startInterval = setInterval(() => {
    let text = n > 1 ? n - 1 : "GO!";
    centerText.innerText = `${text}...`;
    centerText.style.animation = 'textAnimation 0.5s linear';
    n--;
    setTimeout(() => { centerText.style.animation = 'none' }, 500);
    if (n < 0) {
      centerText.innerText = '';
      clearInterval(startInterval);
    }
  }, 1000)


}

let gameInterval; // It is declared here to have global scope. 
//It gets attributed the setInterval inside the runGame function
let timerInterval;

const runGame = () => {
  startAnimation();

  setTimeout(() => {
    timerInterval = setInterval(increaseTimer, 1000);
    gameInterval = setInterval(gamePlay, 1);
  }, 4000);
}
runGame();
// the setInterval function executes the gamePlay function every 1 milisecond



let boxBorder = getComputedStyle(box[1]).getPropertyValue('border-width');
boxBorder = parseInt(boxBorder.replace(/([^1-9.])/g, ''));





//This function is written here due to scoping reasons

createFallingReward(reward1, '--reward1-positionOy');
createFallingReward(reward2, '--reward2-positionOy');
createFallingReward(reward3, '--reward3-positionOy');
createFallingReward(reward4, '--reward4-positionOy');


const moveReward = (reward, speedInPx) => {
  reward.positionOy += speedInPx;
  root.style.setProperty(reward.cssVarNameOy, reward.positionOy);
}



