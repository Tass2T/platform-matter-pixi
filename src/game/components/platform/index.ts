import * as MATTER from 'matter-js'
import { Container, Assets, Sprite } from 'pixi.js'
import config from '../../../../gameConfig.ts'
import Diamond from '../diamond/index.js'
import VisibleObjects from '../../traits/VisibleObjects.js'

export default class Platform extends VisibleObjects {
  _diamondList: Array<Diamond> = []
  _isFirst: boolean
  #balloons: Sprite[] = []
  #platformContainer = new Container({ isRenderGroup: true })
  constructor(xStart: number, levelContainer: Container, first = false) {
    super()
    this._isFirst = first ? true : false
    this._body = MATTER.Bodies.rectangle(
      xStart,
      first ? config.HEIGHT / 2 : this.getAdjustedHeight(),
      config.platForm.width,
      config.platForm.height,
      {
        isStatic: true,
      }
    )
    this._body.label = 'standard'
    this._bodyHeight = config.platForm.height
    this._bodyWidth = config.platForm.width

    this.initAssets()
    levelContainer.addChild(this.#platformContainer)
  }

  async initAssets() {
    const texture = await Assets.load('platform')
    const ballonWidth = Math.ceil(config.platForm.width / config.platForm.balloonNb)

    console.log(ballonWidth)
    for (let i = 1; i <= config.platForm.balloonNb; i++) {
      const sprite = new Sprite(texture)
      sprite.anchor.set(0.5)
      sprite.position.set(ballonWidth * i, 0)
      sprite.zIndex = Math.floor(Math.random() * 3)
      this.#balloons.push(sprite)
    }
    this.#platformContainer.addChild(...this.#balloons)

    this.prepareDiamond()
  }

  getAdjustedHeight(): number {
    return config.HEIGHT * this.ajustedHeight()
  }

  ajustedHeight(): number {
    let randomNumber = Math.random()

    if (randomNumber <= 0.2) randomNumber += 0.3
    if (randomNumber >= 0.7) randomNumber -= 0.3
    return randomNumber
  }

  getPlatformType() {
    return this._body.label
  }

  getRightCoord() {
    return this._body.position.x + config.platForm.width
  }

  moveLeft(speed: number) {
    MATTER.Body.setPosition(this._body, {
      x: this._body.position.x - speed,
      y: this._body.position.y,
    })
  }

  hasDisappeared(): boolean {
    return this.getRightCoord() < 0
  }

  moveToRight(x: number) {
    MATTER.Body.setPosition(this._body, {
      x,
      y: config.HEIGHT * this.ajustedHeight(),
    })
    this._diamondList.forEach(diamond => diamond.setHasBeenTaken(false))
  }

  getDiamondList(): Array<Diamond> {
    return this._diamondList
  }

  prepareDiamond() {
    for (let i = 1; i <= config.diamond.nb; i++) {
      this._diamondList.push(new Diamond(this.#platformContainer, this._body.position, i, this._isFirst))
    }
  }

  setPosition(x: number, y: number): void {
    MATTER.Body.setPosition(this._body, { x, y })
    this._sprite.position.set(x, y)
  }

  syncSpriteWithBody() {
    this.#platformContainer.position.set(this._body.position.x, this._body.position.y)
  }

  update(delta: number): void {
    if (this.#balloons.length && this._body) {
      this.syncSpriteWithBody()
      this._diamondList.forEach(diamond => diamond.update(delta))
    }
  }
}
