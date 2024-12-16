import { Assets } from 'pixi.js'

export async function initAssetsBundles(): Promise<void> {
  const textureFile = await fetch('/texturemap.json')

  const textureMap = await textureFile.json()

  await Assets.init({ manifest: textureMap })

  return
}
