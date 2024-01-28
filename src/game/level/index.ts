import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";
import Player from "../player";
import Platform from "../platform/index.js";

export default class Level {
  physicEngine: MATTER.Engine;
  physicRenderer: MATTER.Render;
  player: Player;
  platFormList: Array<MATTER.Body> = [];
  constructor() {
    this.initPhysicEngine();
    this.initMouseListener();
    // create two boxes and a ground
    const ground = MATTER.Bodies.rectangle(
      config.WIDTH / 2,
      config.HEIGHT - 30,
      config.WIDTH,
      100,
      {
        isStatic: true,
      }
    );
    this.platFormList.push(ground);

    this.player = new Player();

    MATTER.Composite.add(this.physicEngine.world, [ground, this.player.body]);
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
    this.platFormList.forEach((platform) => {
      const collision = MATTER.Collision.collides(this.player.body, platform);
      if (collision?.collided && collision.normal.y === 1)
        this.player.resetJump();
    });
  }

  update() {
    MATTER.Engine.update(this.physicEngine);
    this.checkForCollision();
    // if (this.player) this.player.update();
  }

  destroy() {
    window.removeEventListener("pointerdown", () => this.player.jump());
  }
}
