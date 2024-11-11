import { Assets, Container, Sprite } from 'pixi.js'
import { AppScreen } from '../models'
import config from '../../gameConfig.ts'
import * as MATTER from 'matter-js'
import gsap from 'gsap'
import PlatformManager from './components/PlatFormManager.ts'
import Player from './components/Player.ts'

export default class Game extends Container implements AppScreen {
  #physicEngine: Matter.Engine
  #backProps = new Container()
  #frontPropsContainer = new Container({ isRenderGroup: true })
  #player: Player
  #platformManager: PlatformManager

  constructor() {
    super()

    this.initEngine()
    this.setBackProps()

    this.initLevel()

    this.addChild(this.#backProps)
  }

  initEngine() {
    this.#physicEngine = MATTER.Engine.create()
    this.#physicEngine.gravity.scale = config.GRAVITY
  }

  async setBackProps(): Promise<void> {
    const texture = await Assets.load('backProps')
    const sprite = new Sprite(texture)
    sprite.height = config.HEIGHT * 1.1
    sprite.x = 0
    sprite.y = -config.HEIGHT * 0.1
    this.#backProps.addChild(sprite)
  }

  async setFrontProps(): Promise<void> {
    const textures = await Assets.load(['trees'])

    const propsNeeded = 3
    const texturesKeys = Object.keys(textures.trees.data.frames)

    for (let i = 0; i < propsNeeded; i++) {
      const sprite = new Sprite(textures.trees.textures[texturesKeys[i]])
      sprite.anchor.set(0, 0.95)
      sprite.height = config.HEIGHT * 0.7
      sprite.width = config.WIDTH * 0.7
      sprite.zIndex = 3 - i
      sprite.position.set(i * config.frontPropsWidth, config.HEIGHT)

      this.#frontPropsContainer.addChild(sprite)
    }
  }

  async initLevel() {
    await Assets.loadBundle('level')

    this.#platformManager = new PlatformManager(this.#physicEngine, this)

    this.#player = new Player(this.#physicEngine.world, this)
  }

  update = () => {
    const delta = gsap.ticker.deltaRatio()
    this.#backProps.x -= 0.06 * delta
  }
}
