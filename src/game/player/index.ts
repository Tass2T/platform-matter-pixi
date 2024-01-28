import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";

export default class Player {
  body: MATTER.Body;
  jumpCount: number = config.player.jumpNumber;
  constructor() {
    this.body = MATTER.Bodies.rectangle(100, 10, 10, 10);
  }

  jump() {
    if (this.jumpCount > 0) {
      MATTER.Body.setVelocity(this.body, { x: 0, y: -config.player.jumpSpeed });
      this.jumpCount--;
    }
  }

  update() {
    if (this.body.velocity.y === 0 && !this.jumpCount)
      this.jumpCount = config.player.jumpNumber;
  }
}
