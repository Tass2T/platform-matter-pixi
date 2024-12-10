import { AnimatedSprite, Assets, Container, Sprite, Spritesheet } from 'pixi.js'
import { AppScreen } from '../models'
import * as MATTER from 'matter-js'
import gsap from 'gsap'
import PlatformManager from './components/PlatFormManager.ts'
import Player from './components/Player.ts'
import config from '../../gameConfig.ts'
import { Render } from 'matter-js'

export default class Game extends Container implements AppScreen {
  #physicEngine: Matter.Engine
  #backProps = new Container({ isRenderGroup: true })
  #backPropsUsedKeys: Array<string> = []
  #backdropTextureKeys: Array<string> = []
  #player: Player
  #platformManager: PlatformManager
  #textureDatas: Spritesheet
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

    await this.initBackGroundProps()

    await this.initLevel()

    this.addChild(this.#backProps)
  }

  initEngine() {
    this.#physicEngine = MATTER.Engine.create()
    this.#physicEngine.enableSleeping = true
    this.#physicEngine.gravity.scale = config.GRAVITY

    if (config.DEBUG) {
      const render = Render.create({
        element: document.body,
        engine: this.#physicEngine,
      })
      Render.run(render)
    }
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
    this.#isReady = false
    this.#isPaused = true
  }

  reset = () => {
    this.#platformManager.resetPlatforms()
    this.#player.reset()
  }

  start = () => {
    this.#isReady = true
    this.#isPaused = false
    this.#player.start()
    this.#platformManager.setGameSpeed(config.SPEED)
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

  private async initBackGroundProps(): Promise<void> {
    this.#textureDatas = await Assets.load('backProps')
    this.#backdropTextureKeys = Object.keys(this.#textureDatas.textures)

    for (let i = 0; i < 3; i++) {
      const sprite = new Sprite(this.#textureDatas.textures[this.getPropLabel()])
      sprite.anchor.set(0, 1)
      const offsetPos = i === 0 ? 100 : 200
      sprite.position.set(1000 * i - offsetPos, config.HEIGHT)
      sprite.zIndex = Math.ceil(Math.random() * 10)
      this.#backProps.addChild(sprite)
    }
  }

  private async initLevel() {
    await Assets.loadBundle('level')

    this.#platformManager = new PlatformManager(this)
    await this.#platformManager.prepare()

    this.#player = new Player(this.#physicEngine, this)
    await this.#player.prepare()

    this.#isReady = true
    this.#player.start()
  }

  private moveBackdrop(delta: number) {
    this.#backProps.children.forEach(async child => {
      const childSprite = child as Sprite
      childSprite.position.x -= 0.6 * delta

      if (childSprite.position.x + childSprite.width <= 0) {
        const texturesData = await Assets.load('backProps')
        childSprite.position.x += childSprite.width * this.#backProps.children.length
        childSprite.zIndex = Math.ceil(Math.random() * 10)

        childSprite.texture = texturesData.textures[this.getPropLabel()]
      }
    })
  }

  private checkForCollisionWithDiamonds(): void {
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

  private getPropLabel = () => {
    let label = this.#backdropTextureKeys[Math.floor(Math.random() * this.#backdropTextureKeys.length)]
    while (this.#backPropsUsedKeys.includes(label)) {
      label = this.#backdropTextureKeys[Math.floor(Math.random() * this.#backdropTextureKeys.length)]
    }
    this.#backPropsUsedKeys.push(label)
    if (this.#backPropsUsedKeys.length === this.#backdropTextureKeys.length) this.clearUsedLabel(label)
    return label
  }

  private clearUsedLabel = (labelToKeep: string) => {
    this.#backPropsUsedKeys = [labelToKeep]
  }

  update = () => {
    if (this.#isReady && !this.#isPaused) {
      const delta = gsap.ticker.deltaRatio()
      this.moveBackdrop(delta)
      MATTER.Engine.update(this.#physicEngine, delta)
      this.#platformManager.update(delta)
      this.#player.update()
      this.checkForCollisionWithDiamonds()
    }
  }
}
