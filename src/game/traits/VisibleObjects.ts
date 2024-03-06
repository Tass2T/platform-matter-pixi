import * as MATTER from "matter-js";
import { AnimatedSprite } from "pixi.js";

export default class VisibleObjects {
  _body: MATTER.Body;
  _sprite: AnimatedSprite;
  _isVisible: boolean = true;
  _bodyWidth: number;
  _bodyHeight: number;
  _isLoading: boolean = true;
  constructor() {}

  getBody(): MATTER.Body {
    return this._body;
  }

  getSprite(): AnimatedSprite {
    return this._sprite;
  }

  setBodyPosition(x: number, y: number) {
    this._body.position.x = x;
    this._body.position.y = y;
  }

  syncSpriteWithBody(): void {
    if (this._sprite && this._body) {
      this._sprite.position.x = this._body.position.x;
      this._sprite.position.y = this._body.position.y;
    }
  }

  animateSprite(customSpeed: number = 0): void {
    if (this._sprite instanceof AnimatedSprite) {
      this._sprite.animationSpeed = customSpeed || 0.2;
      this._sprite.play();
    }
  }

  update(delta: number) {
    if (this._sprite && this._body) this.syncSpriteWithBody();
  }
}
