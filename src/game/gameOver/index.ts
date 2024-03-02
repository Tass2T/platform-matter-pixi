import { Container, Graphics } from "pixi.js";
import config from "../../../gameConfig.js";

export default class GameOverScreen {
  _parentContainer: Container;
  _background: Graphics;
  _counter: number;
  _resetFunction: Function;
  constructor(parentContainer: Container, resetFunction: Function) {
    this._parentContainer = parentContainer;
    this._resetFunction = resetFunction;
    this._parentContainer.visible = false;
    this.initGraphics();
  }

  initGraphics() {
    this._background = new Graphics();
    this._background.beginFill(0x000000);
    this._background.drawRect(0, 0, config.WIDTH, config.HEIGHT);
    this._background.alpha = 0.7;
    this._parentContainer.addChild(this._background);
  }

  appear() {
    this._parentContainer.visible = true;
    this._counter = 0;
  }

  disappear() {
    this._parentContainer.visible = false;
  }

  resetLevel() {
    this._resetFunction();
  }

  incrementConter(value: number): void {
    this._counter += value;
  }

  update(inputArrays: Array<String>) {
    if (inputArrays.includes("Space")) {
      this.incrementConter(1);
    } else if (this._counter > 0) {
      this.incrementConter(-1);
    }
    if (this._counter === 100) this.resetLevel();
  }
}
