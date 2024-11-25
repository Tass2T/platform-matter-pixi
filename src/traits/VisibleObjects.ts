import * as MATTER from 'matter-js'
import { AnimatedSprite, Sprite, Container } from 'pixi.js'

type CustomSprite = Sprite | AnimatedSprite

export default class VisibleObjects {
  #body: MATTER.Body
  #sprite: CustomSprite
  constructor() {}

  getBody(): MATTER.Body {
    return this.#body
  }

  getSprite(): Container {
    return this.#sprite
  }

  setBodyPosition(x: number, y: number) {
    this.#body.position.x = x
    this.#body.position.y = y
  }

  syncSpriteWithBody(): void {
    if (this.#sprite && this.#body) {
      this.#sprite.position.x = this.#body.position.x
      this.#sprite.position.y = this.#body.position.y
    }
  }

  animateSprite(customSpeed: number = 0): void {
    if (this.#sprite instanceof AnimatedSprite) {
      this.#sprite.animationSpeed = customSpeed || 0.2
      this.#sprite.play()
    }
  }

  update() {
    if (this.#sprite && this.#body) this.syncSpriteWithBody()
  }
}
