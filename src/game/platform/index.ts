import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";
import Diamond from "../diamond/index.js";

export default class Platform {
  #body: MATTER.Body;
  #diamondList: Array<Diamond> = [];
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

  getPlatformType() {
    return this.#body.label;
  }

  getRightCoord() {
    return this.#body.position.x + config.platForm[this.#body.label].width;
  }

  moveLeft() {
    MATTER.Body.setPosition(this.#body, {
      x: this.#body.position.x - config.SPEED,
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
