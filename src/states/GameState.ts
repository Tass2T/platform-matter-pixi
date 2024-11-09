import { AnimatedSprite, Assets, Container, Sprite } from 'pixi.js'
import { AppScreen } from '../models'
import Game from '../game/Game.ts'
import config from '../../gameConfig.ts'

export default class GameState extends Container implements AppScreen {
  #game: Game

  constructor() {
    super()
  }

  prepare = (): Promise<void> => {
    return new Promise(async (resolve): Promise<void> => {
      await this.setBackground()
      this.#game = new Game()
      this.addChild(this.#game)
      resolve()
    })
  }

  async setBackground() {
    const texture = await Assets.load('backdrop')
    const skySprite = new Sprite(texture)

    const seaTextures = await Assets.load('seaProp')
    const seaSprite = new AnimatedSprite(seaTextures.animations['glitter'])
    seaSprite.anchor.set(0, 1)
    seaSprite.width = config.WIDTH
    seaSprite.position.set(0, config.HEIGHT)
    seaSprite.animationSpeed = 0.15
    this.addChild(skySprite, seaSprite)
    seaSprite.play()
  }

  update = () => {
    this.#game.update()
  }
}
