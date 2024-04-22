import * as MATTER from 'matter-js'
import { Container, Assets, Sprite, Spritesheet } from 'pixi.js'
import config from '../../../../gameConfig.ts'
import Diamond from '../diamond/index.js'
import VisibleObjects from '../../traits/VisibleObjects.js'

export default class Platform extends VisibleObjects {
  _diamondList: Array<Diamond> = []
  _isFirst: boolean
  #balloons: Sprite[] = []
  #platformContainer = new Container({ isRenderGroup: true })
  #seconds = 0
  #ballonsSpriteSheet: Spritesheet
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
    this.#ballonsSpriteSheet = await Assets.load('platform')
    const keys = Object.keys(this.#ballonsSpriteSheet.textures)

    const ballonWidth = Math.ceil(config.platForm.width / config.platForm.balloonNb)
    const inflatedWidth = Math.floor(ballonWidth + ballonWidth / 3)
    const inflatedHeight = Math.floor(config.platForm.height + config.platForm.height / 3)

    for (let i = 0; i < config.platForm.balloonNb; i++) {
      const sprite = new Sprite(this.#ballonsSpriteSheet.textures[keys[Math.floor(Math.random() * 4)]])
      sprite.width = inflatedWidth
      sprite.height = inflatedHeight
      sprite.anchor.set(0, 0.4)
      sprite.position.set(15 + ballonWidth * i, 0 + config.platForm.height / 2)
      sprite.zIndex = Math.floor(Math.random() * 3)
      this.#balloons.push(sprite)
    }
    this.#platformContainer.addChild(...this.#balloons)

    this.prepareDiamond(levelContainer)
  }

  getAdjustedHeight(): number {
    return config.HEIGHT / 2 + (Math.random() - 0.5) * config.platForm.spaceFromCenter
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
    this._diamondList.forEach(diamond => diamond.setHasBeenTaken(false))

    const keys = Object.keys(this.#ballonsSpriteSheet.textures)
    this.#balloons.forEach(
      balloon => (balloon.texture = this.#ballonsSpriteSheet.textures[keys[Math.floor(Math.random() * 4)]])
    )
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
      const moveValue = index % 2 === 0 ? 0.06 : 0.04
      balloon.position.set(
        balloon.position.x + Math.sin(this.#seconds) * moveValue * (index % 2 === 0 ? 1 : -1),
        balloon.position.y + Math.cos(this.#seconds) * moveValue * (index % 2 === 0 ? 1 : -1)
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
