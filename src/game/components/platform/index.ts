import * as MATTER from "matter-js";
import { Container, Assets, AnimatedSprite } from "pixi.js";
import config from "../../../../gameConfig.ts";
import Diamond from "../diamond/index.js";
import VisibleObjects from "../../traits/VisibleObjects.js";

export default class Platform extends VisibleObjects {
  _diamondList: Array<Diamond> = [];
  _isFirst: boolean;
  constructor(
    xStart: number,
    levelContainer: Container,
    first = false
  ) {
    super();
    this._isFirst = first ? true : false;
    this._body = MATTER.Bodies.rectangle(
      xStart,
      first ? config.HEIGHT / 2 : this.getAdjustedHeight(),
      config.platForm.standard.width,
      config.platForm.standard.height,
      {
        isStatic: true,
      }
    );
    this._body.label = "standard";
    this._bodyHeight = config.platForm.standard.height;
    this._bodyWidth = config.platForm.standard.width;

    this.initAssets(levelContainer);
  }

  async initAssets(levelContainer: Container) {
    const texture = await Assets.load("platform");

    this._sprite = new AnimatedSprite(texture.animations["move"]);
    this._sprite.anchor.set(0.4, 0.15);
    this._sprite.width = this._bodyWidth;
    levelContainer.addChild(this._sprite);

    this.prepareDiamond(levelContainer);
  }

  getAdjustedHeight(): number {
    return config.HEIGHT * this.ajustedHeight();
  }

  ajustedHeight(): number {
    let randomNumber = Math.random();

    if (randomNumber <= 0.2) randomNumber += 0.3;
    if (randomNumber >= 0.7) randomNumber -= 0.3;
    return randomNumber;
  }

  getPlatformType() {
    return this._body.label;
  }

  getRightCoord() {
    // @ts-ignore
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

  prepareDiamond(levelContainer: Container) {
    for (let i = 1; i <= config.diamond.nb; i++) {
      this._diamondList.push(
        new Diamond(levelContainer, this._body.position, i, this._isFirst)
      );
    }
  }

  setPosition(x: number, y: number): void {
    MATTER.Body.setPosition(this._body, { x, y });
    this._sprite.position.set(x, y);
  }

  update(delta: number): void {
    if (this._sprite && this._body) {
      this.syncSpriteWithBody();
      this._diamondList.forEach((diamond) => diamond.update(delta));
    }
  }
}
