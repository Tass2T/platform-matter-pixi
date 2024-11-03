import { AppScreen } from '../models'

class Navigation {
  goToScreen = (screen: AppScreen) => {
    console.log(screen)
  }
}

export const navigation = new Navigation()
