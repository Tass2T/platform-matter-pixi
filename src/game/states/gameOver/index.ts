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
import GameState from "../../traits/GameState.js";

export default class GameOverScreen extends GameState {
  _curtainContainer: Container = new Container();
  _scoreContainer: Container = new Container();
  _illustrationContainer: Container = new Container();
  _msgContainer: Container = new Container();

  _yellowRectScreen: Graphics = new Graphics();
  _greenRectScreen: Graphics = new Graphics();
  _textMessageBg: Graphics = new Graphics();
  _yellowCircle: Graphics = new Graphics();
  _yellowCircleMask: Graphics = new Graphics();

  _counter: number = 0;

  _animationProcess: number = 0;
  _isResetting: boolean = false;

  _scoreText: BitmapText;
  _textMessage: BitmapText;
  _shadowTextMessage: BitmapText;

  _illustration: {
    illu: Sprite;
    eyeAnim?: AnimatedSprite;
  };

  constructor(
    parentContainer: Container,
    scoreBoard: ScoreBoard,
    changeState: Function
  ) {
    super(parentContainer, changeState, scoreBoard);
    this.switchVisibility();
    this._stateContainer.zIndex = 10;
    this._stateContainer.addChild(
      this._curtainContainer,
      this._scoreContainer,
      this._illustrationContainer,
      this._msgContainer
    );

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
  }

  async initIllustration() {
    this._illustration = {
      illu: new Sprite(),
    };
    const illustrationAsset = await Assets.load([
      "gameOverIllu",
      "gameOverIlluEyes",
    ]);

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
  }

  setMessage() {
    const message = "Maintenez le bouton Espace pour relancer!!";
    this._textMessage = new BitmapText({
      text: message,
      style: {
        fontFamily: "Arial",
        fontSize: 26,
        fill: "white",
        letterSpacing: 2,
      },
    });

    this._shadowTextMessage = new BitmapText({
      text: message,
      style: {
        fontFamily: "Arial",
        fontSize: 26,
        fill: 0x49c801,
        letterSpacing: 2,
      },
    });

    this._textMessage.position.set(config.WIDTH * 0.05, config.HEIGHT * 0.85);
    this._shadowTextMessage.position.set(
      config.WIDTH * 0.05,
      config.HEIGHT * 0.85
    );
    this._textMessage.zIndex = 12;
    this._shadowTextMessage.zIndex = 13;
    this._textMessage.visible = false;
    this._shadowTextMessage.visible = false;

    this._shadowTextMessage.mask = this._yellowCircleMask;

    this._msgContainer.addChild(
      this._textMessage,
      this._shadowTextMessage,
      this._textMessageBg,
      this._yellowCircle,
      this._yellowCircleMask
    );
  }

  appear(playerScore: number) {
    this._parentContainer.visible = true;

    this._scoreText.text = playerScore ? `${playerScore}` : "0";
  }

  resetVariablesAndElements() {
    this._animationProcess = 0;
    this._illustrationContainer.visible = false;

    this._textMessage.visible = false;
    this._shadowTextMessage.visible = false;
    this._scoreText.visible = false;

    this._scoreText.position.x = config.WIDTH + 80;
    this._curtainContainer.position.x = config.WIDTH;
    this._curtainContainer.position.y = -28;
    this._yellowRectScreen.rotation = 0;

    this._illustration.eyeAnim?.gotoAndStop(0);
  }

  start() {
    this.switchVisibility();
    this._scoreText.text = this._scoreBoard.getPlayerScore()
      ? `${this._scoreBoard.getPlayerScore()}`
      : "0";
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
      this._shadowTextMessage.visible = true;
      this._illustrationContainer.visible = true;
      setTimeout(() => this._illustration.eyeAnim?.play(), 2000);
      this._animationProcess++;
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

  syncYellowCircle() {
    this._yellowCircle.clear();
    this._yellowCircleMask.clear();

    this._yellowCircle
      .circle(
        config.WIDTH * 0.46,
        config.HEIGHT * 0.86,
        50 + Math.floor(this._counter * 8)
      )
      .fill(0xffff00);

    this._yellowCircleMask
      .circle(
        config.WIDTH * 0.46,
        config.HEIGHT * 0.86,
        50 + Math.floor(this._counter * 8)
      )
      .fill(0x000000);
  }

  leaveScreen() {
    this._counter = 0;
    this.resetVariablesAndElements();
    this.switchVisibility();
    this._changeState("level");
  }

  update(delta: number, inputArrays: Array<String>) {
    if (this._counter > 100) this.leaveScreen();
    if (inputArrays.includes("Space")) {
      this.incrementConter(3 * delta);
    } else if (this._counter > 0) {
      this.incrementConter(-3 * delta);
    }
    this.processAnim(delta);

    this.syncYellowCircle();
  }
}
