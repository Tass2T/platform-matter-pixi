import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";

export default class VisibleObjects {
  _body: MATTER.Body;
  _sprite: PIXI.Graphics;
  constructor() {}

  getBody(): MATTER.Body {
    return this._body;
  }

  getSprite(): PIXI.Graphics {
    return this._sprite;
  }
}
