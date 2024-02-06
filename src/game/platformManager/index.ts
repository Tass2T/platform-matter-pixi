import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";
import Platform from "../platform/index.js";

export default class PlatformManager {
  engine: MATTER.Engine;
  platFormList: Array<Platform> = [];
  constructor(engineWorld: MATTER.Engine) {
    this.engine = engineWorld;
    this.createInitialPlatForms();
    this.createAdditionnalPlatforms();
  }

  createInitialPlatForms() {
    const ground = new Platform("standard", config.platForm.start, true);
    MATTER.Composite.add(this.engine.world, ground.getBody());
    this.platFormList.push(ground);
  }

  createAdditionnalPlatforms() {
    for (let i = 1; i <= 5; i++) {
      const platForm = new Platform(
        "standard",
        this.platFormList[this.platFormList.length - 1].getRightCoord() +
          config.platForm.gap
      );
      this.platFormList.push(platForm);
      MATTER.Composite.add(this.engine.world, platForm.getBody());
    }
  }

  movePlatforms(): void {
    this.platFormList.forEach((platForm) => {
      platForm.moveLeft();
    });
  }

  getPlatformList() {
    return this.platFormList;
  }

  update() {
    this.movePlatforms();
  }
}
