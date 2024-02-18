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
    this._physicEngine = MATTER.Engine.create();
    this.initMouseListener();
    this._platformManager = new PlatformManager(this._physicEngine);

    this._player = new Player(this._physicEngine.world, this._levelContainer);
    this.addAllItems();
  }

  getLevelContainer(): PIXI.Container {
    return this._levelContainer;
  }

  addAllItems() {
    this._platformManager.getAllObjects().forEach((item) => {
      this._levelContainer.addChild(item.getSprite());
    });
  }

  initMouseListener() {
    window.addEventListener("pointerdown", () => this._player.jump());
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
    this._platformManager.getDiamondList().forEach((diamond) => {
      const collision = MATTER.Collision.collides(
        this._player.getBody(),
        diamond.getBody()
      );
      if (collision?.collided && !diamond.getHasBeenTaken()) {
        diamond.setHasBeenTaken(true);
        this._platformManager.increaseGamespeed();
      }
    });
  }

  checkIfPlayerFell(): void {
    if (this._player.hasFallen()) this._platformManager.setGameSpeed(0);
  }

  update() {
    MATTER.Engine.update(this._physicEngine);
    this._player.update();
    this.checkIfPlayerFell();
    this.checkForCollisionWithDiamond();
    this.checkForCollisionWithPlatform();
    this._platformManager.update();
  }

  destroy() {
    window.removeEventListener("pointerdown", () => this._player.jump());
  }
}
