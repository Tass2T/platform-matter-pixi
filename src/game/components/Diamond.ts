import * as MATTER from 'matter-js'
import { BitmapText, Container, Spritesheet, Assets, AnimatedSprite, Sprite } from 'pixi.js'
import config from '../../../gameConfig.ts'
import VisibleObjects from '../../traits/VisibleObjects.ts'
import gsap from 'gsap'
import * as Matter from 'matter-js'

export default class Diamond extends VisibleObjects {
  #diamondContainer: Container = new Container()
  #parentPos: MATTER.Vector
  #orderIndex: number
  #hasBeenTaken: boolean
  #spritesheet: Spritesheet
  #scoreText: BitmapText
  #pointsContainer: Container = new Container()
  #boundWithFirstPlatform: boolean
  #body: MATTER.Body
  #bodyHeight = config.diamond.side
  #bodyWidth = config.diamond.side
  #sprite: Sprite
  constructor(levelContainer: Container, platFormPos: MATTER.Vector, pos: number, firstPlatform: boolean) {
    super()
    levelContainer.addChild(this.#diamondContainer)
    this.#parentPos = platFormPos
    this.#orderIndex = pos
    this.#boundWithFirstPlatform = firstPlatform

    if (this.#boundWithFirstPlatform) this.#hasBeenTaken = true

    this.#body = MATTER.Bodies.rectangle(
      platFormPos.x - config.platForm.width / 2 + (config.diamond.side + config.diamond.gap) * pos,
      platFormPos.y - config.diamond.height,
      config.diamond.side,
      config.diamond.side,
      { isStatic: true, isSensor: true }
    )

    this.initAssets()
  }

  async initAssets() {
    this.#spritesheet = await Assets.load('diamonds')

    this.#sprite = new AnimatedSprite(this.#spritesheet.animations['idle'])
    this.#sprite.width = this.#bodyWidth
    this.#sprite.height = this.#bodyHeight
    this.#sprite.anchor.set(0.5, 0.5)

    this.animateSprite(0.08)
    if (this.#boundWithFirstPlatform) this.#sprite.visible = false

    this.#diamondContainer.addChild(this.#sprite)

    this.initScoreContainer()
  }

  getBody(): Matter.Body {
    return this.#body
  }

  initScoreContainer() {
    this.#scoreText = new BitmapText({
      text: `${config.diamond.points}`,
      style: {
        fontFamily: 'Arial',
        fontSize: 18,
        fill: 'purple',
        stroke: { width: 1 },
      },
    })
    this.#pointsContainer.position.set(-40, 0)
    this.#pointsContainer.visible = false
    this.#pointsContainer.addChild(this.#scoreText)
    this.#diamondContainer.addChild(this.#pointsContainer)
  }

  getPosition(): MATTER.Vector {
    return this.#body.position
  }

  getHasBeenTaken() {
    return this.#hasBeenTaken
  }

  hide() {
    this.#hasBeenTaken = true
    this.#sprite.visible = false
  }

  reset() {
    this.syncPosition()
    this.syncSpriteWithBody()
    this.setHasBeenTaken(false)
  }

  setHasBeenTaken(value: boolean) {
    if (this.#sprite && this.#sprite instanceof AnimatedSprite) {
      this.#hasBeenTaken = value
      if (this.#hasBeenTaken) {
        this.#sprite.textures = this.#spritesheet.animations['taken']
        this.#sprite.animationSpeed = 0.3
        this.#sprite.loop = false
        this.#sprite.onComplete = () => (this.#sprite.visible = false)

        this.#sprite.gotoAndPlay(0)
        this.#pointsContainer.visible = true
      } else {
        this.#sprite.visible = true
        this.#sprite.loop = true
        this.#sprite.textures = this.#spritesheet.animations['idle']
        this.#sprite.animationSpeed = 0.09
        this.#sprite.gotoAndPlay(0)
        this.#pointsContainer.position.y = 0
        this.#pointsContainer.visible = false
      }
    }
  }

  syncPosition(): void {
    MATTER.Body.setPosition(this.#body, {
      x: this.#parentPos.x - config.platForm.width / 2 + (40 + config.diamond.gap) * this.#orderIndex,
      y: this.#parentPos.y - 50,
    })
  }

  syncSpriteWithBody() {
    this.#diamondContainer.position.x = this.#body.position.x
    this.#diamondContainer.position.y = this.#body.position.y
  }

  syncScorePosition(delta: number) {
    if (this.#hasBeenTaken) {
      this.#pointsContainer.position.y -= 3 * delta
    }
  }

  update(): void {
    this.syncPosition()
    this.syncSpriteWithBody()
    this.syncScorePosition(gsap.ticker.deltaRatio())
  }
}
