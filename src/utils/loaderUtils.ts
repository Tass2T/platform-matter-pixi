import { Assets, Texture } from "pixi.js";

export async function initAssetsBundles() {
  const textureFile = await fetch("texturemap.json");
  const textureMap = await textureFile.json();
  console.log(textureMap);
}

export async function loadBundle(bundleName: string): Promise<Texture[]> {
  // @ts-ignore
  Assets.addBundle(bundleName, textureMap[bundleName]);

  const response = await Assets.loadBundle(bundleName);

  return response;
}
