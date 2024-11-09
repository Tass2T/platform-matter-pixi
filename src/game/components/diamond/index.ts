import * as MATTER from 'matter-js'
import { BitmapText, Container, Spritesheet, Assets, AnimatedSprite } from 'pixi.js'
import config from '../../../../gameConfig.ts'
import VisibleObjects from '../../../traits/VisibleObjects.js'

export default class Diamond extends VisibleObjects {
  _diamondContainer: Container = new Container()
  _parentPos: MATTER.Vector
  _orderIndex: number
  _hasBeenTaken: boolean
  _spritesheet: Spritesheet
  _scoreText: BitmapText
  _pointsContainer: Container = new Container()
  _boundWithFirstPlatform: boolean
  constructor(levelContainer: Container, platFormPos: MATTER.Vector, pos: number, firstPlatform: boolean) {
    super()
    levelContainer.addChild(this._diamondContainer)
    this._parentPos = platFormPos
    this._orderIndex = pos
    this._boundWithFirstPlatform = firstPlatform

    if (this._boundWithFirstPlatform) this._hasBeenTaken = true

    this._body = MATTER.Bodies.rectangle(
      platFormPos.x - config.platForm.width / 2 + (config.diamond.side + config.diamond.gap) * pos,
      platFormPos.y - config.diamond.height,
      config.diamond.side,
      config.diamond.side,
      { isStatic: true, isSensor: true }
    )
    this._bodyHeight = config.diamond.side
    this._bodyWidth = config.diamond.side

    this.initAssets()
  }

  async initAssets() {
    this._spritesheet = await Assets.load('diamonds')

    this._sprite = new AnimatedSprite(this._spritesheet.animations['idle'])
    this._sprite.width = this._bodyWidth
    this._sprite.height = this._bodyHeight
    this._sprite.anchor.set(0.5, 0.5)

    this.animateSprite(0.08)
    if (this._boundWithFirstPlatform) this._sprite.visible = false

    this._diamondContainer.addChild(this._sprite)

    this.initScoreContainer()
  }

  initScoreContainer() {
    this._scoreText = new BitmapText({
      text: `${config.diamond.points}`,
      style: {
        fontFamily: 'Arial',
        fontSize: 18,
        fill: 'purple',
        stroke: { width: 1 },
      },
    })
    this._pointsContainer.position.set(-40, 0)
    this._pointsContainer.visible = false
    this._pointsContainer.addChild(this._scoreText)
    this._diamondContainer.addChild(this._pointsContainer)
  }

  getPosition(): MATTER.Vector {
    return this._body.position
  }

  getHasBeenTaken() {
    return this._hasBeenTaken
  }

  hide() {
    this._hasBeenTaken = true
    this._sprite.visible = false
  }

  reset() {
    this.syncPosition()
    this.syncSpriteWithBody()
    this.setHasBeenTaken(false)
  }

  setHasBeenTaken(value: boolean) {
    if (this._sprite && this._sprite instanceof AnimatedSprite) {
      this._hasBeenTaken = value
      if (this._hasBeenTaken) {
        this._sprite.textures = this._spritesheet.animations['taken']
        this._sprite.animationSpeed = 0.3
        this._sprite.loop = false
        this._sprite.onComplete = () => (this._sprite.visible = false)

        this._sprite.gotoAndPlay(0)
        this._pointsContainer.visible = true
      } else {
        this._sprite.visible = true
        this._sprite.loop = true
        this._sprite.textures = this._spritesheet.animations['idle']
        this._sprite.animationSpeed = 0.09
        this._sprite.gotoAndPlay(0)
        this._pointsContainer.position.y = 0
        this._pointsContainer.visible = false
      }
    }
  }

  syncPosition(): void {
    MATTER.Body.setPosition(this._body, {
      x: this._parentPos.x - config.platForm.width / 2 + (40 + config.diamond.gap) * this._orderIndex,
      y: this._parentPos.y - 50,
    })
  }

  syncSpriteWithBody() {
    this._diamondContainer.position.x = this._body.position.x
    this._diamondContainer.position.y = this._body.position.y
  }

  syncScorePosition(delta: number) {
    if (this._hasBeenTaken) {
      this._pointsContainer.position.y -= 3 * delta
    }
  }

  update(delta: number): void {
    this.syncPosition()
    this.syncSpriteWithBody()
    this.syncScorePosition(delta)
  }
}
