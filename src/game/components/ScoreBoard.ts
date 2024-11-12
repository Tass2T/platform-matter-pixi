import { Container, BitmapText } from 'pixi.js'
import config from '../../../gameConfig.ts'

export default class ScoreBoard extends Container {
  #displayedPlayerScore = 0
  #actualPlayerScore = 0
  #scoreText: BitmapText | null = null
  #visible = true
  constructor() {
    super()
    this.#scoreText = new BitmapText({
      text: `${this.#displayedPlayerScore}`,
      style: {
        fontFamily: 'Arial',
        fontSize: 36,
        fill: 'white',
        stroke: { width: 1 },
      },
    })
    this.#scoreText.position.set(config.WIDTH - 250, 20)
    this.addChild(this.#scoreText)
  }

  getPlayerScore(): number {
    return this.#actualPlayerScore
  }

  addToScore(value: number): void {
    this.#actualPlayerScore += value
  }

  incrementDisplayedPlayerScore(): void {
    this.#displayedPlayerScore += 100
    if (this.#scoreText) this.#scoreText.text = `${this.#displayedPlayerScore}`
  }

  resetScore() {
    this.#actualPlayerScore = 0
    this.#displayedPlayerScore = 0
    if (this.#scoreText) this.#scoreText.text = `${this.#displayedPlayerScore}`
  }

  setVisibility(value: boolean) {
    this.#visible = value
  }

  update(): void {
    if (this.#displayedPlayerScore !== this.#actualPlayerScore) this.incrementDisplayedPlayerScore()
  }
}
