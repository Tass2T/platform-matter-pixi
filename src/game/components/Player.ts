import * as MATTER from 'matter-js'
import { Spritesheet, Container, Assets, AnimatedSprite } from 'pixi.js'
import config from '../../../gameConfig.ts'
import { inputManager } from '../../utils/inputManager.ts'
import gsap from 'gsap'
import { Sleeping } from 'matter-js'
import { AppScreen } from '../../models'

export default class Player {
  #parentContainer: AppScreen
  #engine: MATTER.Engine
  #isJumping: boolean = false
  #playerSpritesheet: Spritesheet
  #velocity: number = config.player.baseJumpSpeed
  #bodyHeight = config.player.height
  #body: MATTER.Body
  #sprite: AnimatedSprite
  #hasFallen: boolean = false

  constructor(physicEngine: MATTER.Engine, parentContainer: Container) {
    this.#parentContainer = parentContainer
    this.#engine = physicEngine
  }

  prepare = async () => {
    this.#body = MATTER.Bodies.rectangle(config.player.xAxisStart, config.HEIGHT / 3, 40, 70, {
      inertia: -Infinity,
      isSleeping: true,
    })
    MATTER.Composite.add(this.#engine.world, this.#body)

    await this.initSprite(this.#parentContainer)
  }

  start = () => {
    this.#sprite.play()
  }

  getHasFallen = () => {
    return this.#hasFallen
  }

  getBody() {
    return this.#body
  }

  getSprite = () => {
    return this.#sprite
  }

  reset = () => {
    this.#body.position.x = config.player.xAxisStart
    this.#body.position.y = config.HEIGHT / 3
    this.#hasFallen = false
    this.syncSpriteWithBody()
  }

  async initSprite(parentContainer: Container) {
    this.#playerSpritesheet = await Assets.load('player')

    this.#sprite = new AnimatedSprite(this.#playerSpritesheet.animations['run'])
    this.#sprite.visible = false
    this.#sprite.animationSpeed = 0.2
    this.#sprite.height = this.#bodyHeight
    this.#sprite.anchor.set(0.5, 0.5)

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

      MATTER.Body.setVelocity(this.#body, {
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
      this.#sprite.stop()
      Sleeping.set(this.#body, true)
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
