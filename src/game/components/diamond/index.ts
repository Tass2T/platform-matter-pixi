import * as MATTER from "matter-js";
import * as PIXI from "pixi.js";
import config from "../../../../gameConfig.js";
import VisibleObjects from "../../traits/VisibleObjects.js";

export default class Diamond extends VisibleObjects {
  _parentPos: MATTER.Vector;
  _orderIndex: number;
  _hasBeenTaken: boolean;
  _spritesheet: PIXI.Spritesheet;
  _scoreText: PIXI.BitmapText;
  _scoreTextFont: PIXI.BitmapFont;
  _pointsContainer: PIXI.Container = new PIXI.Container();
  _boundWithFirstPlatform: boolean;
  constructor(
    levelContainer: PIXI.Container,
    platFormPos: MATTER.Vector,
    pos: number,
    firstPlatform: boolean
  ) {
    super();
    this._parentPos = platFormPos;
    this._orderIndex = pos;
    this._boundWithFirstPlatform = firstPlatform;

    if (this._boundWithFirstPlatform) this._hasBeenTaken = true;

    this._body = MATTER.Bodies.rectangle(
      platFormPos.x -
        config.platForm.standard.width / 2 +
        (config.diamond.side + config.diamond.gap) * pos,
      this._orderIndex % 2 === 0
        ? platFormPos.y + 10
        : platFormPos.y - config.diamond.height,
      config.diamond.side,
      config.diamond.side,
      { isStatic: true, isSensor: true }
    );
    this._bodyHeight = config.diamond.side;
    this._bodyWidth = config.diamond.side;

    this.initAssets(levelContainer);
    this.initScoreContainer();
  }

  async initAssets(levelContainer: PIXI.Container) {
    this._spritesheet = await PIXI.Assets.load("diamonds");

    this._sprite = new PIXI.AnimatedSprite(
      this._spritesheet.animations["idle"]
    );
    this._sprite.width = this._bodyWidth;
    this._sprite.height = this._bodyHeight;
    this._sprite.anchor.set(0.5, 0.5);

    this.animateSprite(0.08);
    if (this._boundWithFirstPlatform) this._sprite.visible = false;

    levelContainer.addChild(this._sprite);
    this._sprite.addChild(this._pointsContainer);
  }

  initScoreContainer() {
    this._scoreTextFont = PIXI.BitmapFont.from("scoreFont", {
      fontFamily: "Arial",
      fontSize: 45,
      strokeThickness: 3,
      fill: "#972296",
    });

    this._scoreText = new PIXI.BitmapText(`${config.diamond.points}`, {
      fontName: "scoreFont",
    });
    this._pointsContainer.position.set(-70, 0);
    this._pointsContainer.visible = false;
    this._pointsContainer.addChild(this._scoreText);
  }

  getPosition(): MATTER.Vector {
    return this._body.position;
  }

  getHasBeenTaken() {
    return this._hasBeenTaken;
  }

  hide() {
    this._hasBeenTaken = true;
    this._sprite.visible = false;
  }

  setHasBeenTaken(value: boolean) {
    if (this._sprite) {
      this._hasBeenTaken = value;
      if (this._hasBeenTaken) {
        this._sprite.textures = this._spritesheet.animations["taken"];
        this._sprite.animationSpeed = 0.3;
        this._sprite.loop = false;
        this._sprite.onComplete = () => (this._sprite.visible = false);

        this._sprite.gotoAndPlay(0);
        this._pointsContainer.visible = true;
      } else {
        this._sprite.visible = true;
        this._sprite.loop = true;
        this._sprite.textures = this._spritesheet.animations["idle"];
        this._sprite.animationSpeed = 0.08;
        this._sprite.gotoAndPlay(0);
        this._pointsContainer.position.y = 0;
        this._pointsContainer.visible = false;
      }
    }
  }

  syncPosition(): void {
    MATTER.Body.setPosition(this._body, {
      x:
        this._parentPos.x -
        config.platForm.standard.width / 2 +
        (config.diamond.side + config.diamond.gap) * this._orderIndex,
      y:
        this._orderIndex % 2 === 0
          ? this._parentPos.y - config.diamond.height - 15
          : this._parentPos.y - config.diamond.height,
    });
  }

  syncScorePosition(delta: number) {
    if (this._hasBeenTaken) {
      this._pointsContainer.position.y -= 5 * delta;
    }
  }

  update(delta: number): void {
    this.syncPosition();
    this.syncSpriteWithBody();
    this.syncScorePosition(delta);
  }
}
