import { AnimatedSprite, Assets, Container, Sprite, Text } from 'pixi.js'
import config from '../../gameConfig.ts'
import { AppScreen } from '../models'
import { inputManager } from '../utils/inputManager.ts'
import { navigation } from '../Navigation.ts'
import GameState from './GameState.ts'
import gsap from 'gsap'

export default class MenuState extends Container implements AppScreen {
  #charContainer = new Container()
  #eyes: AnimatedSprite
  #lArm: Sprite
  #rArm: Sprite
  #text: Text
  #subTitle: Text

  constructor() {
    super()
  }

  prepare(): Promise<void> {
    return new Promise(async resolve => {
      await this.initArt()
      await this.initText()
      this.animate()
      resolve()
    })
  }

  async initArt() {
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
    leftArm.width = persoSprite.height * 0.35
    leftArm.position.set(persoSprite.x - 80, config.HEIGHT / 2.2)
    leftArm.angle = 15
    leftArm.zIndex = 4
    this.#lArm = leftArm

    const rightArm = new Sprite(menubundle.rArm)
    rightArm.anchor.set(0, 0.5)
    rightArm.height = persoSprite.height * 0.35
    rightArm.width = persoSprite.height * 0.35
    rightArm.position.set(config.WIDTH / 1.83, config.HEIGHT / 2.5)
    rightArm.zIndex = 2
    this.#rArm = rightArm

    this.#charContainer.addChild(textureSprite, persoSprite, leftArm, rightArm, eyes)
    this.addChild(this.#charContainer)
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

    this.addChild(this.#text, this.#subTitle)
  }

  animate() {
    setInterval(() => this.#eyes.gotoAndPlay(0), 4000)
    gsap.to(this.#subTitle, { pixi: { scale: 1.1 }, duration: 2, repeat: -1, yoyo: true })
    gsap.to(this.#lArm, { pixi: { rotation: 10 }, duration: 1, repeat: -1, yoyo: true })
    gsap.to(this.#rArm, { pixi: { rotation: -4 }, duration: 1.3, repeat: -1, yoyo: true })
  }

  update = () => {
    if (inputManager.getPressedInputs().length) navigation.goToScreen(new GameState())
  }
}
