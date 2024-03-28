import { Container } from "pixi.js";
import ScoreBoard from "../components/scoreBoard";

export default class GameState {
  _parentContainer: Container;
  _stateContainer = new Container();
  _changeState: Function;
  _scoreBoard: ScoreBoard;
  constructor(
    parentContainer: Container,
    changeState: Function,
    scoreBoard: ScoreBoard
  ) {
    this._parentContainer = parentContainer;
    this._parentContainer.addChild(this._stateContainer);
    this._changeState = changeState;
    this._scoreBoard = scoreBoard;
  }

  switchVisibility() {
    this._stateContainer.visible = !this._stateContainer.visible;
  }
}
