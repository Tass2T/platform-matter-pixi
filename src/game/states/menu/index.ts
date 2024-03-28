import { Container, Graphics } from "pixi.js";
import config from "../../../../gameConfig.js";
import ScoreBoard from "../../components/scoreBoard";
import GameState from "../../traits/GameState";

export default class Menu extends GameState {
  constructor(
    parentContainer: Container,
    changeState: Function,
    scoreBoard: ScoreBoard
  ) {
    super(parentContainer, changeState, scoreBoard);
    this._stateContainer.zIndex = 12;
    this.initBackground();
  }

  initBackground() {
    const background = new Graphics()
      .rect(0, 0, config.WIDTH, config.HEIGHT)
      .fill("green");

    this._stateContainer.addChild(background);
  }

  start() {
    return;
  }

  leave() {
    this.switchVisibility();
    this._changeState("level");
  }

  update(delta: number, inputArrays: Array<String>) {
    if (inputArrays.length) this.leave();
  }
}
