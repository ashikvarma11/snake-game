import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
  HIT_OBJECT,
  BOOSTER_START,
  POISON_START,
  SCORE
} from "./constants";

import './App.css';
const App = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [booster, setBooster] = useState(BOOSTER_START);
  const [poison, setPoison] = useState(POISON_START);
  const [score, setScore] = useState(SCORE);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Defining colors as they are dynamically created inside canvas using JS.
  const snakeColor = '#5D5D5A';
  const appleColor = '#F85959';
  const boosterColor = '#30E3CA';
  const poisonColor = '#FEB062';
  useInterval(() => gameLoop(), speed);

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
  };

  const moveSnake = ({ keyCode }) =>
    keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);

  const createApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));
  
  const createBooster = () =>
    booster.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));
  
  const createPoison = () =>
    poison.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (piece, snk = snake) => {
    // I know there is a lot of else if hell here. I'll change it. Bear with me for now please.
    // Also need to check that posion, booster and apple don't come in the same position.
    if (piece[0] * SCALE >= CANVAS_SIZE[0]) return HIT_OBJECT.RIGHT;
    else if (piece[0] < 0) return HIT_OBJECT.LEFT;
    else if (piece[1] * SCALE >= CANVAS_SIZE[1]) return HIT_OBJECT.BOTTOM;
    else if (piece[1] < 0) return HIT_OBJECT.TOP;
    else if (piece[0] === poison[0] && piece[1] === poison[1]) return HIT_OBJECT.POISON;
    else if (piece[0] === booster[0] && piece[1] === booster[1]) return HIT_OBJECT.BOOSTER;


    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return HIT_OBJECT.SELF_HIT;
    }
    return false;
  };

  const checkAppleCollision = newSnake => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      // update score + 1
      setScore(prevScore=>prevScore+1);
      while (checkCollision(newApple, newSnake)) {
        
        newApple = createApple();
      }
      setApple(newApple);
      return true;
    }
    return false;
  };

  const boostScore = () => {
    setScore(prevScore=>prevScore+4);
    let newBooster = createBooster();
    setBooster(newBooster);
  }
 
  

  
  const gameLoop = () => {
    
    let atePoison = false;
    let isBoosted = false;
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    
    if (snakeCopy.length === 1) endGame();
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    switch (checkCollision(newSnakeHead)) {
      case HIT_OBJECT.RIGHT: snakeCopy[0][0] = 0; break;
      case HIT_OBJECT.LEFT: snakeCopy[0][0] = CANVAS_SIZE[0] / SCALE; break;
      case HIT_OBJECT.TOP: snakeCopy[0][1] = CANVAS_SIZE[1] / SCALE; break;
      case HIT_OBJECT.BOTTOM: snakeCopy[0][1] = 0; break;
      case HIT_OBJECT.SELF_HIT: endGame();break;
      case HIT_OBJECT.POISON: atePoison=true;break;
      case HIT_OBJECT.BOOSTER: boostScore();isBoosted = true;break;
      default: break;
    }

    if (atePoison) {
      snakeCopy.pop();
      let newPoison = createPoison();
      setPoison(newPoison);
    }

    if (isBoosted){
      snakeCopy.unshift(newSnakeHead);
    }

    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = snakeColor;
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = appleColor;
    context.fillRect(apple[0], apple[1], 1, 1);
    context.fillStyle = poisonColor;
    context.fillRect(poison[0], poison[1], 1, 1);
    context.fillStyle = boosterColor;
    context.fillRect(booster[0], booster[1], 1, 1);
  }, [snake, apple, gameOver,poison,booster]);

  return (
    <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)} className="wrapper">
      <div className="logo">SNAKE GAME</div>
      <div className="landing-text">
        <div className="score-section">
          <div className="score-label">SCORE</div>
          <div className="score-value">{score}</div>
        </div>
        <div className="rules-section">
          <div className="rules-heading">RULES</div>
          <div className="rules">
            <div className="rule"><span className="dot green"></span><span>Booster gives additional 4 points</span></div>
            <div className="rule"><span className="dot orange"></span>Eating Poison reduces length</div>
            <div className="rule"><span className="dot red"></span>Eating Apple gives you 1 point</div>
            <div className="rule">Game ends when length is less than 2 / snake hits itself / try to go reverse</div>
          </div>
        </div>
        <div className="start-btn" onClick={startGame} >START GAME</div>

      </div>
      <canvas
        className="canvas"
        style={{ border: "1px solid black" }}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      {gameOver && <div className="game-over">GAME OVER!</div>}
      
    </div>
  );
};

export default App;
