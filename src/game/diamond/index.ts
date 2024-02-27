import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../gameConfig.js";
import VisibleObjects from "../traits/VisibleObjects.js";

export default class Diamond extends VisibleObjects {
  _parentPos: MATTER.Vector;
  _orderIndex: number;
  _hasBeenTaken: boolean;
  _spritesheet: PIXI.Spritesheet;
  constructor(
    levelContainer: PIXI.Container,
    platFormPos: MATTER.Vector,
    pos: number
  ) {
    super();
    this._parentPos = platFormPos;
    this._orderIndex = pos;

    this._body = MATTER.Bodies.rectangle(
      platFormPos.x -
        config.platForm.standard.width / 2 +
        (config.diamond.side + config.diamond.gap) * pos,
      this._orderIndex % 2 === 0
        ? platFormPos.y + 10
        : platFormPos.y - config.diamond.height,
      config.diamond.side,
      config.diamond.side,
      { isStatic: true, isSensor: true }
    );
    this._bodyHeight = config.diamond.side;
    this._bodyWidth = config.diamond.side;

    this.initAssets(levelContainer);
  }

  async initAssets(levelContainer: PIXI.Container) {
    this._spritesheet = await PIXI.Assets.load("diamonds");

    this._sprite = new PIXI.AnimatedSprite(
      this._spritesheet.animations["idle"]
    );
    this._sprite.width = this._bodyWidth;
    this._sprite.height = this._bodyHeight;
    this._sprite.anchor.set(0.5, 0.5);

    this.animateSprite(0.08);

    levelContainer.addChild(this._sprite);
  }

  getPosition(): MATTER.Vector {
    return this._body.position;
  }

  getHasBeenTaken() {
    return this._hasBeenTaken;
  }

  setHasBeenTaken(value: boolean) {
    if (this._sprite) {
      this._hasBeenTaken = value;
      if (this._hasBeenTaken) {
        this._sprite.textures = this._spritesheet.animations["taken"];
        this._sprite.animationSpeed = 0.3;
        this._sprite.loop = false;
        this._sprite.onComplete = () => (this._sprite.visible = false);

        this._sprite.gotoAndPlay(0);
      } else {
        this._sprite.visible = true;
        this._sprite.loop = true;
        this._sprite.textures = this._spritesheet.animations["idle"];
        this._sprite.animationSpeed = 0.08;
        this._sprite.gotoAndPlay(0);
      }
    }
  }

  syncPosition(): void {
    MATTER.Body.setPosition(this._body, {
      x:
        this._parentPos.x -
        config.platForm.standard.width / 2 +
        (config.diamond.side + config.diamond.gap) * this._orderIndex,
      y:
        this._orderIndex % 2 === 0
          ? this._parentPos.y - config.diamond.height - 15
          : this._parentPos.y - config.diamond.height,
    });
  }

  update(): void {
    this.syncPosition();
    this.syncSpriteWithBody();
  }
}
