import * as MATTER from 'matter-js'
import { Spritesheet, Container, Assets, AnimatedSprite } from 'pixi.js'
import config from '../../../gameConfig.ts'
import { inputManager } from '../../utils/inputManager.ts'

export default class Player {
  #isJumping: boolean = false
  #playerSpritesheet: Spritesheet
  #velocity: number = config.player.baseJumpSpeed
  #bodyHeight = config.player.height
  #body: MATTER.Body
  #sprite: AnimatedSprite

  constructor(physicEngineWorld: MATTER.World, parentContainer: Container) {
    this.#body = MATTER.Bodies.rectangle(config.player.xAxisStart, config.HEIGHT / 3, 40, 70, {
      inertia: -Infinity,
    })

    this.initSprite(parentContainer)
    MATTER.Composite.add(physicEngineWorld, this.#body)
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
      //@ts-ignore
      this.#sprite.textures = this.#playerSpritesheet.animations['jump']
      //@ts-ignore
      this.#sprite.gotoAndStop(0)
    } else {
      //@ts-ignore
      this.#sprite.textures = this.#playerSpritesheet.animations['run']
      //@ts-ignore
      this.#sprite.gotoAndPlay(0)
    }
  }

  checkJumpAnimation() {
    //@ts-ignore
    if (this.#body.velocity.y > 0 && !this.#sprite.playing) {
      this.startAnimation('fall')
    }
  }

  startAnimation(name: string) {
    //@ts-ignore
    this.#sprite.textures = this.#playerSpritesheet.animations[name]
    //@ts-ignore
    this.#sprite.gotoAndPlay(0)
  }

  addVelocity(): void {
    if (this.#body.velocity.y === 0) this.#velocity = config.player.baseJumpSpeed

    this.#velocity -= config.player.velocityLoss

    MATTER.Body.setVelocity(this.#body, {
      x: 0,
      y: -this.#velocity,
    })
  }

  stopVelocity(): void {
    this.#velocity = 0
    this.setIsJumping(false)
  }

  resetJump(): void {
    if (this.#isJumping) {
      this.#velocity = config.player.baseJumpSpeed
    }
  }

  hasFallen(): boolean {
    return this.#body.position.y >= config.HEIGHT || this.#body.position.x <= 0
  }

  reset() {
    const x = config.player.xAxisStart
    const y = config.HEIGHT / 3
    MATTER.Body.setPosition(this.#body, { x, y })
    this.#sprite.position.set(x, y)
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
  }

  update() {
    if (this.#sprite && this.#body) {
      this.syncSpriteWithBody()
      this.checkJumpAnimation()
      this.checkForInputs()
    }
  }
}
