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
    gap: playWidth / 12,
    start: playWidth * 0.2,
    width: playWidth * 0.23,
    height: innerHeight * 0.1,
  },
  diamond: {
    side: playWidth / 35,
    height: playWidth / 35,
    nb: 3,
    gap: playWidth / 30,
    points: 500,
  },
}

export default config
