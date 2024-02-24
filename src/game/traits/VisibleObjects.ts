import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";

export default class VisibleObjects {
  _body: MATTER.Body;
  _sprite: PIXI.AnimatedSprite | PIXI.Sprite;
  _isVisible: boolean = true;
  _bodyWidth: number;
  _bodyHeight: number;
  _isLoading: boolean = true;
  constructor() {}

  getBody(): MATTER.Body {
    return this._body;
  }

  getSprite(): PIXI.AnimatedSprite | PIXI.Sprite {
    return this._sprite;
  }

  syncSpriteWithBody(): void {
    if (this._sprite && this._body) {
      this._sprite.position.x = this._body.position.x;
      this._sprite.position.y = this._body.position.y;
    }
  }

  animateSprite(customSpeed: number = 0): void {
    if (this._sprite instanceof PIXI.AnimatedSprite) {
      this._sprite.animationSpeed = customSpeed || 0.2;
      this._sprite.play();
    }
  }

  update() {
    if (this._sprite && this._body) this.syncSpriteWithBody();
  }
}
