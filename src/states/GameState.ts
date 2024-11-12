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
      await this.#game.prepare()
      await this.#ui.prepare()
      this.addChild(this.#game, this.#ui)
      resolve()
    })
  }

  update = () => {
    this.#game.update()
  }
}
