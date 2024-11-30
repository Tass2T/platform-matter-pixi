import { Container } from 'pixi.js'
import { AppScreen } from '../../models'
import ScoreBoard from '../UIComponents/ScoreBoard.ts'
import GameOver from '../UIComponents/GameOver.ts'
import CountDown from '../UIComponents/CountDown.ts'

export default class GameUI extends Container implements AppScreen {
  #scoreBoard = new ScoreBoard()
  #gameOver = new GameOver()
  #countDown = new CountDown()

  constructor() {
    super()
    this.#countDown.zIndex = 1
    this.#scoreBoard.zIndex = 2
    this.#gameOver.zIndex = 3
    this.addChild(this.#scoreBoard, this.#gameOver, this.#countDown)
  }

  startCountDown = async (): Promise<void> => {
    return new Promise(async resolve => {
      await this.#countDown.start()
      resolve()
    })
  }

  setScore(score: number): void {
    this.#scoreBoard.setScore(score)
  }

  startGameOver(): void {
    if (!this.#gameOver.getIsActive()) this.#gameOver.start(this.#scoreBoard.getScore() || 0)
  }

  update = () => {
    if (this.#gameOver.getIsActive()) this.#gameOver.update()
  }
}
