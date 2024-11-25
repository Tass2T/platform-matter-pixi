import { Container, Graphics, BitmapText, Assets, Sprite, AnimatedSprite } from 'pixi.js'
import config from '../../../gameConfig.ts'
import { AppScreen } from '../../models'
import { inputManager } from '../../utils/inputManager.ts'
import gsap from 'gsap'

export default class GameOver extends Container implements AppScreen {
  #isActive: boolean = false
  #curtainContainer: Container = new Container()
  #scoreContainer: Container = new Container()
  #illustrationContainer: Container = new Container()
  #msgContainer: Container = new Container()

  #yellowRectScreen: Graphics = new Graphics()
  #greenRectScreen: Graphics = new Graphics()
  #textMessageBg: Graphics = new Graphics()
  #yellowCircle: Graphics = new Graphics()
  #yellowCircleMask: Graphics = new Graphics()

  #counter: number = 0

  #animationProcess: number = 0

  #scoreText: BitmapText
  #textMessage: BitmapText
  #shadowTextMessage: BitmapText

  #timeline = gsap.timeline()

  #illustration: {
    illu: Sprite
    eyeAnim?: AnimatedSprite
  }

  constructor() {
    super()

    this.visible = false
    this.addChild(this.#curtainContainer, this.#scoreContainer, this.#illustrationContainer, this.#msgContainer)
    this.initCurtains()
    this.initIllustration()
    this.setMessage()
    this.setTimeline()
  }

  initCurtains() {
    this.#yellowRectScreen
      .rect(config.WIDTH / 2, config.HEIGHT / 2, config.WIDTH + config.WIDTH / 2, config.HEIGHT + config.HEIGHT / 2)
      .fill('#e7e700')
    this.#yellowRectScreen.zIndex = 1

    this.#scoreText = new BitmapText({
      text: '0',
      style: {
        fontFamily: 'Arial',
        fontSize: 56,
        fill: 'white',
        letterSpacing: 2,
      },
    })

    this.#scoreText.zIndex = 2
    this.#scoreText.position.set(config.WIDTH + 80, config.HEIGHT / 2.5)
    this.#scoreText.skew.y = -0.01

    this.#greenRectScreen
      .rect(config.WIDTH / 2, config.HEIGHT / 2, config.WIDTH + config.WIDTH / 2, config.HEIGHT + config.HEIGHT / 2)
      .fill('#49c800')
    this.#greenRectScreen.zIndex = 3
    this.#curtainContainer.addChild(this.#greenRectScreen, this.#yellowRectScreen, this.#scoreText)
    this.#curtainContainer.pivot.set(this.#curtainContainer.width / 2, 0)
    this.#curtainContainer.rotation += 50.06
    this.#curtainContainer.position.y = -28
    this.#curtainContainer.position.x += this.#curtainContainer.width
  }

  async initIllustration() {
    this.#illustration = {
      illu: new Sprite(),
    }
    const illustrationAsset = await Assets.load(['gameOverIllu', 'gameOverIlluEyes'])

    this.#illustration.illu = Sprite.from(illustrationAsset.gameOverIllu)

    this.#illustration.illu.anchor.set(0.5)
    this.#illustration.illu.position.set(config.WIDTH * 0.7, config.HEIGHT * 0.6)
    this.#illustration.eyeAnim = new AnimatedSprite(illustrationAsset.gameOverIlluEyes.animations['open'])
    this.#illustration.eyeAnim.zIndex = 3
    this.#illustration.eyeAnim.anchor.set(0.5)
    this.#illustration.eyeAnim.position.set(config.WIDTH * 0.7, config.HEIGHT * 0.6)
    this.#illustration.eyeAnim.loop = false
    this.#illustration.eyeAnim.animationSpeed = 0.4
    this.#illustrationContainer.addChild(this.#illustration.illu, this.#illustration.eyeAnim)
  }

  start = (playerScore: number) => {
    this.visible = true
    this.#scoreText.text = playerScore ? `${playerScore}` : '0'
    this.#timeline.play()
  }

  getIsActive = () => {
    return this.#isActive
  }

  setMessage() {
    const message = 'Maintenez le bouton Espace pour relancer!!'
    this.#textMessage = new BitmapText({
      text: message,
      style: {
        fontFamily: 'Arial',
        fontSize: 26,
        fill: 'white',
        letterSpacing: 2,
      },
    })

    this.#shadowTextMessage = new BitmapText({
      text: message,
      style: {
        fontFamily: 'Arial',
        fontSize: 26,
        fill: 0x49c801,
        letterSpacing: 2,
      },
    })

    this.#textMessage.position.set(config.WIDTH * 0.05, config.HEIGHT * 0.85)
    this.#shadowTextMessage.position.set(config.WIDTH * 0.05, config.HEIGHT * 0.85)
    this.#textMessage.zIndex = 12
    this.#shadowTextMessage.zIndex = 13

    this.#shadowTextMessage.mask = this.#yellowCircleMask

    this.#msgContainer.addChild(
      this.#textMessage,
      this.#shadowTextMessage,
      this.#textMessageBg,
      this.#yellowCircle,
      this.#yellowCircleMask
    )
  }

  resetVariablesAndElements() {
    this.#animationProcess = 0

    this.#scoreText.position.x = config.WIDTH + 80
    this.#curtainContainer.position.x = config.WIDTH
    this.#curtainContainer.position.y = -28
    this.#yellowRectScreen.rotation = 0

    this.#illustration.eyeAnim?.gotoAndStop(0)
  }

  incrementConter(value: number): void {
    this.#counter += value

    if (this.#counter < 0) this.#counter = 0
  }

  moveScore(delta: number) {
    if (this.#scoreText.position.x > config.WIDTH) this.#scoreText.position.x -= 20 * delta
    else {
      this.#textMessage.visible = true
      this.#shadowTextMessage.visible = true
      this.#illustrationContainer.visible = true
      setTimeout(() => this.#illustration.eyeAnim?.play(), 2000)
      this.#animationProcess++
    }
  }

  setTimeline() {
    this.#timeline.pause()
    this.#timeline.to(this.#curtainContainer, { x: -120, duration: 0.6 })
    this.#timeline.to(this.#yellowRectScreen, { angle: -Math.PI * 2, duration: 0.4 })
    this.#timeline.fromTo(this.#textMessage, { pixi: { alpha: 0, x: 100 } }, { pixi: { alpha: 1, x: 40 } })
    this.#timeline.fromTo(
      this.#scoreText,
      { pixi: { alpha: 0, x: config.WIDTH + 140 } },
      { pixi: { alpha: 1, x: config.WIDTH + 80 }, duration: 0.3 }
    )
  }

  syncYellowCircle() {
    this.#yellowCircle.clear()
    this.#yellowCircleMask.clear()

    this.#yellowCircle
      .circle(config.WIDTH * 0.35, config.HEIGHT * 0.86, 50 + Math.floor(this.#counter * 8))
      .fill(0xffff00)

    this.#yellowCircleMask
      .circle(config.WIDTH * 0.35, config.HEIGHT * 0.86, 50 + Math.floor(this.#counter * 8))
      .fill(0x000000)
  }

  leaveScreen() {
    this.#counter = 0
    this.resetVariablesAndElements()
  }

  update() {
    if (this.#counter > 100) this.leaveScreen()
    if (inputManager.getPressedInputs().includes('Space')) {
      this.incrementConter(4)
    } else if (this.#counter > 0) {
      this.incrementConter(-4)
    }
    this.syncYellowCircle()
  }
}
