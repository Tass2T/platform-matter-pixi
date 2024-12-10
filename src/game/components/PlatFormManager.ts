import * as MATTER from 'matter-js'
import config from '../../../gameConfig.ts'
import Platform from './PlateForm.ts'
import Game from '../Game.ts'
import { AppScreen } from '../../models'

export default class PlatformManager {
  #engine: MATTER.Engine
  #platFormList: Array<Platform> = []
  #gameSpeed: number = config.SPEED
  #parentContainer: AppScreen
  constructor(parentContainer: Game) {
    this.#engine = parentContainer.getPhysicEngine()
    this.#parentContainer = parentContainer
  }

  prepare = async () => {
    await this.createPlatforms()
  }

  getPlatformList() {
    return this.#platFormList
  }

  increaseGamespeed() {
    this.#gameSpeed += 0.05
  }

  setGameSpeed(newValue: number): void {
    this.#gameSpeed = newValue
  }

  createPlatforms = async () => {
    this.#platFormList = []
    for (let i = 1; i <= 6; i++) {
      const x =
        i === 1
          ? config.platForm.start
          : this.#platFormList[this.#platFormList.length - 1].getRightCoord() + this.setAjustedGap()
      const ground = new Platform(x, this.#parentContainer, i === 1)

      this.#platFormList.push(ground)
      MATTER.Composite.add(this.#engine.world, ground.getBody())
    }
  }

  resetPlatforms(): void {
    for (let i = 0; i < this.#platFormList.length; i++) {
      const x = i === 0 ? config.platForm.start : this.#platFormList[i - 1].getRightCoord() + this.setAjustedGap()

      const y = i === 0 ? config.HEIGHT / 2 : this.#platFormList[i].getAdjustedHeight()

      this.#platFormList[i].setPosition(x, y)
      this.#platFormList[i].resetDiamond()
    }
  }

  setAjustedGap(): number {
    return config.platForm.gap * (Math.random() * (this.#gameSpeed ? this.#gameSpeed / 2 : this.#gameSpeed / 2))
  }

  getFarestXCoord(): number {
    let result = 0

    for (let i = 0; i < this.#platFormList.length; i++) {
      if (this.#platFormList[i].getRightCoord() > result) result = this.#platFormList[i].getRightCoord()
    }

    return result
  }

  movePlatforms(delta: number): void {
    this.#platFormList.forEach(platForm => {
      if (platForm.hasDisappeared()) {
        const x = this.getFarestXCoord()

        platForm.moveToRight(x + this.setAjustedGap())
      } else {
        platForm.moveLeft(this.#gameSpeed * delta)
      }
    })
  }

  syncPlatforms() {
    this.#platFormList.forEach(platform => {
      platform.update()
    })
  }

  update(delta: number) {
    this.movePlatforms(delta)
    this.syncPlatforms()
  }
}
