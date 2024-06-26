import * as MATTER from 'matter-js'
import { AnimatedSprite, Sprite, Container } from 'pixi.js'

type CustomSprite = Sprite | AnimatedSprite

export default class VisibleObjects {
  _body: MATTER.Body
  _sprite: CustomSprite
  _isVisible: boolean = true
  _bodyWidth: number
  _bodyHeight: number
  _isLoading: boolean = true
  constructor() {}

  getBody(): MATTER.Body {
    return this._body
  }

  getSprite(): Container {
    return this._sprite
  }

  setBodyPosition(x: number, y: number) {
    this._body.position.x = x
    this._body.position.y = y
  }

  syncSpriteWithBody(): void {
    if (this._sprite && this._body) {
      this._sprite.position.x = this._body.position.x
      this._sprite.position.y = this._body.position.y
    }
  }

  animateSprite(customSpeed: number = 0): void {
    if (this._sprite instanceof AnimatedSprite) {
      this._sprite.animationSpeed = customSpeed || 0.2
      this._sprite.play()
    }
  }

  update(delta: number) {
    delta
    if (this._sprite && this._body) this.syncSpriteWithBody()
  }
}
