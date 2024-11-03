import { Container, Ticker } from 'pixi.js'

interface AppScreen extends Container {
  prepare?: () => void
  update?: (time: Ticker) => void
}
