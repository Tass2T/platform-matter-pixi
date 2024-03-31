import { AnimatedSprite, Assets, Container, Sprite } from "pixi.js";
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

  async initBackground() {
    const menubundle = await Assets.loadBundle("menu");
    console.log(menubundle);

    const textureSprite = new Sprite(menubundle.background);
    const persoSprite = new AnimatedSprite(
      menubundle.persoBody.animations.closeEye
    );
    persoSprite.anchor.set(0.5, 0.5);
    persoSprite.height = config.HEIGHT * 0.9;
    persoSprite.width = persoSprite.height;

    persoSprite.position.set(config.WIDTH / 2, config.HEIGHT / 2);

    textureSprite.position.set(0, 0);
    textureSprite.height = config.HEIGHT;
    textureSprite.width = config.WIDTH;

    this._stateContainer.addChild(textureSprite, persoSprite);
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
