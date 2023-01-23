export {moveBall,changeDirectionOfBall,getCurrentPosition}

import {bar,root} from "./dom_variables.js";


const moveBall = (elem) => {
    const changeOxPos = (pos) => {
      root.style.setProperty(elem.cssVarName.Ox, pos);
    }
    const changeOyPos = (pos) => {
      root.style.setProperty(elem.cssVarName.Oy, pos);
    }
    if (elem.xDir == 'right') {
      elem.positionOx++;
      changeOxPos(elem.positionOx);
  
    } else if (elem.xDir == 'left') {
      elem.positionOx--;
      changeOxPos(elem.positionOx);
  
    }
    if (elem.yDir == 'down') {
      elem.positionOy++;
      changeOyPos(elem.positionOy);
    } else if (elem.yDir == 'up') {
      elem.positionOy--;
      changeOyPos(elem.positionOy);
    }
}// considering the direction of the ball, it adds or subtracts 1px on the Ox and Oy axis

const changeDirectionOfBall = (ballNr, direction) => {
    (direction == 'left' || direction == 'right') ?
      ballNr.xDir = direction :
      ballNr.yDir = direction;
  }

const getCurrentPosition = (ball) => {
    ball.bound = ball.getBoundingClientRect();
    bar.bound = bar.getBoundingClientRect();
  };// the position of the ball and the bar in real time
