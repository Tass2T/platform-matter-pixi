import { Container } from 'pixi.js'
import { AppScreen } from '../models'
import Game from '../game/Game.ts'
import GameUI from '../game/UI/GameUI.ts'

export default class GameState extends Container implements AppScreen {
  #game: Game
  #ui: GameUI

  #isPausing = false

  constructor() {
    super()
  }

  prepare = (): Promise<void> => {
    return new Promise(async (resolve): Promise<void> => {
      this.#game = new Game()
      this.#game.zIndex = 1
      this.#ui = new GameUI()
      this.#ui.zIndex = 4
      await this.#game.prepare()
      this.addChild(this.#game, this.#ui)
      resolve()
    })
  }

  checkIfGameOver() {
    if (this.#game.getPlayer().getHasFallen()) {
      this.#game.pause()
      this.#isPausing = true
      this.#ui.startGameOver()
    }
  }

  update = () => {
    this.#game.update()
    this.#ui.setScore(this.#game.getScore())
    this.#ui.update()
    if (!this.#isPausing) this.checkIfGameOver()
  }
}
