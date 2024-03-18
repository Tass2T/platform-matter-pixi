import {
  Container,
  Graphics,
  BitmapText,
  Assets,
  Sprite,
  AnimatedSprite,
} from "pixi.js";
import config from "../../../../gameConfig.js";
import ScoreBoard from "../../components/scoreBoard/index.js";

export default class GameOverScreen {
  _scoreBoard: ScoreBoard;

  _parentContainer: Container;
  _curtainContainer: Container = new Container();
  _scoreContainer: Container = new Container();
  _illustrationContainer: Container = new Container();

  _yellowRectScreen: Graphics = new Graphics();
  _greenRectScreen: Graphics = new Graphics();
  _textMessageBg: Graphics = new Graphics();

  _counter: number = 0;
  _resetFunction: Function;

  _animationProcess: number = 0;
  _isResetting: boolean = false;

  _scoreText: BitmapText;
  _textMessage: BitmapText;

  _illustration: {
    illu: Sprite;
    eyeAnim?: AnimatedSprite;
  };

  constructor(
    parentContainer: Container,
    resetFunction: Function,
    scoreBoard: ScoreBoard
  ) {
    this._scoreBoard = scoreBoard;
    this._parentContainer = parentContainer;
    this._parentContainer.visible = false;
    this._resetFunction = resetFunction;

    this.initCurtains();
    this.initIllustration();
    this.setMessage();
  }

  initCurtains() {
    this._yellowRectScreen
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
        fontFamily: "Arial",
        fontSize: 56,
        fill: "white",
        letterSpacing: 2,
      },
    });

    this._scoreText.zIndex = 2;
    this._scoreText.position.set(config.WIDTH + 80, config.HEIGHT / 2.5);
    this._scoreText.visible = false;
    this._scoreText.skew.y = -0.01;

    this._greenRectScreen
      .rect(
        config.WIDTH / 2,
        config.HEIGHT / 2,
        config.WIDTH + config.WIDTH / 2,
        config.HEIGHT + config.HEIGHT / 2
      )
      .fill("#49c800");
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

  async initIllustration() {
    this._illustration = {
      illu: new Sprite(),
    };
    const illustrationAsset = await Assets.load([
      "gameOverIllu",
      "gameOverIlluEyes",
    ]);
    console.log(illustrationAsset);

    this._illustration.illu = Sprite.from(illustrationAsset.gameOverIllu);

    this._illustration.illu.anchor.set(0.5);
    this._illustration.illu.position.set(
      config.WIDTH * 0.7,
      config.HEIGHT * 0.6
    );
    this._illustration.eyeAnim = new AnimatedSprite(
      illustrationAsset.gameOverIlluEyes.animations["open"]
    );
    this._illustration.eyeAnim.zIndex = 3;
    this._illustration.eyeAnim.anchor.set(0.5);
    this._illustration.eyeAnim.position.set(
      config.WIDTH * 0.7,
      config.HEIGHT * 0.6
    );
    this._illustration.eyeAnim.loop = false;
    this._illustration.eyeAnim.animationSpeed = 0.4;
    this._illustrationContainer.addChild(
      this._illustration.illu,
      this._illustration.eyeAnim
    );
    this._illustrationContainer.visible = false;

    this._parentContainer.addChild(this._illustrationContainer);
  }

  setMessage() {
    this._textMessage = new BitmapText({
      text: "Maintenez le bouton R pour relancer!!",
      style: {
        fontFamily: "Arial",
        fontSize: 26,
        fill: "white",
        letterSpacing: 2,
      },
    });

    this._textMessage.position.set(config.WIDTH * 0.05, config.HEIGHT * 0.85);
    this._textMessage.zIndex = 12;
    this._textMessage.visible = false;

    this._parentContainer.addChild(this._textMessage, this._textMessageBg);
  }

  appear(playerScore: number) {
    this._parentContainer.visible = true;
    this._isResetting = false;

    this._scoreText.text = playerScore ? `${playerScore}` : "0";
  }

  disappear() {
    this._parentContainer.visible = false;
  }

  resetVariablesAndElements() {
    this._animationProcess = 0;
    this._illustrationContainer.visible = false;

    this._textMessage.visible = false;
    this._scoreText.visible = false;

    this._scoreText.position.x = config.WIDTH + 80;
    this._curtainContainer.position.x = config.WIDTH;
    this._curtainContainer.position.y = -28;
    this._yellowRectScreen.rotation = 0;
  }

  resetLevel() {
    this._counter = 0;
    this._isResetting = true;
    this.resetVariablesAndElements();

    this._resetFunction();
  }

  incrementConter(value: number): void {
    this._counter += value;
  }

  moveCurtainContainer(delta: number) {
    if (this._curtainContainer.position.x > 0)
      this._curtainContainer.position.x -= 120 * delta;
    else this._animationProcess++;
  }

  moveCurtains(delta: number) {
    if (this._yellowRectScreen.rotation > -0.06) {
      this._yellowRectScreen.rotation -= 0.005 * delta;
    } else {
      this._animationProcess++;
      this._scoreText.visible = true;
    }
  }

  moveScore(delta: number) {
    if (this._scoreText.position.x > config.WIDTH)
      this._scoreText.position.x -= 20 * delta;
    else {
      this._textMessage.visible = true;
      this._illustrationContainer.visible = true;
      setTimeout(() => this._illustration.eyeAnim?.play(), 2000);
    }
  }

  processAnim(delta: number) {
    switch (this._animationProcess) {
      case 0:
        this.moveCurtainContainer(delta);
        break;
      case 1:
        this.moveCurtains(delta);
        break;
      case 2:
        this.moveScore(delta);
        break;
      default:
        break;
    }
  }

  update(inputArrays: Array<String>, delta: number) {
    if (!this._isResetting) {
      if (this._counter === 100) this.resetLevel();
      if (inputArrays.includes("KeyR")) {
        this.incrementConter(1);
      } else if (this._counter > 0) {
        this.incrementConter(-1);
      }
      this.processAnim(delta);
    }
  }
}
