import Level from "./states/level/index.js";
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
      antialias: false,
      premultipliedAlpha: false,
    });
    this.#pixiApp.stage.interactiveChildren = false;
    if (!config.PHYSIC_DEBUG_MODE)
      document.body.appendChild(this.#pixiApp.view as HTMLCanvasElement);
    this.initGame();
  }

  async initGame() {
    await initAssetsBundles();
    this._level = new Level();
    this.#pixiApp.stage.addChild(this._level.getLevelContainer());
    this.#pixiApp.ticker.maxFPS = 60;
    this.#pixiApp.ticker.add((delta) => {
      this.update(delta);
    });
  }

  update(delta: number) {
    this._level.update(delta);
  }
}
