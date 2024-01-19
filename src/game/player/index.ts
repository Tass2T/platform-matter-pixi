import * as MATTER from "matter-js";

export default class Player {
  body: MATTER.Body;
  constructor() {
    this.body = MATTER.Bodies.rectangle(10, 10, 10, 10);
  }
}
