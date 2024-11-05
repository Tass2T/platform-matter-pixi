import { AppScreen } from '../models'
import { app } from '../main.ts'

class Navigation {
  #currentState?: AppScreen

  goToScreen = (screen: AppScreen) => {
    if (this.#currentState) this.destroyCurrentState()

    this.#currentState = screen
    app.stage.addChild(screen)

    this.#currentState.prepare().then(() => {
      if (!!this.#currentState?.update) app.ticker.add(this.#currentState.update)
    })
  }

  destroyCurrentState = () => {
    if (this.#currentState) {
      if (!!this.#currentState.update) app.ticker.remove(this.#currentState.update)

      app.stage.removeChild(this.#currentState)
      this.#currentState.destroy()
      this.#currentState = undefined
    }
  }
}

export const navigation = new Navigation()
