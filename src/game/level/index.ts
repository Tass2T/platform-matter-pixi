import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import Player from "../player";
import PlatformManager from "../platformManager/index.js";

export default class Level {
  _physicEngine: MATTER.Engine;
  _physicRenderer: MATTER.Render;
  _player: Player;
  _platformManager: PlatformManager;
  _levelContainer: PIXI.Container = new PIXI.Container();

  constructor() {
    this.initLevel();
  }

  async initLevel() {
    const texture = await PIXI.Assets.load("backdrop");
    const sprite = new PIXI.Sprite(texture);

    this._levelContainer.addChild(sprite);

    this._physicEngine = MATTER.Engine.create();
    this._physicEngine.gravity.scale = 0.003;
    this.initMouseListener();
    this._platformManager = new PlatformManager(
      this._physicEngine,
      this._levelContainer
    );

    this._player = new Player(this._physicEngine.world, this._levelContainer);
  }

  getLevelContainer(): PIXI.Container {
    return this._levelContainer;
  }

  initMouseListener() {
    window.addEventListener("keydown", (e) => this.makePlayerJump(e));
  }

  makePlayerJump(e: KeyboardEvent) {
    if (e.repeat) return;

    if (e.code === "Space") this._player.jump();
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
    }
  }

  destroy() {
    window.removeEventListener("keydown", () => this._player.jump());
  }
}
