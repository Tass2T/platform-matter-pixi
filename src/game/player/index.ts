import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../gameConfig.js";
import VisibleObjects from "../traits/VisibleObjects.js";

export default class Player extends VisibleObjects {
  _isJumping: boolean = false;
  _playerSpritesheet: PIXI.Spritesheet;
  _velocity: number = config.baseJumpSpeed;

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

  setAsleep(): void {
    this._body.isSleeping = true;
  }

  reset() {
    this._body.position.x = config.player.xAxisStart;
    this._body.position.y = config.HEIGHT / 3;
    this._sprite.position.x = this._body.position.x;
    this._sprite.position.y = this._body.position.y;
    this._body.isSleeping = false;
    this._isJumping = false;
    MATTER.Body.setVelocity(this._body, {
      x: 0,
      y: 0,
    });
  }

  update() {
    if (this._sprite && this._body) {
      this.syncSpriteWithBody();
      if (this._isJumping) this.addVelocity();
    }
  }
}
