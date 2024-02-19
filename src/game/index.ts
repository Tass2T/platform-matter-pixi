import Level from "./level";
import * as PIXI from "pixi.js";
import config from "../../gameConfig.js";
import { initAssetsBundles } from "../utils/loaderUtils.js";

export default class Game {
  #pixiApp: PIXI.Application;
  _level: Level;
  constructor() {
    this.#pixiApp = new PIXI.Application({
      height: config.HEIGHT,
      width: config.WIDTH,
      background: "#aabbff",
    });
    document.body.appendChild(this.#pixiApp.view as HTMLCanvasElement);
    initAssetsBundles();
    this._level = new Level();
    this.#pixiApp.stage.addChild(this._level.getLevelContainer());
    this.#pixiApp.ticker.maxFPS = 60;
    this.#pixiApp.ticker.add((delta) => {
      this.update(delta);
    });
  }

  update(delta: number) {
    this._level.update();
  }
}
