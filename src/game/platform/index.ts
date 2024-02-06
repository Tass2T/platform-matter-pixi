import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";

export default class PlatformManager {
  engine: MATTER.Engine;
  platFormList: Array<MATTER.Body> = [];
  constructor(engineWorld: MATTER.Engine) {
    this.engine = engineWorld;
    this.createInitialPlatForms();
    this.createAdditionnalPlatforms();
  }

  createInitialPlatForms() {
    const ground = MATTER.Bodies.rectangle(
      200,
      config.HEIGHT * 0.8,
      config.platForm.standard.width,
      config.platForm.standard.height,
      {
        isStatic: true,
      }
    );
    this.platFormList.push(ground);
  }

  createAdditionnalPlatforms() {
    for (let i = 1; i <= 3; i++) {
      const platForm = MATTER.Bodies.rectangle(
        500 * i,
        config.HEIGHT * Math.random(),
        config.platForm.standard.width,
        config.platForm.standard.height,
        { isStatic: true }
      );

      this.platFormList.push(platForm);
    }

    MATTER.Composite.add(this.engine.world, this.platFormList);
  }

  movePlatforms(): void {
    this.platFormList.forEach((platForm) => {
      MATTER.Body.setPosition(platForm, {
        x: platForm.position.x - config.SPEED,
        y: platForm.position.y,
      });
    });
  }

  getPlatformList() {
    return this.platFormList;
  }

  update() {
    this.movePlatforms();
  }
}
