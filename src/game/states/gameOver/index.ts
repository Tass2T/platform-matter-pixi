import { Container, Graphics, BitmapText } from "pixi.js";
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
  _scoreContainer: Container = new Container();
  _yellowRectScreen: Graphics;
  _greenRectScreen: Graphics;
  _curtainInPlace: boolean = false;
  _moveCurtains: boolean = false;
  _moveScore: boolean = false;
  _scoreText: BitmapText;

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
    this._yellowRectScreen = new Graphics()
      .rect(
        config.WIDTH / 2,
        config.HEIGHT / 2,
        config.WIDTH + config.WIDTH / 2,
        config.HEIGHT + config.HEIGHT / 2
      )
      .fill("#e7e700");
    this._yellowRectScreen.zIndex = 1;

    this._scoreText = new BitmapText({
      text: "0",
      style: {
        fontFamily: "Caveat SemiBold",
        fontSize: 56,
        fill: "white",
        letterSpacing: 2,
      },
    });

    this._scoreText.zIndex = 2;
    this._scoreText.position.set(config.WIDTH + 80, config.HEIGHT / 2.5);
    this._scoreText.visible = false;
    this._scoreText.skew.y = -0.01;

    this._greenRectScreen = new Graphics()
      .rect(
        config.WIDTH / 2,
        config.HEIGHT / 2,
        config.WIDTH + config.WIDTH / 2,
        config.HEIGHT + config.HEIGHT / 2
      )
      .fill("#12c200");
    this._greenRectScreen.zIndex = 3;
    this._curtainContainer.addChild(
      this._greenRectScreen,
      this._yellowRectScreen,
      this._scoreText
    );
    this._curtainContainer.pivot.set(this._curtainContainer.width / 2, 0);
    this._curtainContainer.rotation += 50.06;
    this._curtainContainer.position.y = -28;
    this._curtainContainer.position.x += this._curtainContainer.width;
    this._parentContainer.addChild(this._curtainContainer);
  }

  appear(playerScore: number) {
    this._parentContainer.visible = true;
    this._isResetting = false;

    this._scoreText.text = playerScore ? `${playerScore}` : "0";
  }

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
      this._curtainContainer.position.x -= 180 * delta;
    else this._moveCurtains = true;
  }

  moveCurtains(delta: number) {
    if (this._yellowRectScreen.rotation > -0.06) {
      this._yellowRectScreen.rotation -= 0.005 * delta;
    } else {
      this._moveCurtains = false;
      this._moveScore = true;
      this._scoreText.visible = true;
    }
  }

  moveScore(delta: number) {
    if (this._scoreText.position.x > config.WIDTH)
      this._scoreText.position.x -= 20 * delta;
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
      if (this._moveScore) this.moveScore(delta);
    }
  }
}
