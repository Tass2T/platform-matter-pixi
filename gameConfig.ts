const config = {
  HEIGHT: window.innerHeight,
  WIDTH: window.innerWidth > 1920 ? 1920 : window.innerWidth,
  SPEED: 6,
  GRAVITY: 1.2,
  MAXSPEED: 15,
  COUNTDOWN: 3,
  PHYSIC_DEBUG_MODE: false,
  player: {
    xAxisStart: 150,
    baseJumpSpeed: 220,
    velocityLoss: 11,
  },
  platForm: {
    balloonNb: 6,
    gap: 100,
    start: 200,
    width: 300,
    height: 40,
  },
  diamond: {
    side: 35,
    height: 35,
    nb: 3,
    gap: 40,
    points: 500,
  },
}

export default config
