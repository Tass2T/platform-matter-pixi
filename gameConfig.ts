const playWidth = window.innerWidth > 1920 ? 1920 : window.innerWidth

const config = {
  HEIGHT: window.innerHeight,
  WIDTH: playWidth,
  SPEED: 6,
  GRAVITY: 1.2,
  MAXSPEED: 15,
  COUNTDOWN: 3,
  PHYSIC_DEBUG_MODE: false,
  player: {
    xAxisStart: 150,
    baseJumpSpeed: 220,
    velocityLoss: 11,
    height: playWidth * 0.07,
    width: playWidth * 0.05,
  },
  platForm: {
    balloonNb: 6,
    gap: playWidth / 18,
    start: playWidth * 0.15,
    width: playWidth * 0.23,
    height: innerHeight * 0.1,
  },
  diamond: {
    side: playWidth / 35,
    height: 1000,
    nb: 3,
    gap: playWidth / 23,
    points: 500,
  },
}

export default config
