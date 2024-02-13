import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../gameConfig.js";
import Diamond from "../diamond/index.js";

export default class Platform {
  #body: MATTER.Body;
  #diamondList: Array<Diamond> = [];
  #sprite: PIXI.Graphics;
  constructor(type: string, xStart: number, first = false) {
    const randomHeight = config.HEIGHT * this.ajustedHeight();

    this.#body = MATTER.Bodies.rectangle(
      xStart,
      first ? config.HEIGHT / 2 : randomHeight,
      config.platForm[type].width,
      config.platForm[type].height,
      {
        isStatic: true,
      }
    );
    this.#body.label = "standard";

    this.#sprite = new PIXI.Graphics();
    this.#sprite.beginFill(0x9900ff);
    this.#sprite.drawRect(
      this.#body.position.x,
      this.#body.position.y,
      config.platForm.standard.width,
      config.platForm.standard.height
    );

    this.prepareDiamond();
  }

  ajustedHeight(): number {
    let randomNumber = Math.random();

    if (randomNumber <= 0.2) randomNumber += 0.2;
    if (randomNumber >= 0.8) randomNumber -= 0.2;
    return randomNumber;
  }

  getBody(): MATTER.Body {
    return this.#body;
  }

  getSprite(): PIXI.Graphics {
    return this.#sprite;
  }

  getPlatformType() {
    return this.#body.label;
  }

  getRightCoord() {
    return this.#body.position.x + config.platForm[this.#body.label].width;
  }

  moveLeft(speed: number) {
    MATTER.Body.setPosition(this.#body, {
      x: this.#body.position.x - speed,
      y: this.#body.position.y,
    });
  }

  hasDisappeared(): boolean {
    return this.getRightCoord() < 0;
  }

  moveToRight(x: number) {
    MATTER.Body.setPosition(this.#body, {
      x,
      y: config.HEIGHT * this.ajustedHeight(),
    });
    this.#diamondList.forEach((diamond) => diamond.setHasBeenTaken(false));
  }

  getDiamondList(): Array<Diamond> {
    return this.#diamondList;
  }

  prepareDiamond() {
    for (let i = 1; i <= config.diamond.nb; i++) {
      this.#diamondList.push(new Diamond(this.#body.position, i));
    }
  }
}
