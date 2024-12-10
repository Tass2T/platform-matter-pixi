import { Spritesheet, Container, Assets, AnimatedSprite } from 'pixi.js'
import config from '../../../gameConfig.ts'
import { inputManager } from '../../utils/inputManager.ts'
import { AppScreen } from '../../models'
import { Sleeping, Body, Engine, Bodies, Composite, Vector } from 'matter-js'

export default class Player {
  #parentContainer: AppScreen
  #engine: Engine
  #jumpsLeft = config.player.nbOfJumps
  #keyMustBeReleased = false
  #playerSpritesheet: Spritesheet
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
    Body.setPosition(this.#body, Vector.create(config.player.xAxisStart, config.HEIGHT / 3))
    this.#body.velocity.x = 0
    this.#body.velocity.y = 0
    this.syncSpriteWithBody()
    this.#hasFallen = false
    this.#jumpsLeft = config.player.nbOfJumps
    this.startAnimation('run')
    Sleeping.set(this.#body, false)
  }

  start = () => {
    this.#body.velocity.x = 0
    this.#body.velocity.y = 0
    this.#sprite.gotoAndPlay(0)
  }

  private async initSprite(parentContainer: Container) {
    this.#playerSpritesheet = await Assets.load('player')

    this.#sprite = new AnimatedSprite(this.#playerSpritesheet.animations['run'])
    this.#sprite.animationSpeed = 0.2
    this.#sprite.height = this.#bodyHeight
    this.#sprite.anchor.set(0.5, 0.5)
    this.#sprite.zIndex = 10

    this.syncSpriteWithBody()
    parentContainer.addChild(this.#sprite)
  }

  setIsJumping(): void {
    if (this.#jumpsLeft < config.player.nbOfJumps) {
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

  syncSpriteWithBody(): void {
    if (this.#sprite && this.#body) {
      this.#sprite.position.x = this.#body.position.x
      this.#sprite.position.y = this.#body.position.y
    }
  }

  private checkForInputs() {
    if (inputManager.isSpacePressed()) {
      if (this.#jumpsLeft && !this.#keyMustBeReleased) {
        this.#keyMustBeReleased = true
        this.#jumpsLeft -= 1
        this.setIsJumping()
        Body.setVelocity(this.#body, {
          x: 0,
          y: -config.player.baseJumpSpeed,
        })
      }
    } else {
      this.#keyMustBeReleased = false
    }
  }

  checkIfIsStillJumping() {
    if (this.#jumpsLeft < config.player.nbOfJumps && this.#body.velocity.y === 0) {
      this.#jumpsLeft = config.player.nbOfJumps
      this.setIsJumping()
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
