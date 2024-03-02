export default {
  HEIGHT: 700,
  WIDTH: 1100,
  SPEED: 6,
  GRAVITY: 0.8,
  player: {
    xAxisStart: 150,
    jumpNumber: 2,
    baseJumpSpeed: 250,
    velocityLoss: 0.4,
    mass: 2,
  },
  platForm: {
    gap: 100,
    start: 200,
    standard: {
      width: 300,
      height: 40,
    },
  },
  diamond: {
    side: 30,
    height: 50,
    nb: 4,
    gap: 30,
    points: 500,
  },
};
