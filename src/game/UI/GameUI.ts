import { Container } from 'pixi.js'
import { AppScreen } from '../../models'
import ScoreBoard from '../components/ScoreBoard.ts'
import GameOver from '../components/GameOver.ts'

export default class GameUI extends Container implements AppScreen {
  #scoreBoard = new ScoreBoard()
  #gameOver = new GameOver()

  constructor() {
    super()

    this.#scoreBoard.zIndex = 1
    this.#gameOver.zIndex = 2
    this.addChild(this.#scoreBoard, this.#gameOver)
  }

  setScore(score: number): void {
    this.#scoreBoard.setScore(score)
  }

  startGameOver(): void {
    if (!this.#gameOver.getIsActive()) this.#gameOver.start(this.#scoreBoard.getScore())
  }

  update = () => {
    if (this.#gameOver.getIsActive()) this.#gameOver.update()
  }
}
