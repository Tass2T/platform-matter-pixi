import Level from "./level";
import * as PIXI from "pixi.js";

export default class Game {
  #pixiApp: PIXI.Application;
  _level: Level;
  constructor() {
    this.#pixiApp = new PIXI.Application({
      height: window.innerHeight,
      width: window.innerWidth,
      background: "#aabbff",
    });
    document.body.appendChild(this.#pixiApp.view as HTMLCanvasElement);
    this._level = new Level();
    this.#pixiApp.stage.addChild(this._level.getLevelContainer());
    this.#pixiApp.ticker.maxFPS = 60;
    this.#pixiApp.ticker.add(() => {
      this.update();
    });
  }

  update() {
    this._level.update();
  }
}
