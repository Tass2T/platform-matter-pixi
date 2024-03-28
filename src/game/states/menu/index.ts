import { Container } from "pixi.js";
import ScoreBoard from "../../components/scoreBoard";
import GameState from "../../traits/GameState";

export default class Menu extends GameState {
  constructor(
    parentContainer: Container,
    changeState: Function,
    scoreBoard: ScoreBoard
  ) {
    super(parentContainer, changeState, scoreBoard);
  }

  update(delta: number, inputArrays: Array<String>) {
    console.log("heeehaa", delta, inputArrays);
  }

  start() {}
}
