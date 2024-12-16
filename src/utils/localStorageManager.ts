import { StoredData } from '../models'

class LocalStorageManager {
  #storedData: StoredData = { bestScore: 0, soundIsMuted: false }
  constructor() {
    if (localStorage.getItem('storedData')) JSON.parse(localStorage.getItem('storedData') as string)
  }

  private saveDatas = () => {
    localStorage.setItem('storedData', JSON.stringify(this.#storedData))
  }

  getBestScore = () => {
    return this.#storedData.bestScore
  }

  getIsMuted = () => {
    return this.#storedData.soundIsMuted
  }

  switchIsMuted = () => {
    this.#storedData.soundIsMuted = !this.#storedData.soundIsMuted
    this.saveDatas()
  }

  setBestScore = (bestScore: number) => {
    this.#storedData.bestScore = bestScore
    this.saveDatas()
  }
}

export const localStorageManager = new LocalStorageManager()
