import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";
import Player from "../player";

export default class Level {
  physicEngine: MATTER.Engine;
  physicRenderer: MATTER.Render;
  player: Player;
  constructor() {
    this.initPhysicEngine();

    // create two boxes and a ground
    const ground = MATTER.Bodies.rectangle(
      config.WIDTH / 2,
      config.HEIGHT - 30,
      config.WIDTH,
      60,
      {
        isStatic: true,
      }
    );

    this.player = new Player();

    MATTER.Composite.add(this.physicEngine.world, [ground, this.player.body]);

    // add all of the bodies to the world
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
}
