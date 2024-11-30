import { Container } from 'pixi.js'
import { AppScreen } from '../models'
import Game from '../game/Game.ts'
import GameUI from '../game/UI/GameUI.ts'

export default class GameState extends Container implements AppScreen {
  #game: Game
  #ui: GameUI

  constructor() {
    super()
  }

  prepare = (): Promise<void> => {
    return new Promise(async (resolve): Promise<void> => {
      this.#game = new Game()
      this.#ui = new GameUI()
      this.addChild(this.#game, this.#ui)
      this.#game.zIndex = 1
      this.#ui.zIndex = 4

      await this.#game.prepare()

      await this.#ui.startCountDown()
      resolve()
    })
  }

  checkIfGameOver() {
    if (this.#game.getPlayer().getHasFallen()) {
      this.#game.pause()
      this.#ui.startGameOver()
    }
  }

  update = () => {
    this.#game.update()
    this.#ui.setScore(this.#game.getScore())
    this.#ui.update()
    this.checkIfGameOver()
  }
}
