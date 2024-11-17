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
      this.#game.zIndex = 1
      this.#ui = new GameUI()
      this.#ui.zIndex = 2
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
