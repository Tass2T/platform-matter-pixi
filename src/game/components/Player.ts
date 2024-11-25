import * as MATTER from 'matter-js'
import { Spritesheet, Container, Assets, AnimatedSprite } from 'pixi.js'
import config from '../../../gameConfig.ts'
import { inputManager } from '../../utils/inputManager.ts'
import gsap from 'gsap'
import { Sleeping } from 'matter-js'

export default class Player {
  #isJumping: boolean = false
  #playerSpritesheet: Spritesheet
  #velocity: number = config.player.baseJumpSpeed
  #bodyHeight = config.player.height
  #body: MATTER.Body
  #sprite: AnimatedSprite
  #hasFallen: boolean = false

  constructor(physicEngineWorld: MATTER.World, parentContainer: Container) {
    this.#body = MATTER.Bodies.rectangle(config.player.xAxisStart, config.HEIGHT / 3, 40, 70, {
      inertia: -Infinity,
    })

    this.initSprite(parentContainer)
    MATTER.Composite.add(physicEngineWorld, this.#body)
  }

  getHasFallen = () => {
    return this.#hasFallen
  }

  getBody() {
    return this.#body
  }

  async initSprite(parentContainer: Container) {
    this.#playerSpritesheet = await Assets.load('player')

    this.#sprite = new AnimatedSprite(this.#playerSpritesheet.animations['run'])
    this.#sprite.height = this.#bodyHeight
    this.#sprite.anchor.set(0.5, 0.5)

    this.animateSprite()

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

  animateSprite(customSpeed: number = 0): void {
    this.#sprite.animationSpeed = customSpeed || 0.2
    this.#sprite.play()
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
    if (this.#body.position.y >= config.HEIGHT) {
      this.#hasFallen = true
      this.#sprite.stop()
      Sleeping.set(this.#body, true)
    }
  }

  update() {
    if (this.#sprite && this.#body) {
      this.syncSpriteWithBody()
      this.checkJumpAnimation()
      this.checkIfIsStillJumping()
      this.checkForInputs()
      this.checkIfPlayerHasFallen()
    }
  }
}
