import { AnimatedSprite, Assets, Container, Sprite, Text } from 'pixi.js'
import config from '../../../../gameConfig.ts'
import ScoreBoard from '../../components/scoreBoard'
import GameState from '../../traits/GameState'

export default class Menu extends GameState {
  #seconds = 0
  #eyeCounts = 0
  #charContainer = new Container()
  #eyes: AnimatedSprite
  #lArm: Sprite
  #rArm: Sprite
  #text: Text
  #subTitle: Text
  #isReady = false
  constructor(parentContainer: Container, changeState: Function, scoreBoard: ScoreBoard) {
    super(parentContainer, changeState, scoreBoard)
    this._stateContainer.zIndex = 1
    this.initBackground().then(() => {
      this.initText().then(() => (this.#isReady = true))
    })
  }

  async initBackground() {
    const menubundle = await Assets.loadBundle('menu')

    const textureSprite = new Sprite(menubundle.background)
    textureSprite.position.set(0, 0)
    textureSprite.height = config.HEIGHT
    textureSprite.width = config.WIDTH

    const eyes = new AnimatedSprite(menubundle.persoEyes.animations.blink)
    eyes.zIndex = 6
    eyes.anchor.set(0.5)
    eyes.position.set(config.WIDTH / 2 + 65, config.HEIGHT / 2 - 110)
    eyes.width = eyes.width * 0.3
    eyes.height = eyes.height * 0.3
    eyes.loop = false
    eyes.animationSpeed = 1.4
    eyes.onComplete = () => eyes.gotoAndStop(0)
    this.#eyes = eyes

    const persoSprite = new Sprite(menubundle.persoBody)
    persoSprite.anchor.set(0.5, 0.5)
    persoSprite.height = 500
    persoSprite.width = 500
    persoSprite.zIndex = 3
    persoSprite.position.set(config.WIDTH / 2, config.HEIGHT / 2)

    const leftArm = new Sprite(menubundle.lArm)
    leftArm.anchor.set(1, 0.5)
    leftArm.height = persoSprite.height * 0.35
    leftArm.width = leftArm.height
    leftArm.position.set(persoSprite.x - 70, config.HEIGHT / 2.2)
    leftArm.angle = 15
    leftArm.zIndex = 4
    this.#lArm = leftArm

    const rightArm = new Sprite(menubundle.rArm)
    rightArm.anchor.set(0, 0.5)
    rightArm.height = persoSprite.height * 0.35
    rightArm.width = rightArm.height
    rightArm.position.set(config.WIDTH / 1.83, config.HEIGHT / 2.5)
    rightArm.zIndex = 2
    this.#rArm = rightArm

    this.#charContainer.addChild(textureSprite, persoSprite, leftArm, rightArm, eyes)
    this._stateContainer.addChild(this.#charContainer)
  }

  async initText() {
    const fonts = await Assets.loadBundle('fonts')

    this.#text = new Text({
      text: 'KIWI RUN',
      style: {
        fontFamily: fonts.title.family,
        fontSize: config.HEIGHT / 5,
        fill: '#65ca00',
        padding: 30,
        dropShadow: {
          distance: 10,
          color: '#ffffff',
          angle: Math.PI * 12,
        },
      },
    })

    this.#text.position.set(30, 0)
    this.#text.zIndex = 30
    this.#text.rotation = -0.05

    this.#subTitle = new Text({
      text: "Appuyerz sur n'importe quel touche pour débuter !!",
      style: {
        fontFamily: fonts.msgText.family,
        fontSize: config.HEIGHT / 24,
        fill: '#ffffff',
        dropShadow: {
          distance: 3,
          angle: Math.PI * 12,
          color: '#53a400',
        },
      },
    })

    this.#subTitle.anchor.set(0.5, 1)
    this.#subTitle.zIndex = 30
    this.#subTitle.position.set(config.WIDTH / 2, config.HEIGHT * 0.9)

    this._stateContainer.addChild(this.#text, this.#subTitle)
  }

  start() {
    return
  }

  animateBody(delta: number) {
    if (Math.floor(this.#eyeCounts) === 3) {
      this.#eyes.play()
      this.#eyeCounts = 0
    }

    this.#subTitle.width = this.#subTitle.width + Math.cos(this.#seconds) * delta
    this.#lArm.angle = 15 + Math.sin(this.#seconds) * 5
    this.#rArm.angle = 15 + Math.cos(this.#seconds) * 3
  }

  leave() {
    this.switchVisibility()
    this._changeState('level')
  }

  update(delta: number, inputArrays: Array<String>) {
    if (this.#isReady) {
      if (inputArrays.length) this.leave()

      this.animateBody(delta)

      this.#seconds += (1 / 60) * delta
      this.#eyeCounts += (1 / 60) * delta
    }
  }

  destroy() {
    this.#seconds = 0
    this.#eyeCounts = 0
  }
}
