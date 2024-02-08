import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";

export default class Diamond {
  #body: MATTER.Body;
  #parentPos: MATTER.Vector;
  #orderIndex: number;
  #hasBeenTaken: boolean;
  constructor(platFormPos: MATTER.Vector, pos: number) {
    this.#parentPos = platFormPos;
    this.#orderIndex = pos;

    this.#body = MATTER.Bodies.rectangle(
      platFormPos.x -
        config.platForm.standard.width / 2 +
        (config.diamond.side + config.diamond.gap) * pos,
      platFormPos.y - config.diamond.height,
      config.diamond.side,
      config.diamond.side,
      { isStatic: true, isSensor: true }
    );
  }

  getBody(): MATTER.Body {
    return this.#body;
  }

  getPosition(): MATTER.Vector {
    return this.#body.position;
  }

  getHasBeenTaken() {
    return this.#hasBeenTaken;
  }

  setHasBeenTaken(value: boolean) {
    this.#hasBeenTaken = value;
  }

  syncPosition(): void {
    MATTER.Body.setPosition(this.#body, {
      x:
        this.#parentPos.x -
        config.platForm.standard.width / 2 +
        (config.diamond.side + config.diamond.gap) * this.#orderIndex,
      y: this.#parentPos.y - config.diamond.height,
    });
  }
}
