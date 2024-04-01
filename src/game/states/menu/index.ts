import { AnimatedSprite, Assets, Container, Sprite } from "pixi.js";
import config from "../../../../gameConfig.js";
import ScoreBoard from "../../components/scoreBoard";
import GameState from "../../traits/GameState";

export default class Menu extends GameState {
  _seconds = 0
  _body: AnimatedSprite
  constructor(
    parentContainer: Container,
    changeState: Function,
    scoreBoard: ScoreBoard,
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


    const persoSprite = new AnimatedSprite(
      menubundle.persoBody.animations.closeEye
    );
    persoSprite.anchor.set(0.5, 0.5);
    persoSprite.height = config.HEIGHT * 0.9;
    persoSprite.width = persoSprite.height;
    persoSprite.zIndex = 3
    persoSprite.position.set(config.WIDTH / 2, config.HEIGHT / 2);
    persoSprite.label = "body"
    persoSprite.animationSpeed = 1.1
    persoSprite.loop = false
    persoSprite.onComplete = () => persoSprite.gotoAndStop(0)
    this._body = persoSprite
    

    const leftArm = new Sprite(menubundle.lArm)
    leftArm.anchor.set(0.5,0.5)
    leftArm.height = persoSprite.height * 0.35
    leftArm.width = leftArm.height
    leftArm.position.set(config.WIDTH / 2 - persoSprite.width / 2.9, config.HEIGHT / 2.4)
    leftArm.angle = 15
    leftArm.zIndex = 4
    leftArm.label = "leftArm"

    const rightArm = new Sprite(menubundle.rArm)
    rightArm.anchor.set(0.5,0.5)
    rightArm.height = persoSprite.height * 0.35
    rightArm.height = persoSprite.height * 0.35
    rightArm.width = rightArm.height
    rightArm.position.set(config.WIDTH / 2 + persoSprite.width / 3.4, config.HEIGHT / 2.4)
    rightArm.zIndex = 2
    rightArm.label = "rightArm"


    this._stateContainer.addChild(textureSprite, persoSprite, leftArm, rightArm);
  }

  start() {
    return;
  }

  animateBody() {
    if(Math.floor(this._seconds) === 3) {
      this._body.play()
      this._seconds = 0
      
    }
  }

  leave() {
    this.switchVisibility();
    this._changeState("level");
  }

  update(delta: number, inputArrays: Array<String>) {
    if (inputArrays.length) this.leave();

    this.animateBody()

    this._seconds += (1 / 60) * delta;
  }
}
