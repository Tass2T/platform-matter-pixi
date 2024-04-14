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
  #seconds = 0
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
    this.#platformContainer.zIndex = 3

    this.initAssets(levelContainer)
    levelContainer.addChild(this.#platformContainer)
  }

  async initAssets(levelContainer: Container) {
    const texture = await Assets.load('platform')
    console.log(texture)

    const ballonWidth = Math.ceil(config.platForm.width / config.platForm.balloonNb)
    const inflatedWidth = Math.floor(ballonWidth + ballonWidth / 3)

    for (let i = 0; i < config.platForm.balloonNb; i++) {
      const sprite = new Sprite(texture.textures[texture._frameKeys[Math.floor(Math.random() * 4)]])
      sprite.width = inflatedWidth
      sprite.height = inflatedWidth
      sprite.anchor.set(0, 0.5)
      sprite.position.set(15 + ballonWidth * i, 0 + config.platForm.height / 2)
      sprite.zIndex = Math.floor(Math.random() * 3)
      this.#balloons.push(sprite)
    }
    this.#platformContainer.addChild(...this.#balloons)

    this.prepareDiamond(levelContainer)
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

  prepareDiamond(levelContainer: Container) {
    for (let i = 1; i <= config.diamond.nb; i++) {
      this._diamondList.push(new Diamond(levelContainer, this._body.position, i, this._isFirst))
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

  moveBalloons() {
    this.#balloons.forEach((balloon, index) => {
      balloon.position.set(
        balloon.position.x + Math.sin(this.#seconds) * (index % 2 === 0 ? 0.02 : -0.04),
        balloon.position.y + Math.cos(this.#seconds) * (index % 2 === 0 ? 0.05 : -0.03)
      )
    })
  }

  update(delta: number): void {
    if (this.#balloons.length && this._body) {
      this.syncSpriteWithBody()
      this.moveBalloons()

      this._diamondList.forEach(diamond => diamond.update(delta))
      this.#seconds += (1 / 60) * delta
    }
  }
}
