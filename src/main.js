import { Application, Graphics } from 'pixi.js'
import config from '../gameConfig.ts'
import { PixiPlugin } from 'gsap/PixiPlugin'
import { initAssetsBundles } from './utils/loaderUtils.ts'
import { navigation } from './Navigation.ts'
import { getStateFromParams } from './utils/url.ts'
import MenuState from './states/MenuState.ts'
import GameState from './states/GameState.ts'
import gsap from 'gsap'

gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI({ Graphics: Graphics })

export const app = new Application()

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
    navigation.goToScreen(new GameState())
  } else {
    navigation.goToScreen(new MenuState())
  }
} else {
  navigation.goToScreen(new MenuState())
}
