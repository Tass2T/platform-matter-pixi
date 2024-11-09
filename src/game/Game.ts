import { Assets, Container, Sprite } from 'pixi.js'
import { AppScreen } from '../models'
import config from '../../gameConfig.ts'
import * as MATTER from 'matter-js'

export default class Game extends Container implements AppScreen {
  #physicEngine: Matter.Engine
  #backProps = new Container({ isRenderGroup: true })
  #frontPropsContainer = new Container({ isRenderGroup: true })

  constructor() {
    super()

    this.initEngine()
    this.setBackProps()

    this.addChild(this.#backProps, this.#frontPropsContainer)
  }

  initEngine() {
    this.#physicEngine = MATTER.Engine.create()
    this.#physicEngine.gravity.scale = config.GRAVITY
  }

  setBackProps(): void {
    ;['props2', 'props1'].forEach(async (prop, index) => {
      const texture = await Assets.load(prop)
      const sprite = new Sprite(texture)
      sprite.height = config.HEIGHT
      sprite.width = config.WIDTH
      sprite.x = -(config.WIDTH / 3) + index * config.WIDTH
      this.#backProps.addChild(sprite)
    })
  }

  async setFrontProps(): Promise<void> {
    const textures = await Assets.load(['trees'])

    const propsNeeded = 3
    const texturesKeys = Object.keys(textures.trees.data.frames)

    for (let i = 0; i < propsNeeded; i++) {
      const sprite = new Sprite(textures.trees.textures[texturesKeys[i]])
      sprite.anchor.set(0, 0.95)
      sprite.height = config.HEIGHT * 0.7
      sprite.width = config.WIDTH * 0.7
      sprite.zIndex = 3 - i
      sprite.position.set(i * config.frontPropsWidth, config.HEIGHT)

      this.#frontPropsContainer.addChild(sprite)
    }
  }

  update = () => {}
}
