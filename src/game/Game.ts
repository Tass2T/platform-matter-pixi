import { AnimatedSprite, Assets, Container, Sprite } from 'pixi.js'
import { AppScreen } from '../models'
import * as MATTER from 'matter-js'
import gsap from 'gsap'
import PlatformManager from './components/PlatFormManager.ts'
import Player from './components/Player.ts'
import config from '../../gameConfig.ts'

export default class Game extends Container implements AppScreen {
  #physicEngine: Matter.Engine
  #backProps = new Container()
  #player: Player
  #platformManager: PlatformManager
  #backgroundSpeed = config.props.backPropSpeed
  #isReady = false
  #isPaused = false
  #score = 0

  constructor() {
    super()
    this.interactiveChildren = false
    this.initEngine()
  }

  async prepare(): Promise<void> {
    await this.setBackground()

    await this.setBackProps()

    await this.initLevel()

    this.addChild(this.#backProps)
  }

  initEngine() {
    this.#physicEngine = MATTER.Engine.create()
    this.#physicEngine.gravity.scale = config.GRAVITY
  }

  getPhysicEngine() {
    return this.#physicEngine
  }

  getPlayer() {
    return this.#player
  }

  getScore() {
    return this.#score
  }

  pause() {
    this.#platformManager.setGameSpeed(0)
    this.#backgroundSpeed = 0
  }

  private async setBackground() {
    const texture = await Assets.load('backdrop')
    const skySprite = new Sprite(texture)
    skySprite.zIndex = -3

    const seaTextures = await Assets.load('seaProp')
    const seaSprite = new AnimatedSprite(seaTextures.animations['glitter'])
    seaSprite.anchor.set(0, 1)
    seaSprite.width = config.WIDTH
    seaSprite.position.set(0, config.HEIGHT)
    seaSprite.animationSpeed = 0.15
    seaSprite.zIndex = -2
    this.addChild(skySprite, seaSprite)
    seaSprite.play()
  }

  private async setBackProps(): Promise<void> {
    const texture = await Assets.load('backProps')
    const sprite = new Sprite(texture)
    sprite.height = config.HEIGHT * 1.1
    sprite.x = 0
    sprite.y = -config.HEIGHT * 0.1
    this.#backProps.zIndex = -1
    this.#backProps.addChild(sprite)
  }

  private async initLevel() {
    await Assets.loadBundle('level')

    this.#platformManager = new PlatformManager(this)

    this.#player = new Player(this.#physicEngine.world, this)

    this.#isReady = true
  }

  checkForCollisionWithDiamonds(): void {
    this.#platformManager.getPlatformList().forEach(platForm => {
      platForm.getDiamondList().forEach(diamond => {
        const collision = MATTER.Collision.collides(this.#player.getBody(), diamond.getBody())
        if (collision?.collided && !diamond.getHasBeenTaken()) {
          diamond.setHasBeenTaken(true)
          this.#score += config.diamond.points
          this.#platformManager.increaseGamespeed()
        }
      })
    })
  }

  update = () => {
    if (this.#isReady && !this.#isPaused) {
      const delta = gsap.ticker.deltaRatio()
      MATTER.Engine.update(this.#physicEngine, delta)
      this.#backProps.x -= this.#backgroundSpeed * delta
      this.#platformManager.update(delta)
      this.checkForCollisionWithDiamonds()
      this.#player.update()
    }
  }
}
