const CANVAS_SIZE = [800, 800];
const SNAKE_START = [
  [8, 7],
  [8, 8]
];
const APPLE_START = [8, 3];
const SCALE = 40;
const SPEED = 100;
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0] // right
};

const HIT_OBJECT = {
  LEFT: 0,
  TOP: 1,
  RIGHT: 2,
  BOTTOM:3,
  SELF_HIT: 4,
  POISON:5,
  BOOSTER:6
}

const POISON_START = [12,7];
const BOOSTER_START = [1,12];
const SCORE = 0;
export {
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
};
