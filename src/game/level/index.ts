import * as MATTER from "matter-js";

export default class Level {
  physicEngine: MATTER.Engine;
  physicRenderer: MATTER.Render;
  constructor() {
    // INIT PHYSICS
    this.physicEngine = MATTER.Engine.create();
    this.physicRenderer = MATTER.Render.create({
      element: document.body,
      engine: this.physicEngine,
    });

    // create two boxes and a ground
    const boxA = MATTER.Bodies.rectangle(400, 200, 80, 80);
    const boxB = MATTER.Bodies.rectangle(450, 50, 80, 80);
    const ground = MATTER.Bodies.rectangle(400, 610, 810, 60, {
      isStatic: true,
    });

    // add all of the bodies to the world
    MATTER.Composite.add(this.physicEngine.world, [boxA, boxB, ground]);

    // run the renderer
    MATTER.Render.run(this.physicRenderer);

    // create runner
    const runner = MATTER.Runner.create();

    // run the engine
    MATTER.Runner.run(runner, this.physicEngine);
  }
}
