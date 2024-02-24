import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import Player from "../player";
import PlatformManager from "../platformManager/index.js";
import config from "../../../gameConfig.js";

export default class Level {
  _physicEngine: MATTER.Engine;
  _physicRenderer: MATTER.Render;
  _player: Player;
  _platformManager: PlatformManager;
  _levelContainer: PIXI.Container = new PIXI.Container();
  _backgroundContainer: PIXI.Container = new PIXI.Container();
  _propsContainer: PIXI.Container = new PIXI.Container();
  _gameContainer: PIXI.Container = new PIXI.Container();
  _propsList: Array<PIXI.Sprite> = [];

  constructor() {
    this.initLevel();
  }

  async initLevel() {
    this._backgroundContainer.zIndex = 1;
    this._propsContainer.zIndex = 2;
    this._gameContainer.zIndex = 3;
    this._levelContainer.addChild(
      this._backgroundContainer,
      this._propsContainer,
      this._gameContainer
    );

    this.setBackground();
    this.setProps();

    this._physicEngine = MATTER.Engine.create();
    this._physicEngine.gravity.scale = 0.003;
    this.initKeyListener();
    this._platformManager = new PlatformManager(
      this._physicEngine,
      this._gameContainer
    );

    this._player = new Player(this._physicEngine.world, this._gameContainer);
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
  }

  async setProps() {
    const textures = await PIXI.Assets.load(["props2", "props1"]);
    console.log(textures);

    let index = 0;
    for (const [key] of Object.entries(textures)) {
      const sprite = new PIXI.Sprite(textures[key]);
      sprite.x = config.WIDTH / 3;
      sprite.anchor.set(0.5, 1);
      sprite.position.set(index, config.HEIGHT);
      index = index + config.WIDTH;
      this._propsList.push(sprite);
      this._propsContainer.addChild(sprite);
    }
  }

  updateProps() {
    this._propsList.forEach((prop) => {
      prop.position.x -= 0.01 * this._platformManager.getGamespeed();
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

    if (e.code === "Space") this._player.addVelocity();
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
          this._platformManager.increaseGamespeed();
        }
      });
    });
  }

  checkIfPlayerFell(): void {
    if (this._player.hasFallen()) this._platformManager.setGameSpeed(0);
  }

  update() {
    if (this._physicEngine) {
      MATTER.Engine.update(this._physicEngine);
      this._player.update();
      this.checkIfPlayerFell();
      this.checkForCollisionWithDiamond();
      this.checkForCollisionWithPlatform();
      this._platformManager.update();
      this.updateProps();
    }
  }

  destroy() {
    window.removeEventListener("keydown", (e) => this._player.addVelocity(e));
    window.removeEventListener("keyup", (e) => this.stopPlayerJump(e));
  }
}
