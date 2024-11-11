import * as MATTER from 'matter-js'
import { Container, Assets, Sprite } from 'pixi.js'
import config from '../../../gameConfig.ts'
import Diamond from './Diamond.ts'
import VisibleObjects from '../../traits/VisibleObjects.ts'

export default class Platform extends VisibleObjects {
  #diamondList: Array<Diamond> = []
  #isFirst: boolean
  #platformContainer = new Container({ isRenderGroup: true })
  constructor(xStart: number, levelContainer: Container, first = false) {
    super()
    this.#isFirst = first
    this._body = MATTER.Bodies.rectangle(
      xStart,
      first ? config.HEIGHT / 2 : this.getAdjustedHeight(),
      config.platForm.width,
      config.platForm.height,
      {
        isStatic: true,
      }
    )
    this.#platformContainer.zIndex = 3

    this.initAssets()
    this.prepareDiamond(levelContainer)
    levelContainer.addChild(this.#platformContainer)
  }

  async initAssets() {
    const texture = await Assets.load('platform')
    const sprite = new Sprite(texture)
    sprite.width = config.platForm.width
    sprite.height = config.platForm.height
    this.#platformContainer.addChild(sprite)
  }

  getAdjustedHeight(): number {
    return config.HEIGHT - Math.random() * config.platForm.spaceFromCenter - 50
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
      y: this.getAdjustedHeight(),
    })
  }

  getDiamondList(): Array<Diamond> {
    return this.#diamondList
  }

  prepareDiamond(levelContainer: Container) {
    for (let i = 1; i <= config.diamond.nb; i++) {
      this.#diamondList.push(new Diamond(levelContainer, this._body.position, i, this.#isFirst))
    }
  }

  setPosition(x: number, y: number): void {
    MATTER.Body.setPosition(this._body, { x, y })
    this.#platformContainer.position.set(x, y)
  }

  syncSpriteWithBody() {
    this.#platformContainer.position.set(
      this._body.position.x - config.platForm.width / 2,
      this._body.position.y - config.platForm.height / 2
    )
  }

  update(delta: number): void {
    this.syncSpriteWithBody()
  }
}
