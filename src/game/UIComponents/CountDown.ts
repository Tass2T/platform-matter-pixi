import { BitmapText, Container, Graphics } from 'pixi.js'
import { AppScreen } from '../../models'
import config from '../../../gameConfig.ts'
import gsap from 'gsap'

export default class CountDown extends Container implements AppScreen {
  #count: number
  #background: Graphics
  #text: BitmapText
  #backgroundTimeline = gsap.timeline()

  constructor() {
    super()
    this.visible = false
    this.#background = new Graphics().rect(-config.WIDTH / 4, 0, config.WIDTH * 2, config.HEIGHT).fill(0x00ff00)
    this.#background.pivot.set(config.WIDTH / 3, config.HEIGHT)
    this.#text = new BitmapText({
      text: '',
      style: {
        fontFamily: 'Arial',
        fontSize: 62,
        fill: 'white',
        stroke: { width: 1 },
      },
    })
    this.setTimeline()
    this.#text.position.set(config.WIDTH / 2.3, config.HEIGHT / 2.1)
    this.addChild(this.#background, this.#text)
  }

  setTimeline = () => {
    this.#backgroundTimeline.pause()
    this.#backgroundTimeline.fromTo(
      this.#background,
      { pixi: { rotation: 0, height: config.HEIGHT } },
      { pixi: { rotation: 45, height: 200 }, duration: 0.5 }
    )
  }

  start = async (): Promise<void> => {
    if (config.COUNTDOWN <= 0) return
    this.#count = config.COUNTDOWN
    this.visible = true
    this.#backgroundTimeline.play()
    this.#text.text = this.#count
    return new Promise(resolve => {
      const interval = setInterval(() => {
        this.#count--
        if (this.#count <= 0) {
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
