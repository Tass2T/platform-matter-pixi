import { Container, Graphics } from "pixi.js";
import config from "../../../../gameConfig.js";
import ScoreBoard from "../../components/scoreBoard/index.js";

export default class GameOverScreen {
  _parentContainer: Container;
  _background: Graphics;
  _counter: number;
  _resetFunction: Function;
  _isResetting: boolean = false;
  _scoreBoard: ScoreBoard;
  _curtainContainer: Container = new Container();
  _greenRectScreen: Graphics;
  _blackRectScreen: Graphics;
  _curtainInPlace: boolean = false;
  _moveCurtains: boolean = false;
  constructor(
    parentContainer: Container,
    resetFunction: Function,
    scoreBoard: ScoreBoard
  ) {
    this._scoreBoard = scoreBoard;
    this._parentContainer = parentContainer;
    this._resetFunction = resetFunction;
    this._parentContainer.visible = false;
    this.initCurtains();
  }

  initCurtains() {
    this._greenRectScreen = new Graphics()
      .rect(
        config.WIDTH / 2,
        config.HEIGHT / 2,
        config.WIDTH + config.WIDTH / 2,
        config.HEIGHT + config.HEIGHT / 2
      )
      .fill("#e8ff00");
    this._greenRectScreen.zIndex = 1;
    this._blackRectScreen = new Graphics()
      .rect(
        config.WIDTH / 2,
        config.HEIGHT / 2,
        config.WIDTH + config.WIDTH / 2,
        config.HEIGHT + config.HEIGHT / 2
      )
      .fill("#1bbf0a");
    this._blackRectScreen.zIndex = 2;
    this._curtainContainer.addChild(
      this._blackRectScreen,
      this._greenRectScreen
    );
    this._curtainContainer.pivot.set(this._curtainContainer.width / 2, 0);
    this._curtainContainer.rotation += 50.06;
    this._curtainContainer.position.y = -28;
    this._curtainContainer.position.x += this._curtainContainer.width;
    this._parentContainer.addChild(this._curtainContainer);
  }

  appear() {
    this._parentContainer.visible = true;
    this._isResetting = false;
    this._counter = 0;
  }

  startAnimation() {}

  disappear() {
    this._parentContainer.visible = false;
  }

  resetLevel() {
    this._counter = 0;
    this._isResetting = true;
    this._resetFunction();
  }

  incrementConter(value: number): void {
    this._counter += value;
  }

  moveCurtainContainer(delta: number) {
    if (this._curtainContainer.position.x > 0)
      this._curtainContainer.position.x -= 150 * delta;
    else this._moveCurtains = true;
  }

  moveCurtains(delta: number) {
    if (this._greenRectScreen.rotation > -0.1) {
      this._greenRectScreen.rotation -= 0.02 * delta;
    }
  }

  update(inputArrays: Array<String>, delta: number) {
    if (!this._isResetting) {
      if (inputArrays.includes("KeyR")) {
        this.incrementConter(1);
      } else if (this._counter > 0) {
        this.incrementConter(-1);
      }
      if (this._counter === 100) this.resetLevel();
      if (!this._curtainInPlace) this.moveCurtainContainer(delta);
      if (this._moveCurtains) this.moveCurtains(delta);
    }
  }
}
