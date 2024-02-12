import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../gameConfig.js";

export default class Player {
  #body: MATTER.Body;
  #container: PIXI.Container = new PIXI.Container();
  #sprite: PIXI.Graphics;
  #jumpCount: number = config.player.jumpNumber;

  constructor(levelContainer: PIXI.Container) {
    levelContainer.addChild(this.#container);
    this.#body = MATTER.Bodies.rectangle(config.player.xAxisStart, 0, 50, 50, {
      inertia: -Infinity,
    });

    this.#sprite = new PIXI.Graphics();
    this.#sprite.beginFill(0x9900ff);
    this.#sprite.drawRect(this.#body.position.x, this.#body.position.y, 50, 50);
    this.#container.addChild(this.#sprite);
  }

  getBody(): MATTER.Body {
    return this.#body;
  }

  jump(): void {
    if (this.#jumpCount > 0) {
      MATTER.Body.setVelocity(this.#body, {
        x: 0,
        y: -config.player.jumpSpeed,
      });
      this.#jumpCount--;
    }
  }

  resetJump(): void {
    this.#jumpCount = config.player.jumpNumber;
  }

  hasFallen(): boolean {
    return this.#body.position.y >= config.HEIGHT;
  }

  syncBodyAndSprite() {
    this.#sprite.position.x = this.#body.position.x;
    this.#sprite.position.y = this.#body.position.y;
  }

  update(): void {
    this.syncBodyAndSprite();
  }
}
