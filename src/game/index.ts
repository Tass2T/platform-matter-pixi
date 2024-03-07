import Level from "./states/level/index.js";
import { Application, Ticker } from "pixi.js";
import config from "../../gameConfig.js";
import { initAssetsBundles } from "../utils/loaderUtils.js";

export default class Game {
  #pixiApp: Application;
  _level: Level;
  constructor() {
    this.#pixiApp = new Application();

    this.#pixiApp
      .init({
        height: config.HEIGHT,
        width: config.WIDTH,
        antialias: false,
        premultipliedAlpha: false,
      })
      .then(() => {
        this.#pixiApp.stage.interactiveChildren = false;

        if (!config.PHYSIC_DEBUG_MODE)
          document.body.appendChild(this.#pixiApp.canvas as HTMLCanvasElement);
        this.initGame();
      });
  }

  async initGame() {
    await initAssetsBundles();

    this._level = new Level();
    this.#pixiApp.stage.addChild(this._level.getLevelContainer());
    this.#pixiApp.ticker.maxFPS = 60;
    this.#pixiApp.ticker.add((ticker: Ticker) => {
      this.update(ticker.deltaTime);
    });
  }

  update(delta: number) {
    this._level.update(delta);
  }
}
