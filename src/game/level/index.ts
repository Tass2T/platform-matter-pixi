import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import Player from "../player";
import PlatformManager from "../platformManager/index.js";
import config from "../../../gameConfig.js";
import ScoreBoard from "../scoreBoard/index.js";
import GameOverScreen from "../gameOver/index.js";
import InputManager from "../../utils/inputManager.js";

export default class Level {
  _gameState: "Menu" | "Game" | "GameOver" = "Menu";
  _physicEngine: MATTER.Engine;
  _physicRenderer: MATTER.Render;
  _levelContainer: PIXI.Container = new PIXI.Container();
  _backgroundContainer: PIXI.Container = new PIXI.Container();
  _propsContainer: PIXI.Container = new PIXI.Container();
  _frontPropsContainer: PIXI.Container = new PIXI.Container();
  _gameContainer: PIXI.Container = new PIXI.Container();
  _scoreContainer: PIXI.Container = new PIXI.Container();
  _gameOverContainer: PIXI.Container = new PIXI.Container();
  _player: Player;
  _platformManager: PlatformManager;
  _scoreBoard: ScoreBoard;
  _gameOverScreen: GameOverScreen;
  _inputManager: InputManager = new InputManager();

  constructor() {
    this._backgroundContainer.zIndex = 1;
    this._propsContainer.zIndex = 2;
    this._frontPropsContainer.zIndex = 3;
    this._gameContainer.zIndex = 4;
    this._scoreContainer.zIndex = 5;
    this._gameOverContainer.zIndex = 6;
    this._levelContainer.addChild(
      this._backgroundContainer,
      this._propsContainer,
      this._frontPropsContainer,
      this._gameContainer,
      this._scoreContainer,
      this._gameOverContainer
    );

    this.initEngine();

    this.setBackground();

    this.prepareGameOver();

    this.initLevel();
  }

  initEngine() {
    this._physicEngine = MATTER.Engine.create();
    this._physicEngine.gravity.scale = config.GRAVITY;
  }

  async setBackground() {
    const texture = await PIXI.Assets.load("backdrop");
    const skySprite = new PIXI.Sprite(texture);

    const seaTextures = await PIXI.Assets.load("seaProp");
    const seaSprite = new PIXI.AnimatedSprite(
      seaTextures.animations["glitter"]
    );
    seaSprite.anchor.set(0.5, 1);
    seaSprite.position.set(config.WIDTH / 2, config.HEIGHT * 1.2);
    seaSprite.animationSpeed = 0.1;
    seaSprite.play();
    this._backgroundContainer.addChild(skySprite, seaSprite);

    this.setProps();
    this.setFrontProps();
  }

  async setProps(): Promise<void> {
    const textures = await PIXI.Assets.load(["props2", "props1"]);

    let index = 0;
    for (const [key] of Object.entries(textures)) {
      const sprite = new PIXI.Sprite(textures[key]);
      sprite.anchor.set(0.5, 1);
      sprite.position.set(index, config.HEIGHT);
      index = index + config.WIDTH;
      this._propsContainer.addChild(sprite);
    }
  }

  async setFrontProps(): Promise<void> {
    const textures = await PIXI.Assets.load(["tree1", "tree2", "tree3"]);

    let index = 0;
    const frontPropsWidth = 500;
    const propsNeeded = Math.ceil(config.WIDTH / frontPropsWidth) + 2;
    const texturesKeys = Object.keys(textures);

    for (let i = 0; i < propsNeeded; i++) {
      const sprite = new PIXI.Sprite(
        textures[texturesKeys[Math.floor(Math.random() * texturesKeys.length)]]
      );
      sprite.width = frontPropsWidth;
      sprite.anchor.set(0.5, 0.7);
      sprite.position.set(index, config.HEIGHT);
      this._frontPropsContainer.addChild(sprite);
      index += frontPropsWidth - 100;
    }
  }

  updateProps() {
    this._propsContainer.children.forEach((prop) => {
      prop.getBounds().x -= 0.01 * this._platformManager.getGamespeed();
    });
  }

  async initLevel() {
    await PIXI.Assets.loadBundle("level");

    this.initKeyListener();
    this._platformManager = new PlatformManager(
      this._physicEngine,
      this._gameContainer
    );

    this._player = new Player(this._physicEngine.world, this._gameContainer);
    this._scoreBoard = new ScoreBoard(this._scoreContainer);
    this._gameState = "Game";
  }

  updateFrontProps(delta: number) {
    this._frontPropsContainer.children.forEach((prop) => {
      prop.position.x -= this._platformManager.getGamespeed() * delta;

      if (prop.position.x + prop.getBounds().width / 2 < 0) {
        // A REVOIR C'EST HORRIBLE
        prop.position.x =
          (this._frontPropsContainer.children.length - 1) *
            prop.getBounds().width -
          this._frontPropsContainer.children.length * 100;
      }
    });
  }

  getLevelContainer(): PIXI.Container {
    return this._levelContainer;
  }

  initKeyListener() {
    window.addEventListener("keydown", (e) => this.makePlayerJump(e));
    window.addEventListener("keyup", (e) => this.stopPlayerJump(e));
  }

  makePlayerJump(e: KeyboardEvent) {
    if (e.repeat) return;

    if (e.code === "Space") this._player.setIsJumping(true);
  }

  stopPlayerJump(e: KeyboardEvent) {
    if (e.code === "Space") this._player.stopVelocity();
  }

  checkForCollisionWithPlatform() {
    this._platformManager.getPlatformList().forEach((platform) => {
      const collision = MATTER.Collision.collides(
        this._player.getBody(),
        platform.getBody()
      );
      if (collision?.collided && collision.normal.y === 1)
        this._player.resetJump();
    });
  }

  checkForCollisionWithDiamond() {
    this._platformManager.getPlatformList().forEach((platForm) => {
      platForm.getDiamondList().forEach((diamond) => {
        const collision = MATTER.Collision.collides(
          this._player.getBody(),
          diamond.getBody()
        );
        if (collision?.collided && !diamond.getHasBeenTaken()) {
          diamond.setHasBeenTaken(true);
          this._scoreBoard.addToScore(config.diamond.points);

          this._platformManager.increaseGamespeed();
        }
      });
    });
  }

  prepareGameOver() {
    this._gameOverScreen = new GameOverScreen(
      this._gameOverContainer,
      this.resetLevel
    );
  }

  checkIfPlayerFell(): void {
    if (this._player.hasFallen()) {
      this._platformManager.setGameSpeed(0);
      this._gameState = "GameOver";
      this._gameOverScreen.appear();
    }
  }

  resetLevel = (): void => {
    this._scoreBoard.resetScore();
  };

  update(delta: number) {
    if (this._physicEngine) {
      MATTER.Engine.update(this._physicEngine, delta);
      if (this._gameState === "Game") {
        this._player.update();
        this.checkForCollisionWithDiamond();
        this.checkForCollisionWithPlatform();
        this._platformManager.update(delta);
        this.updateProps();
        this.updateFrontProps(delta);
        this._scoreBoard.update();
        this.checkIfPlayerFell();
      } else {
        this._gameOverScreen.update(this._inputManager.getPressedInputs());
      }
    }
  }

  destroy() {
    window.removeEventListener("keydown", () => this._player.addVelocity());
    window.removeEventListener("keyup", (e) => this.stopPlayerJump(e));
  }
}
