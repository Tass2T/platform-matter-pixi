export default {
  HEIGHT: 700,
  WIDTH: 1200,
  SPEED: 6,
  GRAVITY: 1.2,
  MAXSPEED: 15,
  PHYSIC_DEBUG_MODE: false,
  player: {
    xAxisStart: 150,
    baseJumpSpeed: 220,
    velocityLoss: 11,
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
