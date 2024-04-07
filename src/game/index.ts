import Level from "./states/level/index.js";
import { Application, Ticker } from "pixi.js";
import config from "../../gameConfig.ts";
import { initAssetsBundles } from "../utils/loaderUtils.js";
import Menu from "./states/menu/index.js";
import GameOverScreen from "./states/gameOver/index.js";
import InputManager from "../utils/inputManager.js";
import ScoreBoard from "./components/scoreBoard/index.js";

export default class Game {
  #pixiApp: Application;
  #inputManager: InputManager = new InputManager();
  currentGameState: "menu" | "level" | "gameOver" = "menu";
  gameStates: {
    menu: Menu;
    level: Level;
    gameOver: GameOverScreen;
  };
  #scoreBoard: ScoreBoard;
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

    this.#scoreBoard = new ScoreBoard(this.#pixiApp.stage);

    this.gameStates = {
      menu: new Menu(this.#pixiApp.stage, this.changeState, this.#scoreBoard),
      level: new Level(this.#pixiApp.stage, this.changeState, this.#scoreBoard),
      gameOver: new GameOverScreen(
        this.#pixiApp.stage,
        this.#scoreBoard,
        this.changeState
      ),
    };

    this.#pixiApp.ticker.maxFPS = 60;
    this.#pixiApp.ticker.add((ticker: Ticker) => {
      this.update(ticker.deltaTime);
    });
  }

  changeState = (newState: "menu" | "level" | "gameOver"): void => {
    this.currentGameState = newState;
    this.gameStates[this.currentGameState].start();
  };

  update(delta: number) {
    this.gameStates[this.currentGameState].update(
      delta,
      this.#inputManager.getPressedInputs()
    );
  }
}
