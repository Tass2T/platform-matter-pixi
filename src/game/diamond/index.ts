import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";

export default class Diamond {
  #body: MATTER.Body;
  constructor(platFormPos: MATTER.Vector, pos: number) {
    this.#body = MATTER.Bodies.rectangle(
      (platFormPos.x - config.platForm.standard.width) * pos,
      platFormPos.y - 100,
      config.diamond.side,
      config.diamond.side,
      { isStatic: true }
    );
  }

  getBody(): MATTER.Body {
    return this.#body;
  }

  getPosition(): MATTER.Vector {
    return this.#body.position;
  }

  moveLeft() {}
}
