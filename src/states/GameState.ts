import { Container } from 'pixi.js'
import { AppScreen } from '../models'
import Game from '../game/Game.ts'
import GameUI from '../game/UI/GameUI.ts'
import Loading from '../game/Loading.ts'

export default class GameState extends Container implements AppScreen {
    #game: Game
    #loadingScreen: Loading
    #ui: GameUI

    constructor() {
        super()
    }

    prepare = async (): Promise<void> => {
        this.#game = new Game()
        this.#ui = new GameUI(this.resetGame)
        this.#loadingScreen = new Loading()
        this.addChild(this.#game, this.#ui, this.#loadingScreen)
        this.#game.zIndex = 1
        this.#ui.zIndex = 4
        this.#loadingScreen.zIndex = 1000

        await this.#game.prepare()
        this.#loadingScreen.hide()
        await this.#ui.startCountDown()
    }

    checkIfGameOver() {
        if (this.#game.getPlayer().getHasFallen() && !this.#ui.getGameOver().getIsActive()) {
            this.#game.pause()
            this.#ui.startGameOver()
        }
    }

    resetGame = () => {
        this.#ui.getGameOver().setIsActive(false)
        this.#game.reset()
        this.#ui.resetScore()
        this.start()
    }

    start = async () => {
        await this.#ui.startCountDown()
        this.#game.start()
    }

    update = () => {
        this.#game.update()
        this.#ui.setScore(this.#game.getScore())
        this.#ui.update()
        this.checkIfGameOver()
    }
}
