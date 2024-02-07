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
          this.setAjustedGap()
      );
      this.platFormList.push(platForm);
      MATTER.Composite.add(this.engine.world, platForm.getBody());
    }
  }

  setAjustedGap(): number {
    return config.platForm.gap * (Math.random() * 3) + 1;
  }

  movePlatforms(): void {
    this.platFormList.forEach((platForm) => {
      if (platForm.hasDisappeared()) {
        const x =
          this.platFormList[this.platFormList.length - 1].getRightCoord();

        platForm.moveToRight(x + this.setAjustedGap());
        const tiptop = this.platFormList.shift();

        this.platFormList.push(tiptop as Platform);
      } else {
        platForm.moveLeft();
      }
    });
  }

  getPlatformList() {
    return this.platFormList;
  }

  update() {
    this.movePlatforms();
  }
}
