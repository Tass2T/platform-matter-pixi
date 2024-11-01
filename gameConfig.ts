const config = {
  HEIGHT: 720,
  WIDTH: 1280,
  SPEED: 5,
  GRAVITY: 1.5,
  MAXSPEED: 25,
  COUNTDOWN: 3,
  PHYSIC_DEBUG_MODE: false,
  player: {
    xAxisStart: 150,
    baseJumpSpeed: 260,
    velocityLoss: 11,
    height: 70,
    width: 40,
  },
  platForm: {
    balloonNb: 7,
    gap: 90,
    start: 150,
    width: 300,
    height: 50,
    spaceFromCenter: 450,
  },
  diamond: {
    side: 35,
    height: 30,
    nb: 3,
    gap: 45,
    points: 500,
  },
  frontPropsWidth: 1080 * (window.innerWidth / 1080),
}

export default config
