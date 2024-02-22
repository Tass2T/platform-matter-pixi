import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../gameConfig.js";
import VisibleObjects from "../traits/VisibleObjects.js";

export default class Player extends VisibleObjects {
  _jumpCount: number = config.player.jumpNumber;
  _playerSpritesheet: PIXI.Spritesheet;

  constructor(
    physicEngineWorld: MATTER.World,
    parentContainer: PIXI.Container
  ) {
    super();
    this._body = MATTER.Bodies.rectangle(
      config.player.xAxisStart,
      config.HEIGHT / 2,
      50,
      50,
      {
        inertia: -Infinity,
      }
    );
    this._bodyHeight = 50;
    this._bodyWidth = 50;
    MATTER.Composite.add(physicEngineWorld, this._body);

    this.initSprite(parentContainer);
  }

  async initSprite(parentContainer: PIXI.Container) {
    this._playerSpritesheet = await PIXI.Assets.load("player");

    this._isLoading = false;

    this._sprite = new PIXI.AnimatedSprite(
      this._playerSpritesheet.animations["run"]
    );

    this.animateSprite();

    parentContainer.addChild(this._sprite);
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
    return this._body.position.y >= config.HEIGHT || this._body.position.x <= 0;
  }
}
