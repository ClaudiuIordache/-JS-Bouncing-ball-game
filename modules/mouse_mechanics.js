import {root,bar} from "./dom_variables.js"
import {containerBorder,containerBound } from "../game/script.js";



//^---------------------------------------------------
//^------------------ Mouse mechanics ----------------
//^---------------------------------------------------


let mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2,
  };

const mouseInit = () => {
    addEventListener("mousemove", (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });
  }
  
  
  const moveBarWithMouse = () => {
    if (mouse.x > containerBound.left + (bar.width / 2) + containerBorder
      && mouse.x < containerBound.right - (bar.width / 2) - containerBorder) {
      bar.position = mouse.x - (bar.width / 2) - containerBound.left - containerBorder;
      root.style.setProperty('--bar-position', bar.position);
    }
  }

  export {mouseInit,moveBarWithMouse}