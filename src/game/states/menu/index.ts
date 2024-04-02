import { AnimatedSprite, Assets, Container, Sprite } from "pixi.js";
import config from "../../../../gameConfig.js";
import ScoreBoard from "../../components/scoreBoard";
import GameState from "../../traits/GameState";

export default class Menu extends GameState {
  #seconds = 0;
  #eyeCounts = 0;
  #charContainer = new Container();
  #eyes: AnimatedSprite;
  #lArm: Sprite;
  #rArm: Sprite;
  #isReady = false;
  constructor(
    parentContainer: Container,
    changeState: Function,
    scoreBoard: ScoreBoard
  ) {
    super(parentContainer, changeState, scoreBoard);
    this._stateContainer.zIndex = 1;
    this.initBackground();
  }

  async initBackground() {
    const menubundle = await Assets.loadBundle("menu");

    const textureSprite = new Sprite(menubundle.background);
    textureSprite.position.set(0, 0);
    textureSprite.height = config.HEIGHT;
    textureSprite.width = config.WIDTH;

    const eyes = new AnimatedSprite(menubundle.persoEyes.animations.blink);
    eyes.zIndex = 6;
    eyes.anchor.set(0.5);
    eyes.position.set(config.WIDTH / 2 + 90, config.HEIGHT / 2 - 150);
    eyes.width = eyes.width * 0.4;
    eyes.height = eyes.height * 0.4;
    eyes.loop = false;
    eyes.animationSpeed = 1.4;
    eyes.onComplete = () => eyes.gotoAndStop(0);
    this.#eyes = eyes;

    const persoSprite = new Sprite(menubundle.persoBody);
    persoSprite.anchor.set(0.5, 0.5);
    persoSprite.height = 700;
    persoSprite.width = 700;
    persoSprite.zIndex = 3;
    persoSprite.position.set(config.WIDTH / 2, config.HEIGHT / 2);

    const leftArm = new Sprite(menubundle.lArm);
    leftArm.anchor.set(1, 0.5);
    leftArm.height = persoSprite.height * 0.35;
    leftArm.width = leftArm.height;
    leftArm.position.set(persoSprite.x - 100, config.HEIGHT / 2.2);
    leftArm.angle = 15;
    leftArm.zIndex = 4;
    this.#lArm = leftArm;

    const rightArm = new Sprite(menubundle.rArm);
    rightArm.anchor.set(0, 0.5);
    rightArm.height = persoSprite.height * 0.35;
    rightArm.height = persoSprite.height * 0.35;
    rightArm.width = rightArm.height;
    rightArm.position.set(config.WIDTH / 2 + 90, config.HEIGHT / 2.6);
    rightArm.zIndex = 2;
    this.#rArm = rightArm;

    this.#charContainer.addChild(
      textureSprite,
      persoSprite,
      leftArm,
      rightArm,
      eyes
    );
    this._stateContainer.addChild(this.#charContainer);

    this.#isReady = true;
  }

  start() {
    return;
  }

  animateBody(delta: number) {
    if (Math.floor(this.#eyeCounts) === 3) {
      this.#eyes.play();
      this.#eyeCounts = 0;
    }

    this.#lArm.angle = 15 + Math.sin(this.#seconds) * 5;
    this.#rArm.angle = 15 + Math.cos(this.#seconds) * 3;
  }

  leave() {
    this.switchVisibility();
    this._changeState("level");
  }

  update(delta: number, inputArrays: Array<String>) {
    if (this.#isReady) {
      if (inputArrays.length) this.leave();

      this.animateBody(delta);

      this.#seconds += (1 / 60) * delta;
      this.#eyeCounts += (1 / 60) * delta;
    }
  }

  destroy() {
    this.#seconds = 0;
    this.#eyeCounts = 0;
  }
}
