import { Container, Ticker } from 'pixi.js'

interface AppScreen extends Container {
  prepare?: () => Promise<void>
  update?: (ticker: Ticker) => void
}

interface StoredData {
  bestScore: number
  soundIsMuted: boolean
}
