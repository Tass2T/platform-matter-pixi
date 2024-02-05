import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";

export default class PlatformManager {
  engine: MATTER.Engine;
  platFormList: Array<MATTER.Body> = [];
  constructor(engineWorld: MATTER.Engine) {
    this.engine = engineWorld;
    this.createInitialPlatForms();
    this.initVelocity();
  }

  createInitialPlatForms() {
    const ground = MATTER.Bodies.rectangle(
      200,
      config.HEIGHT,
      config.platForm.standard.width,
      config.HEIGHT,
      {
        isStatic: true,
      }
    );
    this.platFormList.push(ground);

    for (let i = 0; i < 4; i++) {
      const platForm = MATTER.Bodies.rectangle(
        800,
        config.HEIGHT,
        config.platForm.standard.width,
        config.HEIGHT,
        { isStatic: true }
      );

      this.platFormList.push(platForm);
    }

    MATTER.Composite.add(this.engine.world, this.platFormList);
  }

  initVelocity() {
    this.platFormList.forEach((platForm) => {
      MATTER.Body.setVelocity(platForm, { x: 0.1, y: 0 });
    });
  }

  getPlatformList() {
    return this.platFormList;
  }
}
