import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../gameConfig.js";
import VisibleObjects from "../traits/VisibleObjects.js";

export default class Player extends VisibleObjects {
  _jumpCount: number = config.player.jumpNumber;
  _playerSpritesheet: PIXI.Spritesheet;
  _velocity: number = config.baseJumpSpeed;
  _interval: number;

  constructor(
    physicEngineWorld: MATTER.World,
    parentContainer: PIXI.Container
  ) {
    super();
    this._body = MATTER.Bodies.rectangle(
      config.player.xAxisStart,
      config.HEIGHT / 3,
      40,
      70,
      {
        inertia: -Infinity,
      }
    );
    this._bodyHeight = 70;
    this._bodyWidth = 40;
    MATTER.Composite.add(physicEngineWorld, this._body);

    this.initSprite(parentContainer);
  }

  async initSprite(parentContainer: PIXI.Container) {
    this._playerSpritesheet = await PIXI.Assets.load("player");

    this._isLoading = false;

    this._sprite = new PIXI.AnimatedSprite(
      this._playerSpritesheet.animations["run"]
    );
    this._sprite.height = this._bodyHeight;
    this._sprite.anchor.set(0.5, 0.5);

    this.animateSprite();

    parentContainer.addChild(this._sprite);
  }

  addVelocity(): void {
    this._interval = setInterval(() => {
      if (this._velocity > 0) {
        MATTER.Body.setVelocity(this._body, {
          x: 0,
          y: -config.player.baseJumpSpeed,
        });
        this._velocity -= config.player.velocityLoss;
        if (this._velocity < 0) this._velocity = 0;
      }
    }, 0);
  }

  stopVelocity(): void {
    clearInterval(this._interval);
    this._interval = 0;
    this._velocity = 0;
  }

  resetJump(): void {
    if (!this._interval) this._velocity = config.player.baseJumpSpeed;
  }

  hasFallen(): boolean {
    return this._body.position.y >= config.HEIGHT || this._body.position.x <= 0;
  }
}
