import { Application } from 'pixi.js'
import config from '../gameConfig.ts'
import { initAssetsBundles } from './utils/loaderUtils.ts'
import { navigation } from './game/Navigation.ts'
import { getStateFromParams } from './utils/url.ts'
import GameOverScreen from './game/screens/GameOver.ts'
import MenuScreen from './game/screens/Menu.ts'
import GameScreen from './game/screens/Game.ts'

export const app = new Application()

await app.init({
  height: config.HEIGHT,
  width: config.WIDTH,
  background: '#000000',
})

document.body.appendChild(app.canvas)

await initAssetsBundles()

// if (getStateFromParams() === 'gameOver') {
//   navigation.goToScreen(GameOverScreen)
// } else if (getStateFromParams() === 'game') {
//   navigation.goToScreen(GameScreen)
// } else {
navigation.goToScreen(MenuScreen)
// }
