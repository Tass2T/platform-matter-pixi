import { Container, Graphics, BitmapText } from 'pixi.js'
import config from '../../../gameConfig.ts'
import { AppScreen } from '../../models'
import { inputManager } from '../../utils/inputManager.ts'
import gsap from 'gsap'

export default class GameOver extends Container implements AppScreen {
  #isActive: boolean = false
  #isLeaving: boolean = false
  #curtainContainer: Container = new Container()
  #scoreContainer: Container = new Container()
  #illustrationContainer: Container = new Container()
  #msgContainer: Container = new Container()

  #yellowRectScreen: Graphics = new Graphics()
  #greenRectScreen: Graphics = new Graphics()
  #textMessageBg: Graphics = new Graphics()
  #yellowCircle: Graphics = new Graphics()

  #counter: number = 0

  #resetCallBack: () => void

  #scoreText = new BitmapText({
    text: ``,
    style: {
      fontFamily: 'Arial',
      fontSize: 56,
      fill: 'white',
      letterSpacing: 2,
    },
  })
  #textMessage: BitmapText

  #timeline = gsap.timeline({
    onReverseComplete: () => {
      this.visible = false
      this.#isActive = false
      this.#isLeaving = false
    },
  })

  constructor(resetCallback: () => void) {
    super()
    this.#resetCallBack = resetCallback
    this.setMessage()
    this.initCurtains()
    this.visible = false
    this.setTimeline()
    this.addChild(this.#curtainContainer, this.#scoreContainer, this.#illustrationContainer, this.#msgContainer)
  }

  initCurtains() {
    this.#yellowRectScreen
      .rect(config.WIDTH / 2, config.HEIGHT / 2, config.WIDTH + config.WIDTH / 2, config.HEIGHT + config.HEIGHT / 2)
      .fill('#e7e700')
    this.#yellowRectScreen.zIndex = 1

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

  start = (playerScore: number) => {
    this.visible = true
    this.#isActive = true
    this.#scoreText.text = playerScore ? `${playerScore}` : '0'
    this.#timeline.play()
  }

  getIsActive = () => {
    return this.#isActive
  }

  setIsActive = (value: boolean) => {
    this.#isActive = value
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

    this.#textMessage.position.set(config.WIDTH * 0.05, config.HEIGHT * 0.85)
    this.#textMessage.zIndex = 12

    this.#msgContainer.addChild(this.#textMessage, this.#textMessageBg, this.#yellowCircle)
  }

  incrementCounter(value: number): void {
    this.#counter += value

    if (this.#counter < 0) this.#counter = 0
  }

  setTimeline() {
    this.#timeline.pause()
    this.#timeline.to(this.#curtainContainer, { x: -120, duration: 0.2 })
    this.#timeline.to(this.#yellowRectScreen, { angle: -Math.PI * 2, duration: 0.1 })
    this.#timeline.fromTo(
      this.#textMessage,
      { pixi: { alpha: 0, x: 100 } },
      { pixi: { alpha: 1, x: 40 }, duration: 0.1 }
    )
    this.#timeline.to(this.#textMessage, { pixi: { alpha: 1 }, duration: 0.1 })
    this.#timeline.fromTo(
      this.#scoreText,
      { pixi: { alpha: 0, x: config.WIDTH + 140 } },
      { pixi: { alpha: 1, x: config.WIDTH + 80 }, duration: 0.3 }
    )
    this.#timeline.fromTo(
      this.#yellowCircle,
      { pixi: { alpha: 0, x: -200 } },
      { pixi: { alpha: 1, x: 0 }, duration: 0.1 }
    )
  }

  syncYellowCircle() {
    this.#yellowCircle.clear()
    this.#yellowCircle.circle(config.WIDTH, config.HEIGHT, 120 + Math.floor(this.#counter * 8)).fill(0xffff00)
  }

  leaveScreen = () => {
    this.#isLeaving = true
    this.#counter = 0
    this.#resetCallBack()
    this.#timeline.reverse(0)
  }

  update() {
    if (this.#counter >= 100) {
      this.leaveScreen()
      return
    }
    if (!this.#isLeaving) {
      if (inputManager.isSpacePressed()) {
        this.incrementCounter(2)
      } else if (this.#counter > 0) {
        this.incrementCounter(-2)
      }
      this.syncYellowCircle()
    }
  }
}
