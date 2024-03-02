export default {
  HEIGHT: 800,
  WIDTH: 1300,
  SPEED: 10,
  GRAVITY: 1.2,
  MAXSPEED: 15,
  player: {
    xAxisStart: 150,
    baseJumpSpeed: 220,
    velocityLoss: 10,
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
