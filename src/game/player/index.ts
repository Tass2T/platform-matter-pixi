import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../gameConfig.js";

export default class Player {
  _body: MATTER.Body;
  _sprite: PIXI.Graphics;
  _jumpCount: number = config.player.jumpNumber;

  constructor() {
    this._body = MATTER.Bodies.rectangle(config.player.xAxisStart, 0, 50, 50, {
      inertia: -Infinity,
    });

    this._sprite = new PIXI.Graphics();
    this._sprite.beginFill(0x9900ff);
    this._sprite.drawRect(this._body.position.x, this._body.position.y, 50, 50);
  }

  getBody(): MATTER.Body {
    return this._body;
  }

  jump(): void {
    if (this._jumpCount > 0) {
      MATTER.Body.setVelocity(this._body, {
        x: 0,
        y: -config.player.jumpSpeed,
      });
      this._jumpCount--;
    }
  }

  resetJump(): void {
    this._jumpCount = config.player.jumpNumber;
  }

  hasFallen(): boolean {
    return this._body.position.y >= config.HEIGHT;
  }

  syncBodyAndSprite() {
    this._sprite.position.x = this._body.position.x;
    this._sprite.position.y = this._body.position.y;
  }

  getSprite() {
    return this._sprite;
  }

  update(): void {
    this.syncBodyAndSprite();
  }
}
