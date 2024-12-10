import { Spritesheet, Container, Assets, AnimatedSprite } from 'pixi.js'
import config from '../../../gameConfig.ts'
import { inputManager } from '../../utils/inputManager.ts'
import gsap from 'gsap'
import { AppScreen } from '../../models'
import { Sleeping, Body, Engine, Bodies, Composite, Vector } from 'matter-js'

export default class Player {
  #parentContainer: AppScreen
  #engine: Engine
  #isJumping: boolean = false
  #playerSpritesheet: Spritesheet
  #velocity: number = config.player.baseJumpSpeed
  #bodyHeight = config.player.height
  #body: Body
  #sprite: AnimatedSprite
  #hasFallen: boolean = false

  constructor(physicEngine: Engine, parentContainer: Container) {
    this.#parentContainer = parentContainer
    this.#engine = physicEngine
  }

  prepare = async () => {
    this.#body = Bodies.rectangle(config.player.xAxisStart, config.HEIGHT / 3, 40, 70, {
      inertia: -Infinity,
      isSleeping: true,
    })
    Composite.add(this.#engine.world, this.#body)

    await this.initSprite(this.#parentContainer)
  }

  getHasFallen = () => {
    return this.#hasFallen
  }

  getBody() {
    return this.#body
  }

  reset = () => {
    Sleeping.set(this.#body, true)
    Body.setPosition(this.#body, Vector.create(config.player.xAxisStart, config.HEIGHT / 3))
    this.#body.velocity.x = 0
    this.#body.velocity.y = 0
    this.syncSpriteWithBody()
    this.#hasFallen = false
    this.#isJumping = false
  }

  start = () => {
    Sleeping.set(this.#body, false)
    this.#body.velocity.x = 0
    this.#body.velocity.y = 0
    this.#sprite.gotoAndPlay(0)
  }

  async initSprite(parentContainer: Container) {
    this.#playerSpritesheet = await Assets.load('player')

    this.#sprite = new AnimatedSprite(this.#playerSpritesheet.animations['run'])
    this.#sprite.animationSpeed = 0.2
    this.#sprite.height = this.#bodyHeight
    this.#sprite.anchor.set(0.5, 0.5)
    this.#sprite.zIndex = 10

    this.syncSpriteWithBody()
    parentContainer.addChild(this.#sprite)
  }

  setIsJumping(value: boolean): void {
    this.#isJumping = value
    if (this.#isJumping) {
      this.#sprite.textures = this.#playerSpritesheet.animations['jump']
      this.#sprite.gotoAndStop(0)
    } else {
      this.#sprite.textures = this.#playerSpritesheet.animations['run']
      this.#sprite.gotoAndPlay(0)
    }
  }

  checkJumpAnimation() {
    if (this.#body.velocity.y > 0 && !this.#sprite.playing) {
      this.startAnimation('fall')
    }
  }

  startAnimation(name: string) {
    this.#sprite.textures = this.#playerSpritesheet.animations[name]
    this.#sprite.gotoAndPlay(0)
  }

  addVelocity(): void {
    if (this.#body.velocity.y <= 0 && this.#body.velocity.y > -2) {
      this.setIsJumping(true)
    }

    if (this.#isJumping && this.#velocity) {
      const delta = gsap.ticker.deltaRatio()
      this.#velocity -= config.player.velocityLoss * delta

      Body.setVelocity(this.#body, {
        x: 0,
        y: -this.#velocity,
      })
    }
  }

  syncSpriteWithBody(): void {
    if (this.#sprite && this.#body) {
      this.#sprite.position.x = this.#body.position.x
      this.#sprite.position.y = this.#body.position.y
    }
  }

  checkForInputs() {
    if (inputManager.isSpacePressed()) this.addVelocity()
    else if (!inputManager.isSpacePressed() && this.#isJumping) this.#velocity = 0
  }

  checkIfIsStillJumping() {
    if (this.#isJumping && this.#body.velocity.y === 0) {
      this.setIsJumping(false)
      this.#velocity = config.player.baseJumpSpeed
    }
  }

  checkIfPlayerHasFallen() {
    if (this.#body.position.y >= config.HEIGHT || this.#body.position.x < 0) {
      this.#hasFallen = true
      Sleeping.set(this.#body, true)
      this.#sprite.stop()
    }
  }

  update() {
    if (this.#sprite && this.#body && !this.#hasFallen) {
      this.syncSpriteWithBody()
      this.checkJumpAnimation()
      this.checkIfIsStillJumping()
      this.checkForInputs()
      this.checkIfPlayerHasFallen()
    }
  }
}
