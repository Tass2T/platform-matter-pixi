import * as MATTER from "matter-js";
import config from "../../../gameConfig.js";
import Player from "@/game/player/index";

export default class Level {
  physicEngine: MATTER.Engine;
  physicRenderer: MATTER.Render;
  player: Player;
  constructor() {
    // INIT PHYSICS
    this.physicEngine = MATTER.Engine.create();
    this.physicRenderer = MATTER.Render.create({
      element: document.body,
      engine: this.physicEngine,
    });
    this.physicRenderer.canvas.height = config.HEIGHT;
    this.physicRenderer.canvas.width = config.WIDTH;

    // create two boxes and a ground
    const ground = MATTER.Bodies.rectangle(400, 610, 810, 60, {
      isStatic: true,
    });

    // add all of the bodies to the world
    MATTER.Composite.add(this.physicEngine.world, [ground]);

    // run the renderer
    MATTER.Render.run(this.physicRenderer);

    // create runner
    const runner = MATTER.Runner.create();

    // run the engine
    MATTER.Runner.run(runner, this.physicEngine);
  }
}
