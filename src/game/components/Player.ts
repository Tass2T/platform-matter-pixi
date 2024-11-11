import * as MATTER from 'matter-js'
import { Spritesheet, Container, Assets, AnimatedSprite } from 'pixi.js'
import config from '../../../gameConfig.ts'
import VisibleObjects from '../../traits/VisibleObjects.ts'

export default class Player extends VisibleObjects {
  _isJumping: boolean = false
  _playerSpritesheet: Spritesheet
  _velocity: number = config.player.baseJumpSpeed

  constructor(physicEngineWorld: MATTER.World, parentContainer: Container) {
    super()
    this._body = MATTER.Bodies.rectangle(config.player.xAxisStart, config.HEIGHT / 3, 40, 70, {
      inertia: -Infinity,
    })
    this._bodyHeight = config.player.height
    this._bodyWidth = config.player.width
    this.initSprite(parentContainer)
    MATTER.Composite.add(physicEngineWorld, this._body)
  }

  async initSprite(parentContainer: Container) {
    this._playerSpritesheet = await Assets.load('player')

    this._isLoading = false

    this._sprite = new AnimatedSprite(this._playerSpritesheet.animations['run'])
    this._sprite.height = this._bodyHeight
    this._sprite.anchor.set(0.5, 0.5)

    this.animateSprite()

    parentContainer.addChild(this._sprite)
  }

  setIsJumping(value: boolean): void {
    if (this._sprite instanceof AnimatedSprite) {
    }
    // A faire ==>  Retirer les ignores et faire qqchose a proposito du type CustomSprite

    this._isJumping = value
    if (this._isJumping) {
      //@ts-ignore
      this._sprite.textures = this._playerSpritesheet.animations['jump']
      //@ts-ignore
      this._sprite.gotoAndStop(0)
    } else {
      //@ts-ignore
      this._sprite.textures = this._playerSpritesheet.animations['run']
      //@ts-ignore
      this._sprite.gotoAndPlay(0)
    }
  }

  checkJumpAnimation() {
    //@ts-ignore
    if (this._body.velocity.y > 0 && !this._sprite.playing) {
      this.startAnimation('fall')
    }
  }

  startAnimation(name: string) {
    //@ts-ignore
    this._sprite.textures = this._playerSpritesheet.animations[name]
    //@ts-ignore
    this._sprite.gotoAndPlay(0)
  }

  addVelocity(): void {
    if (this._velocity > 0) {
      MATTER.Body.setVelocity(this._body, {
        x: 0,
        y: -config.player.baseJumpSpeed,
      })
      this._velocity -= config.player.velocityLoss
      if (this._velocity < 0) this._velocity = 0
    }
  }

  stopVelocity(): void {
    this._velocity = 0
    this.setIsJumping(false)
  }

  resetJump(): void {
    if (this._isJumping) {
      this._velocity = config.player.baseJumpSpeed
    }
  }

  hasFallen(): boolean {
    return this._body.position.y >= config.HEIGHT || this._body.position.x <= 0
  }

  reset() {
    const x = config.player.xAxisStart
    const y = config.HEIGHT / 3
    MATTER.Body.setPosition(this._body, { x, y })
    this._sprite.position.set(x, y)
  }

  update() {
    if (this._sprite && this._body) {
      this.syncSpriteWithBody()
      if (this._isJumping) {
        this.addVelocity()
        this.checkJumpAnimation()
      }
    }
  }
}
