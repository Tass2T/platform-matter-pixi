import { Container, Graphics } from "pixi.js";
import config from "../../../gameConfig.js";

export default class GameOverScreen {
  _parentContainer: Container;
  _background: Graphics;
  constructor(parentContainer: Container) {
    this._parentContainer = parentContainer;

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
  }
}
