import { AnimatedSprite, Assets, Container, Sprite } from 'pixi.js'
import { AppScreen } from '../models'
import * as MATTER from 'matter-js'
import gsap from 'gsap'
import PlatformManager from './components/PlatFormManager.ts'
import Player from './components/Player.ts'
import { inputManager } from '../utils/inputManager.ts'
import config from '../../gameConfig.ts'

export default class Game extends Container implements AppScreen {
  #physicEngine: Matter.Engine
  #backProps = new Container()
  #player: Player
  #platformManager: PlatformManager
  #isReady = false
  #isPaused = false
  #blockJump = false

  constructor() {
    super()
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

  async setBackground() {
    const texture = await Assets.load('backdrop')
    const skySprite = new Sprite(texture)

    const seaTextures = await Assets.load('seaProp')
    const seaSprite = new AnimatedSprite(seaTextures.animations['glitter'])
    seaSprite.anchor.set(0, 1)
    seaSprite.width = config.WIDTH
    seaSprite.position.set(0, config.HEIGHT)
    seaSprite.animationSpeed = 0.15
    this.addChild(skySprite, seaSprite)
    seaSprite.play()
  }

  async setBackProps(): Promise<void> {
    const texture = await Assets.load('backProps')
    const sprite = new Sprite(texture)
    sprite.height = config.HEIGHT * 1.1
    sprite.x = 0
    sprite.y = -config.HEIGHT * 0.1
    this.#backProps.addChild(sprite)
  }

  async initLevel() {
    await Assets.loadBundle('level')

    this.#platformManager = new PlatformManager(this.#physicEngine, this)

    this.#player = new Player(this.#physicEngine.world, this)

    this.#isReady = true
  }

  checkInputs() {
    if (inputManager.isSpacePressed() && !this.#blockJump) this.#player.setIsJumping(true)
    else this.#player.setIsJumping(false)
  }

  checkIfPlayerFell(): void {
    if (this.#player.hasFallen()) {
      this.#platformManager.setGameSpeed(0)
      this.#blockJump = true
    }
  }

  checkForCollisionWithPlatform() {
    this.#platformManager.getPlatformList().forEach(platform => {
      const collision = MATTER.Collision.collides(this.#player.getBody(), platform.getBody())
      if (collision?.collided && collision.normal.y === 1) this.#player.resetJump()
    })
  }

  update = () => {
    if (this.#isReady && !this.#isPaused) {
      const delta = gsap.ticker.deltaRatio()
      MATTER.Engine.update(this.#physicEngine, delta)
      this.#backProps.x -= 0.06 * delta
      this.checkInputs()
      this.checkForCollisionWithPlatform()
      this.#platformManager.update(delta)
      this.#player.update()
      this.checkIfPlayerFell()
    }
  }
}
