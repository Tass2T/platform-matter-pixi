const config = {
  HEIGHT: 720,
  WIDTH: 1280,
  SPEED: 4,
  GRAVITY: 1,
  DEBUG: false,
  COUNTDOWN: 3,
  props: {
    backPropSpeed: 0.06,
  },
  player: {
    xAxisStart: 150,
    baseJumpSpeed: 370,
    velocityLoss: 6,
    nbOfJumps: 2,
    jumpDelay: 300,
    height: 70,
    width: 40,
  },
  platForm: {
    gap: 120,
    start: 150,
    width: 327,
    height: 127,
    spaceFromCenter: 450,
  },
  diamond: {
    side: 35,
    height: 30,
    nb: 3,
    gap: 45,
    points: 500,
  },
  frontPropsWidth: 1080 * (1280 / 1080),
}

export default config
