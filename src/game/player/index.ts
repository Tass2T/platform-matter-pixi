import * as MATTER from "matter-js";

export default class Player {
  body: MATTER.Body;
  jumpCount: number = 2;
  constructor() {
    this.body = MATTER.Bodies.rectangle(10, 10, 10, 10);
  }

  jump() {
    if (this.jumpCount > 0) {
      MATTER.Body.setVelocity(this.body, { x: 0, y: -10 });
      this.jumpCount--;
    }
  }
}
