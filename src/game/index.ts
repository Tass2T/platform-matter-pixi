import Level from "./level";

export default class Game {
  level: Level;
  constructor() {
    this.level = new Level();
  }
}
