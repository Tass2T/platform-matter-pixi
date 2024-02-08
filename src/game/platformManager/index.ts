import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";
import Platform from "../platform/index.js";
import Diamond from "../diamond/index.js";

export default class PlatformManager {
  engine: MATTER.Engine;
  platFormList: Array<Platform> = [];
  diamondList: Array<Diamond> = [];
  gameSpeed: number = config.SPEED;
  constructor(engineWorld: MATTER.Engine) {
    this.engine = engineWorld;
    this.createInitialPlatForms();
    this.createAdditionnalPlatforms();
    this.registerPlatformAndDiamonds();
  }

  getGamespeed() {
    return this.gameSpeed;
  }

  increaseGamespeed() {
    this.gameSpeed += 0.1;
  }

  createInitialPlatForms() {
    const ground = new Platform("standard", config.platForm.start, true);
    this.diamondList.push(...ground.getDiamondList());
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
      this.diamondList.push(...platForm.getDiamondList());
    }
  }

  registerPlatformAndDiamonds() {
    this.platFormList.forEach((platform) => {
      MATTER.Composite.add(this.engine.world, platform.getBody());

      platform.getDiamondList().forEach((diamond) => {
        MATTER.Composite.add(this.engine.world, diamond.getBody());
      });
    });
  }

  setAjustedGap(): number {
    return config.platForm.gap * (Math.random() * 3) + 1;
  }

  setGameSpeed(newValue: number): void {
    this.gameSpeed = newValue;
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
        platForm.moveLeft(this.gameSpeed);
      }
    });
  }

  getPlatformList() {
    return this.platFormList;
  }

  getDiamondList() {
    return this.diamondList;
  }

  syncDiamonds() {
    this.diamondList.forEach((diamond) => {
      diamond.syncPosition();
    });
  }

  update() {
    this.movePlatforms();
    this.syncDiamonds();
  }
}
