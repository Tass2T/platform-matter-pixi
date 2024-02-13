import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../gameConfig.js";
import Diamond from "../diamond/index.js";
import VisibleObjects from "../traits/VisibleObjects.js";

export default class Platform extends VisibleObjects {
  _diamondList: Array<Diamond> = [];
  constructor(type: string, xStart: number, first = false) {
    super();
    const randomHeight = config.HEIGHT * this.ajustedHeight();

    this._body = MATTER.Bodies.rectangle(
      xStart,
      first ? config.HEIGHT / 2 : randomHeight,
      config.platForm[type].width,
      config.platForm[type].height,
      {
        isStatic: true,
      }
    );
    this._body.label = "standard";

    this._sprite = new PIXI.Graphics();
    this._sprite.beginFill(0x9900ff);
    this._sprite.drawRect(
      this._body.position.x,
      this._body.position.y,
      config.platForm.standard.width,
      config.platForm.standard.height
    );
    this._sprite.pivot.set(0.5);

    this.prepareDiamond();
  }

  ajustedHeight(): number {
    let randomNumber = Math.random();

    if (randomNumber <= 0.2) randomNumber += 0.2;
    if (randomNumber >= 0.8) randomNumber -= 0.2;
    return randomNumber;
  }

  getPlatformType() {
    return this._body.label;
  }

  getRightCoord() {
    return this._body.position.x + config.platForm[this._body.label].width;
  }

  moveLeft(speed: number) {
    MATTER.Body.setPosition(this._body, {
      x: this._body.position.x - speed,
      y: this._body.position.y,
    });
  }

  hasDisappeared(): boolean {
    return this.getRightCoord() < 0;
  }

  moveToRight(x: number) {
    MATTER.Body.setPosition(this._body, {
      x,
      y: config.HEIGHT * this.ajustedHeight(),
    });
    this._diamondList.forEach((diamond) => diamond.setHasBeenTaken(false));
  }

  getDiamondList(): Array<Diamond> {
    return this._diamondList;
  }

  prepareDiamond() {
    for (let i = 1; i <= config.diamond.nb; i++) {
      this._diamondList.push(new Diamond(this._body.position, i));
    }
  }
}
