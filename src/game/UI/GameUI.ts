import { Container } from 'pixi.js'
import { AppScreen } from '../../models'
import ScoreBoard from '../components/ScoreBoard.ts'

export default class GameUI extends Container implements AppScreen {
  #scoreBoard: ScoreBoard

  constructor() {
    super()
  }

  async prepare(): Promise<void> {
    this.#scoreBoard = new ScoreBoard()
    this.addChild(this.#scoreBoard)
  }

  setScore(score: number): void {
    this.#scoreBoard.setScore(score)
  }

  update = () => {
    this.#scoreBoard.update()
  }
}
