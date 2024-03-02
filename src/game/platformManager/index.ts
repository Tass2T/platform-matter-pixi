import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../gameConfig.js";
import Platform from "../platform/index.js";
import Diamond from "../diamond/index.js";

export default class PlatformManager {
  _engine: MATTER.Engine;
  _platFormList: Array<Platform> = [];
  _diamondList: Array<Diamond> = [];
  _gameSpeed: number = config.SPEED;
  constructor(engineWorld: MATTER.Engine, parentContainer: PIXI.Container) {
    this._engine = engineWorld;
    this.createInitialPlatForms(parentContainer);
    this.createAdditionnalPlatforms(parentContainer);
    this.registerPlatformAndDiamonds();
  }

  getGamespeed() {
    return this._gameSpeed;
  }

  getAllObjects(): Array<Diamond | Platform> {
    return [...this._platFormList, ...this._diamondList];
  }

  increaseGamespeed() {
    this._gameSpeed += 0.05;
  }

  createInitialPlatForms(levelContainer: PIXI.Container) {
    const ground = new Platform(
      "standard",
      config.platForm.start,
      levelContainer,
      true
    );
    this._diamondList.push(...ground.getDiamondList());
    this._platFormList.push(ground);
  }

  createAdditionnalPlatforms(levelContainer: PIXI.Container) {
    for (let i = 1; i <= 5; i++) {
      const platForm = new Platform(
        "standard",
        this._platFormList[this._platFormList.length - 1].getRightCoord() +
          this.setAjustedGap(),
        levelContainer
      );
      this._platFormList.push(platForm);
      this._diamondList.push(...platForm.getDiamondList());
    }
  }

  registerPlatformAndDiamonds() {
    this._platFormList.forEach((platform) => {
      MATTER.Composite.add(this._engine.world, platform.getBody());

      platform.getDiamondList().forEach((diamond) => {
        MATTER.Composite.add(this._engine.world, diamond.getBody());
      });
    });
  }

  setAjustedGap(): number {
    return config.platForm.gap * (Math.random() * 3) + this._gameSpeed;
  }

  setGameSpeed(newValue: number): void {
    this._gameSpeed = newValue;
  }

  getFarfestXCoord(): number {
    let result = 0;

    for (let i = 0; i < this._platFormList.length; i++) {
      if (this._platFormList[i].getRightCoord() > result)
        result = this._platFormList[i].getRightCoord();
    }

    return result;
  }

  movePlatforms(delta: number): void {
    this._platFormList.forEach((platForm) => {
      if (platForm.hasDisappeared()) {
        const x = this.getFarfestXCoord();

        platForm.moveToRight(x + this.setAjustedGap());
      } else {
        platForm.moveLeft(this._gameSpeed * delta);
      }
    });
  }

  getPlatformList() {
    return this._platFormList;
  }

  getDiamondList() {
    return this._diamondList;
  }

  syncPlatforms() {
    this._platFormList.forEach((platform) => {
      platform.update();
    });
  }

  update(delta: number) {
    this.movePlatforms(delta);
    this.syncPlatforms();
  }
}
