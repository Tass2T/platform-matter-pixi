import { Container, BitmapText } from 'pixi.js'
import config from '../../../gameConfig.ts'

export default class ScoreBoard extends Container {
  #actualPlayerScore = 0
  #scoreText: BitmapText | null = null

  constructor() {
    super()
    this.#scoreText = new BitmapText({
      text: `${this.#actualPlayerScore}`,
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

  getScore = () => {
    return this.#actualPlayerScore
  }

  setScore(value: number): void {
    this.#actualPlayerScore = value
    if (this.#actualPlayerScore && this.#scoreText) this.#scoreText.text = this.#actualPlayerScore
  }
}
