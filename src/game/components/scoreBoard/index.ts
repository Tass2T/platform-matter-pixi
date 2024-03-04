import { Container, BitmapFont, BitmapText } from "pixi.js";
import config from "../../../../gameConfig.js";

export default class ScoreBoard {
  _displayedPlayerScore: number = 0;
  _actualPlayerScore: number = 0;
  _scoreFont: BitmapFont | null = null;
  _scoreText: BitmapText | null = null;
  constructor(parentContainer: Container) {
    this._scoreFont = BitmapFont.from("TitleFont", {
      fontFamily: "Arial",
      fontSize: 26,
      strokeThickness: 2,
      fill: "white",
    });

    this._scoreText = new BitmapText(`${this._displayedPlayerScore}`, {
      fontName: "TitleFont",
    });
    this._scoreText.position.set(config.WIDTH - 150, 20);
    parentContainer.addChild(this._scoreText);
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

  update(): void {
    if (this._displayedPlayerScore !== this._actualPlayerScore)
      this.incrementDisplayedPlayerScore();
  }
}
