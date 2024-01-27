import Level from "./level";
import * as PIXI from "pixi.js";

export default class Game {
  pixiApp: PIXI.Application;
  level: Level;
  constructor() {
    this.pixiApp = new PIXI.Application({
      height: 0,
      width: 0,
    });
    document.body.appendChild(this.pixiApp.view as HTMLCanvasElement);
    this.level = new Level();

    this.pixiApp.ticker.maxFPS = 60;
    this.pixiApp.ticker.add(() => {
      this.update();
    });
  }

  update() {
    this.level.update();
  }
}
