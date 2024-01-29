import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";

export default class PlatformManager {
  engine: MATTER.Engine;
  platFormList: Array<MATTER.Body> = [];
  constructor(engineWorld: MATTER.Engine) {
    this.engine = engineWorld;
    this.createInitialPlatForm();
  }

  createInitialPlatForm() {
    const ground = MATTER.Bodies.rectangle(
      config.WIDTH / 2,
      config.HEIGHT - 30,
      config.WIDTH,
      100,
      {
        isStatic: true,
      }
    );
    this.platFormList.push(ground);

    MATTER.Composite.add(this.engine.world, [ground]);
  }

  getPlatformList() {
    return this.platFormList;
  }
}
