import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../gameConfig.js";
import Player from "../player";
import PlatformManager from "../platformManager/index.js";

export default class Level {
  #physicEngine: MATTER.Engine;
  #physicRenderer: MATTER.Render;
  #player: Player;
  #platformManager: PlatformManager;
  #levelContainer: PIXI.Container = new PIXI.Container();

  constructor() {
    this.initphysicEngine();
    this.initMouseListener();
    this.#platformManager = new PlatformManager(this.#physicEngine);

    this.#player = new Player();

    MATTER.Composite.add(this.#physicEngine.world, [this.#player.getBody()]);
    this.addAllItems();
  }

  getLevelContainer(): PIXI.Container {
    return this.#levelContainer;
  }

  addAllItems() {
    this.#platformManager.getAllObjects().forEach((item) => {
      this.#levelContainer.addChild(item.getSprite());
    });
    this.#levelContainer.addChild(this.#player.getSprite());
  }

  initphysicEngine() {
    this.#physicEngine = MATTER.Engine.create();

    if (Number(import.meta.env.VITE_SHOW_PHYSICAL_RENDERER)) {
      this.#physicRenderer = MATTER.Render.create({
        element: document.body,
        engine: this.#physicEngine,
      });

      this.#physicRenderer.canvas.height = config.HEIGHT;
      this.#physicRenderer.canvas.width = config.WIDTH;

      // run the renderer
      MATTER.Render.run(this.#physicRenderer);
    }

    // create runner
    const runner = MATTER.Runner.create();

    // run the engine
    MATTER.Runner.run(runner, this.#physicEngine);
  }

  initMouseListener() {
    window.addEventListener("pointerdown", () => this.#player.jump());
  }

  checkForCollisionWithPlatform() {
    this.#platformManager.getPlatformList().forEach((platform) => {
      const collision = MATTER.Collision.collides(
        this.#player.getBody(),
        platform.getBody()
      );
      if (collision?.collided && collision.normal.y === 1)
        this.#player.resetJump();
    });
  }

  checkForCollisionWithDiamond() {
    this.#platformManager.getDiamondList().forEach((diamond) => {
      const collision = MATTER.Collision.collides(
        this.#player.getBody(),
        diamond.getBody()
      );
      if (collision?.collided && !diamond.getHasBeenTaken()) {
        diamond.setHasBeenTaken(true);
        this.#platformManager.increaseGamespeed();
      }
    });
  }

  checkIfPlayerFell(): void {
    if (this.#player.hasFallen()) this.#platformManager.setGameSpeed(0);
  }

  update() {
    MATTER.Engine.update(this.#physicEngine);
    this.#player.update();
    this.checkIfPlayerFell();
    this.checkForCollisionWithDiamond();
    this.checkForCollisionWithPlatform();
    this.#platformManager.update();
  }

  destroy() {
    window.removeEventListener("pointerdown", () => this.#player.jump());
  }
}
