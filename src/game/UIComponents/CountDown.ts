import { BitmapText, Container, Graphics } from 'pixi.js'
import { AppScreen } from '../../models'
import config from '../../../gameConfig.ts'

export default class CountDown extends Container implements AppScreen {
  #count: number
  #background: Graphics
  #text: BitmapText

  constructor() {
    super()
    this.visible = false
    this.#background = new Graphics().rect(0, 0, config.WIDTH, config.HEIGHT).fill(0x00ff00)
    this.#background.alpha = 0.2
    this.#text = new BitmapText({
      text: '',
      style: {
        fontFamily: 'Arial',
        fontSize: 46,
        fill: 'white',
        stroke: { width: 1 },
      },
    })
    this.#text.position.set(config.WIDTH / 2.1, config.HEIGHT / 2.1)
    this.addChild(this.#background, this.#text)
  }

  start = async (): Promise<void> => {
    this.#count = config.COUNTDOWN
    this.visible = true
    this.#text.text = this.#count
    this.#background.alpha = 0.3
    return new Promise(resolve => {
      const interval = setInterval(() => {
        this.#count--
        if (this.#count === 0) {
          clearInterval(interval)
          this.visible = false
          resolve()
          return
        }
        this.#text.text = this.#count
      }, 1000)
    })
  }
}
