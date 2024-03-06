import * as MATTER from "matter-js";
import { Container } from "pixi.js";
import config from "../../../../gameConfig.js";
import Platform from "../platform/index.js";

export default class PlatformManager {
  _engine: MATTER.Engine;
  _platFormList: Array<Platform> = [];
  _gameSpeed: number = config.SPEED;
  constructor(engineWorld: MATTER.Engine, parentContainer: Container) {
    this._engine = engineWorld;
    this.createPlatforms(parentContainer);
  }

  getGamespeed() {
    return this._gameSpeed;
  }

  getPlatformList() {
    return this._platFormList;
  }

  increaseGamespeed() {
    if (this._gameSpeed < config.MAXSPEED) this._gameSpeed += 0.05;
  }

  setGameSpeed(newValue: number): void {
    this._gameSpeed = newValue;
  }

  createPlatforms(levelContainer: Container) {
    for (let i = 1; i <= 6; i++) {
      const x =
        i === 1
          ? config.platForm.start
          : this._platFormList[this._platFormList.length - 1].getRightCoord() +
            this.setAjustedGap();
      const ground = new Platform("standard", x, levelContainer, i === 1);

      this._platFormList.push(ground);
      MATTER.Composite.add(this._engine.world, ground.getBody());
    }
  }

  resetPlatforms(): void {
    for (let i = 0; i < this._platFormList.length; i++) {
      const x =
        i === 0
          ? config.platForm.start
          : this._platFormList[i - 1].getRightCoord() + this.setAjustedGap();

      const y =
        i === 0 ? config.HEIGHT / 2 : this._platFormList[i].getAdjustedHeight();

      this._platFormList[i].setPosition(x, y);
      this._platFormList[i]._diamondList.forEach((diamond) => {
        diamond.syncPosition();
        diamond.syncSpriteWithBody();
        if (diamond._boundWithFirstPlatform) diamond.hide();
      });
    }
  }

  setAjustedGap(): number {
    return (
      config.platForm.gap * (Math.random() * 3) +
      (this._gameSpeed ? this._gameSpeed : config.SPEED)
    );
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

  syncPlatforms(delta: number) {
    this._platFormList.forEach((platform) => {
      platform.update(delta);
    });
  }

  update(delta: number) {
    this.movePlatforms(delta);
    this.syncPlatforms(delta);
  }
}
