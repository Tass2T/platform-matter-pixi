import Level from "./level";
import * as PIXI from "pixi.js";
import config from "../../gameConfig.js";

export default class Game {
  #pixiApp: PIXI.Application;
  #level: Level;
  constructor() {
    this.#pixiApp = new PIXI.Application({
      height: config.HEIGHT,
      width: config.WIDTH,
      background: "#aabbff",
    });
    document.body.appendChild(this.#pixiApp.view as HTMLCanvasElement);
    this.#level = new Level();
    this.#pixiApp.stage.addChild(this.#level.getLevelContainer());

    this.#pixiApp.ticker.maxFPS = 60;
    this.#pixiApp.ticker.add(() => {
      this.update();
    });
  }

  update() {
    this.#level.update();
  }
}
