import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../gameConfig.js";
import VisibleObjects from "../traits/VisibleObjects.js";

export default class Player extends VisibleObjects {
  _isJumping: boolean = false;
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

  setIsJumping(value: boolean): void {
    this._isJumping = value;
  }

  addVelocity(): void {
    if (this._velocity > 0) {
      MATTER.Body.setVelocity(this._body, {
        x: 0,
        y: -config.player.baseJumpSpeed,
      });
      this._velocity -= config.player.velocityLoss;
      if (this._velocity < 0) this._velocity = 0;
    }
  }

  stopVelocity(): void {
    this._interval = 0;
    this._velocity = 0;
    this.setIsJumping(false);
  }

  resetJump(): void {
    if (this._isJumping) {
      this._velocity = config.player.baseJumpSpeed;
    }
  }

  hasFallen(): boolean {
    return this._body.position.y >= config.HEIGHT || this._body.position.x <= 0;
  }

  resetPos() {
    this._body.position.x = 70;
    this._body.position.y = 40;
    this.syncSpriteWithBody();
  }

  update() {
    if (this._sprite && this._body) {
      this.syncSpriteWithBody();
      if (this._isJumping) this.addVelocity();
    }
  }
}
