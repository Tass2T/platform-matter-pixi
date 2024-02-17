import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";

export default class VisibleObjects {
  _body: MATTER.Body;
  _sprite: PIXI.Graphics;
  _isVisible: boolean = true;
  constructor() {}

  getBody(): MATTER.Body {
    return this._body;
  }

  getSprite(): PIXI.Graphics {
    return this._sprite;
  }

  syncSpriteWithBody(): void {
    this._sprite.position.set(this._body.position.x, this._body.position.y);
  }

  update() {
    this.syncSpriteWithBody();
  }
}
