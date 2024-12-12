class InputManager {
  pressedInput: Array<string> = []
  constructor() {
    window.addEventListener('keydown', e => {
      if (e.repeat) return

      if (!this.pressedInput.includes(e.code)) this.pressedInput.push(e.code)
    })

    window.addEventListener('keyup', e => {
      this.pressedInput = this.pressedInput.filter(code => code !== e.code)
    })
  }

  getPressedInputs() {
    return this.pressedInput
  }

  isSpacePressed() {
    return this.pressedInput.includes('Space')
  }
}

export const inputManager = new InputManager()
