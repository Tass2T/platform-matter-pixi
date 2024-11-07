import * as PIXI from 'pixi.js'
import config from '../gameConfig.ts'
import { PixiPlugin } from 'gsap/PixiPlugin'
import { initAssetsBundles } from './utils/loaderUtils.ts'
import { navigation } from './game/Navigation.ts'
import { getStateFromParams } from './utils/url.ts'
import MenuScreen from './game/screens/Menu.ts'
import GameScreen from './game/screens/Game.ts'
import gsap from 'gsap'

gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI(PIXI)

export const app = new PIXI.Application()

await app.init({
  height: config.HEIGHT,
  width: config.WIDTH,
  background: '#000000',
})

document.body.appendChild(app.canvas)

app.ticker.stop()

gsap.ticker.add(() => {
  app.ticker.update()
})

await initAssetsBundles()

if (import.meta.env.MODE === 'development') {
  if (getStateFromParams() === 'game') {
    navigation.goToScreen(new GameScreen())
  } else {
    navigation.goToScreen(new MenuScreen())
  }
} else {
  navigation.goToScreen(new MenuScreen())
}
