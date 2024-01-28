import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";

export default class Player {
  body: MATTER.Body;
  jumpCount: number = config.player.jumpNumber;
  constructor() {
    this.body = MATTER.Bodies.rectangle(100, config.HEIGHT / 2, 50, 50);
  }

  jump() {
    if (this.jumpCount > 0) {
      MATTER.Body.setVelocity(this.body, { x: 0, y: -config.player.jumpSpeed });
      this.jumpCount--;
    }
  }

  resetJump() {
    this.jumpCount = config.player.jumpNumber;
  }

  update() {}
}
