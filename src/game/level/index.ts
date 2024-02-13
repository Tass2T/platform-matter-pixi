import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../gameConfig.js";
import Player from "../player";
import PlatformManager from "../platformManager/index.js";

export default class Level {
  _physicEngine: MATTER.Engine;
  _physicRenderer: MATTER.Render;
  _player: Player;
  _platformManager: PlatformManager;
  _levelContainer: PIXI.Container = new PIXI.Container();

  constructor() {
    this.initphysicEngine();
    this.initMouseListener();
    this._platformManager = new PlatformManager(this._physicEngine);

    this._player = new Player();

    MATTER.Composite.add(this._physicEngine.world, [this._player.getBody()]);
    this.addAllItems();
  }

  getLevelContainer(): PIXI.Container {
    return this._levelContainer;
  }

  addAllItems() {
    this._platformManager.getAllObjects().forEach((item) => {
      this._levelContainer.addChild(item.getSprite());
    });
    this._levelContainer.addChild(this._player.getSprite());
  }

  initphysicEngine() {
    this._physicEngine = MATTER.Engine.create();

    if (Number(import.meta.env.VITE_SHOW_PHYSICAL_RENDERER)) {
      this._physicRenderer = MATTER.Render.create({
        element: document.body,
        engine: this._physicEngine,
      });

      this._physicRenderer.canvas.height = config.HEIGHT;
      this._physicRenderer.canvas.width = config.WIDTH;

      // run the renderer
      MATTER.Render.run(this._physicRenderer);
    }

    // create runner
    const runner = MATTER.Runner.create();

    // run the engine
    MATTER.Runner.run(runner, this._physicEngine);
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
