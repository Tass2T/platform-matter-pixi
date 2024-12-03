import * as MATTER from 'matter-js'
import { Container, Assets, Sprite } from 'pixi.js'
import config from '../../../gameConfig.ts'
import Diamond from './Diamond.ts'

export default class Platform {
  #diamondList: Array<Diamond> = []
  #isFirst: boolean
  #platformContainer = new Container({ isRenderGroup: true })
  #body: MATTER.Body
  constructor(xStart: number, levelContainer: Container, first = false) {
    this.#isFirst = first
    this.#body = MATTER.Bodies.rectangle(
      xStart,
      first ? config.HEIGHT / 2 : this.getAdjustedHeight(),
      config.platForm.width,
      config.platForm.height / 3.2,
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
    this.syncSpriteWithBody()
  }

  getAdjustedHeight(): number {
    return config.HEIGHT - Math.random() * config.platForm.spaceFromCenter - 50
  }

  getRightCoord() {
    return this.#body.position.x + config.platForm.width
  }

  getBody = () => {
    return this.#body
  }

  moveLeft(speed: number) {
    MATTER.Body.setPosition(this.#body, {
      x: this.#body.position.x - speed,
      y: this.#body.position.y,
    })
  }

  hasDisappeared(): boolean {
    return this.getRightCoord() < 0
  }

  moveToRight(x: number) {
    MATTER.Body.setPosition(this.#body, {
      x,
      y: this.getAdjustedHeight(),
    })

    this.#diamondList.forEach(diamond => diamond.setHasBeenTaken(false))
  }

  getDiamondList(): Array<Diamond> {
    return this.#diamondList
  }

  prepareDiamond(levelContainer: Container) {
    for (let i = 1; i <= config.diamond.nb; i++) {
      this.#diamondList.push(new Diamond(levelContainer, this.#body.position, i, this.#isFirst))
    }
  }

  resetDiamond() {
    this.#diamondList.forEach(diamond => (this.#isFirst ? diamond.hide() : diamond.reset()))
  }

  setPosition(x: number, y: number): void {
    MATTER.Body.setPosition(this.#body, { x, y })
    this.syncSpriteWithBody()
  }

  syncSpriteWithBody() {
    this.#platformContainer.position.set(
      this.#body.position.x - config.platForm.width / 2,
      this.#body.position.y - config.platForm.height / 2
    )
  }

  update(): void {
    this.syncSpriteWithBody()

    this.#diamondList.forEach(diamond => diamond.update())
  }
}
