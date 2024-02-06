import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";

export default class Platform {
  #body: MATTER.Body;
  constructor(type: string, xStart: number) {
    const randomHeight = config.HEIGHT * Math.random();
    this.#body = MATTER.Bodies.rectangle(
      xStart,
      randomHeight,
      config.platForm[type].width,
      config.platForm[type].height,
      {
        isStatic: true,
      }
    );
    this.#body.label = "standard";
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
}
