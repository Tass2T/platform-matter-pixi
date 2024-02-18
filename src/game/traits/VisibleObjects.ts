import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";

export default class VisibleObjects {
  _body: MATTER.Body;
  _sprite: PIXI.Graphics | PIXI.AnimatedSprite;
  _isVisible: boolean = true;
  _bodyWidth: number;
  _bodyHeight: number;
  _isLoading: boolean = true;
  constructor() {}

  getBody(): MATTER.Body {
    return this._body;
  }

  getSprite(): PIXI.Graphics | PIXI.AnimatedSprite {
    return this._sprite;
  }

  syncSpriteWithBody(): void {
    this._sprite.position.x = this._body.position.x - this._bodyWidth / 2;
    this._sprite.position.y = this._body.position.y - this._bodyHeight / 2;
  }

  update() {
    if (this._sprite && this._body) this.syncSpriteWithBody();
  }
}
