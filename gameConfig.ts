const config = {
  HEIGHT: 720,
  WIDTH: 1280,
  SPEED: 5,
  GRAVITY: 1.5,
  MAXSPEED: 25,
  COUNTDOWN: 3,
  props: {
    backPropSpeed: 0.02,
  },
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
