import { Container, BitmapText } from "pixi.js";
import config from "../../../../gameConfig.js";

export default class ScoreBoard {
  _displayedPlayerScore = 0;
  _actualPlayerScore = 0;
  _currentContainer = new Container();
  _scoreText: BitmapText | null = null;
  constructor(parentContainer: Container) {
    parentContainer.addChild(this._currentContainer);
    this._currentContainer.zIndex = 1;
    this._scoreText = new BitmapText({
      text: `${this._displayedPlayerScore}`,
      style: {
        fontFamily: "Arial",
        fontSize: 36,
        fill: "white",
        stroke: { width: 1 },
      },
    });
    this._scoreText.position.set(config.WIDTH - 250, 20);
    this._currentContainer.addChild(this._scoreText);
  }

  getPlayerScore(): number {
    return this._actualPlayerScore;
  }

  addToScore(value: number): void {
    this._actualPlayerScore += value;
  }

  incrementDisplayedPlayerScore(): void {
    this._displayedPlayerScore += 100;
    if (this._scoreText) this._scoreText.text = `${this._displayedPlayerScore}`;
  }

  resetScore() {
    this._actualPlayerScore = 0;
    this._displayedPlayerScore = 0;
    if (this._scoreText) this._scoreText.text = `${this._displayedPlayerScore}`;
  }

  setVisibility(value: boolean) {
    this._currentContainer.visible = value;
  }

  update(): void {
    if (this._displayedPlayerScore !== this._actualPlayerScore)
      this.incrementDisplayedPlayerScore();
  }
}
