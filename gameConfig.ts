const playWidth = window.innerWidth > 1920 ? 1920 : window.innerWidth

const config = {
  HEIGHT: window.innerHeight,
  WIDTH: playWidth,
  SPEED: 8,
  GRAVITY: 1.3,
  MAXSPEED: 20,
  COUNTDOWN: 3,
  PHYSIC_DEBUG_MODE: false,
  player: {
    xAxisStart: 150,
    baseJumpSpeed: 280,
    velocityLoss: 11,
    height: playWidth * 0.06,
    width: playWidth * 0.05,
  },
  platForm: {
    balloonNb: 6,
    gap: 100,
    start: playWidth * 0.15,
    width: playWidth * 0.23,
    height: innerHeight * 0.1,
    spaceFromCenter: 500,
  },
  diamond: {
    side: playWidth / 35,
    height: 30,
    nb: 3,
    gap: playWidth / 25,
    points: 500,
  },
}

export default config
