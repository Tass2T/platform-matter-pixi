import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../gameConfig.js";
import VisibleObjects from "../traits/VisibleObjects.js";

export default class Diamond extends VisibleObjects {
  _parentPos: MATTER.Vector;
  _orderIndex: number;
  _hasBeenTaken: boolean;
  constructor(platFormPos: MATTER.Vector, pos: number) {
    super();
    this._parentPos = platFormPos;
    this._orderIndex = pos;

    this._body = MATTER.Bodies.rectangle(
      platFormPos.x -
        config.platForm.standard.width / 2 +
        (config.diamond.side + config.diamond.gap) * pos,
      platFormPos.y - config.diamond.height,
      config.diamond.side,
      config.diamond.side,
      { isStatic: true, isSensor: true }
    );
    this._bodyHeight = config.diamond.side;
    this._bodyWidth = config.diamond.side;

    this._sprite = new PIXI.Graphics();
    this._sprite.beginFill(0xff33ee);
    this._sprite.drawRect(0, 0, config.diamond.side, config.diamond.side);
  }

  getPosition(): MATTER.Vector {
    return this._body.position;
  }

  getHasBeenTaken() {
    return this._hasBeenTaken;
  }

  setHasBeenTaken(value: boolean) {
    this._hasBeenTaken = value;
    if (value) this._sprite.visible = false;
    else this._sprite.visible = true;
  }

  syncPosition(): void {
    MATTER.Body.setPosition(this._body, {
      x:
        this._parentPos.x -
        config.platForm.standard.width / 2 +
        (config.diamond.side + config.diamond.gap) * this._orderIndex,
      y: this._parentPos.y - config.diamond.height,
    });
  }

  update(): void {
    this.syncPosition();
    this.syncSpriteWithBody();
  }
}
