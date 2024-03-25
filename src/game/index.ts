import Level from "./states/level/index.js";
import { Application, Ticker } from "pixi.js";
import config from "../../gameConfig.js";
import { initAssetsBundles } from "../utils/loaderUtils.js";
import Menu from "./states/menu/index.js";
import GameOverScreen from "./states/gameOver/index.js";
import InputManager from "../utils/inputManager.js";
import ScoreBoard from "./components/scoreBoard/index.js";

export default class Game {
  _pixiApp: Application;
  _inputManager: InputManager = new InputManager();
  _currentGameState: "menu" | "level" | "gameOver" = "level";
  _gameStates: {
    menu: Menu;
    level: Level;
    gameOver: GameOverScreen;
  };
  _scoreBoard: ScoreBoard;
  constructor() {
    this._pixiApp = new Application();

    this._pixiApp
      .init({
        height: config.HEIGHT,
        width: config.WIDTH,
        antialias: false,
        premultipliedAlpha: false,
      })
      .then(() => {
        this._pixiApp.stage.interactiveChildren = false;

        if (!config.PHYSIC_DEBUG_MODE)
          document.body.appendChild(this._pixiApp.canvas as HTMLCanvasElement);
        this.initGame();
      });
  }

  async initGame() {
    await initAssetsBundles();

    this._scoreBoard = new ScoreBoard(this._pixiApp.stage);

    this._gameStates = {
      menu: new Menu(),
      level: new Level(),
      gameOver: new GameOverScreen(
        this._pixiApp.stage,
        this.resetLevel,
        this._scoreBoard
      ),
    };

    this._pixiApp.ticker.maxFPS = 60;
    this._pixiApp.ticker.add((ticker: Ticker) => {
      this.update(ticker.deltaTime);
    });
  }

  resetLevel() {
    this._gameStates.level.resetLevel();
  }

  update(delta: number) {
    this._gameStates[this._currentGameState].update(
      delta,
      this._inputManager.getPressedInputs()
    );
  }
}
