interface configType {
  HEIGHT: number
  WIDTH: number
  SPEED: number
  GRAVITY: number
  MAXSPEED: number
  COUNTDOWN: number
  PHYSIC_DEBUG_MODE: boolean
  player: {
    xAxisStart: number
    baseJumpSpeed: number
    velocityLoss: number
  }
  platForm: {
    gap: number
    start: number
    standard: {
      width: number
      height: number
    }
  }
  diamond: {
    side: number
    height: number
    nb: number
    gap: number
    points: number
  }
}

const config: configType = {
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
    gap: 100,
    start: 200,
    standard: {
      width: 300,
      height: 40,
    },
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
