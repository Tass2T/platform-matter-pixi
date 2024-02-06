import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";
import Player from "../player";
import PlatformManager from "../platform/index.js";

export default class Level {
  physicEngine: MATTER.Engine;
  physicRenderer: MATTER.Render;
  player: Player;
  platformManager: PlatformManager;

  constructor() {
    this.initPhysicEngine();
    this.initMouseListener();
    this.platformManager = new PlatformManager(this.physicEngine);

    this.player = new Player();

    MATTER.Composite.add(this.physicEngine.world, [this.player.body]);
  }

  initPhysicEngine() {
    this.physicEngine = MATTER.Engine.create();
    this.physicRenderer = MATTER.Render.create({
      element: document.body,
      engine: this.physicEngine,
    });

    this.physicRenderer.canvas.height = config.HEIGHT;
    this.physicRenderer.canvas.width = config.WIDTH;

    // run the renderer
    MATTER.Render.run(this.physicRenderer);

    // create runner
    const runner = MATTER.Runner.create();

    // run the engine
    MATTER.Runner.run(runner, this.physicEngine);
  }

  initMouseListener() {
    window.addEventListener("pointerdown", () => this.player.jump());
  }

  checkForCollision() {
    this.platformManager.getPlatformList().forEach((platform) => {
      const collision = MATTER.Collision.collides(this.player.body, platform);
      if (collision?.collided && collision.normal.y === 1)
        this.player.resetJump();
    });
  }

  update() {
    MATTER.Engine.update(this.physicEngine);
    this.checkForCollision();
    this.platformManager.update();
  }

  destroy() {
    window.removeEventListener("pointerdown", () => this.player.jump());
  }
}
