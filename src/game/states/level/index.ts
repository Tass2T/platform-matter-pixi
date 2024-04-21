import * as MATTER from 'matter-js'
import { Container, Assets, Sprite, AnimatedSprite, BitmapText } from 'pixi.js'
import Player from '../../components/player/index.js'
import PlatformManager from '../../components/platformManager/index.js'
import config from '../../../../gameConfig.ts'
import ScoreBoard from '../../components/scoreBoard/index.js'
import GameOverScreen from '../gameOver/index.js'
import GameState from '../../traits/GameState.js'

export default class Level extends GameState {
  _physicEngine: MATTER.Engine
  _physicRenderer: MATTER.Render

  _backgroundContainer = new Container()
  _propsContainer = new Container()
  _frontPropsContainer = new Container({ isRenderGroup: true })
  _gameContainer = new Container()
  _scoreContainer = new Container()
  _gameOverContainer = new Container()

  _countdown: number = config.COUNTDOWN
  _displayedSecond: BitmapText
  _seconds = 0
  #blockJump = true

  _player: Player
  _platformManager: PlatformManager
  _gameOverScreen: GameOverScreen

  constructor(parentContainer: Container, changeState: Function, scoreBoard: ScoreBoard) {
    super(parentContainer, changeState, scoreBoard)

    this._backgroundContainer.zIndex = 1
    this._propsContainer.zIndex = 2
    this._frontPropsContainer.zIndex = 3
    this._gameContainer.zIndex = 4
    this._scoreContainer.zIndex = 5
    this._gameOverContainer.zIndex = 6
    this._stateContainer.addChild(
      this._backgroundContainer,
      this._propsContainer,
      this._frontPropsContainer,
      this._gameContainer,
      this._gameOverContainer,
      this._scoreContainer
    )

    this.initEngine()

    this.setBackground()

    this.initLevel()
  }

  getScoreBoard() {
    return this._scoreBoard
  }

  initEngine() {
    this._physicEngine = MATTER.Engine.create()
    this._physicEngine.gravity.scale = config.GRAVITY

    if (config.PHYSIC_DEBUG_MODE) {
      var render = MATTER.Render.create({
        element: document.body,
        engine: this._physicEngine,
      })
      MATTER.Render.run(render)
    }
  }

  async setBackground() {
    const texture = await Assets.load('backdrop')
    const skySprite = new Sprite(texture)

    const seaTextures = await Assets.load('seaProp')
    const seaSprite = new AnimatedSprite(seaTextures.animations['glitter'])
    seaSprite.anchor.set(0, 1)
    seaSprite.width = config.WIDTH
    seaSprite.position.set(0, config.HEIGHT * 1)
    seaSprite.animationSpeed = 0.1
    seaSprite.play()
    this._backgroundContainer.addChild(skySprite, seaSprite)

    this.setProps()
    this.setFrontProps()
  }

  setProps(): void {
    ;['props2', 'props1'].forEach(async prop => {
      const texture = await Assets.load(prop)
      const sprite = new Sprite(texture)
      sprite.scale = 1.3
      sprite.anchor.set(0.5, 1)
      this._propsContainer.addChild(sprite)
    })
  }

  async setFrontProps(): Promise<void> {
    const textures = await Assets.load(['trees'])

    const propsNeeded = 3
    const texturesKeys = Object.keys(textures.trees.data.frames)
    

    for (let i = 0; i < propsNeeded; i++) {
      const sprite = new Sprite(textures.trees.textures[texturesKeys[i]])
      sprite.anchor.set(0, 0.9)
      sprite.height = config.HEIGHT
      sprite.width = config.WIDTH
      sprite.zIndex = 3 - i
      sprite.position.set(i * config.frontPropsWidth, config.HEIGHT)
      
      this._frontPropsContainer.addChild(sprite)
    }
  }

  displayCountdown() {
    this._displayedSecond = new BitmapText({
      text: `${this._countdown}`,
      style: {
        fontFamily: 'Arial',
        fontSize: 50,
        fill: 'white',
        stroke: { width: 4 },
      },
    })

    this._displayedSecond.position.set(config.WIDTH / 2 - this._displayedSecond.width / 2, config.HEIGHT / 4)
    this._displayedSecond.zIndex = 20
    this._stateContainer.addChild(this._displayedSecond)
  }

  updateProps(delta: number) {
    this._propsContainer.children.forEach(prop => {
      prop.position.x -= 0.01 * this._platformManager.getGamespeed() * delta
    })
  }

  updateFrontProps(delta: number) {
    this._frontPropsContainer.children.forEach(prop => {
      prop.position.x -= this._platformManager.getGamespeed() * delta

      if (prop.position.x + config.frontPropsWidth  <= 0) {
        prop.position.x +=
          2.9 * config.frontPropsWidth
      }
    })
  }

  setPropsPos() {
    this._propsContainer.children.forEach((prop, index) => {
      prop.position.set(config.WIDTH * index, config.HEIGHT)
    })
  }

  setFrontPropsPos() {
    let index = 0
    this._frontPropsContainer.children.forEach(prop => {
      prop.position.x = index
      index += config.frontPropsWidth - 50
    })
  }

  async initLevel() {
    await Assets.loadBundle('level')

    this.initKeyListener()
    this._platformManager = new PlatformManager(this._physicEngine, this._gameContainer)

    this._player = new Player(this._physicEngine.world, this._gameContainer)
    this.displayCountdown()
  }

  getLevelContainer(): Container {
    return this._stateContainer
  }

  initKeyListener() {
    window.addEventListener('keydown', e => this.makePlayerJump(e))
    window.addEventListener('keyup', e => this.stopPlayerJump(e))
  }

  makePlayerJump(e: KeyboardEvent) {
    if (e.repeat) return

    if (e.code === 'Space' && !this.#blockJump) this._player.setIsJumping(true)
  }

  stopPlayerJump(e: KeyboardEvent) {
    if (e.code === 'Space') this._player.stopVelocity()
  }

  checkForCollisionWithPlatform() {
    this._platformManager.getPlatformList().forEach(platform => {
      const collision = MATTER.Collision.collides(this._player.getBody(), platform.getBody())
      if (collision?.collided && collision.normal.y === 1) this._player.resetJump()
    })
  }

  checkForCollisionWithDiamond() {
    this._platformManager.getPlatformList().forEach(platForm => {
      platForm.getDiamondList().forEach(diamond => {
        const collision = MATTER.Collision.collides(this._player.getBody(), diamond.getBody())
        if (collision?.collided && !diamond.getHasBeenTaken()) {
          diamond.setHasBeenTaken(true)
          this._scoreBoard.addToScore(config.diamond.points)

          this._platformManager.increaseGamespeed()
        }
      })
    })
  }

  checkIfPlayerFell(): void {
    if (this._player.hasFallen()) {
      this._platformManager.setGameSpeed(0)
      this.#blockJump = true
      this._changeState('gameOver')
    }
  }

  start = (): void => {
    this._countdown = config.COUNTDOWN
    this._scoreBoard.resetScore()
    this.setPropsPos()
    this.setFrontPropsPos()
    this._platformManager.resetPlatforms()
    this._scoreBoard.setVisibility(true)
    this._displayedSecond.text = `${this._countdown}`
    this._player.reset()
  }

  updateCountdown() {
    if (Math.floor(this._seconds) === 1) {
      this._seconds = 0
      this._countdown--

      if (this._countdown) this._displayedSecond.text = `${this._countdown}`
      else {
        this._displayedSecond.text = ''
        this.#blockJump = false
        this._platformManager.setGameSpeed(config.SPEED)
      }
    }
  }

  update(delta: number) {
    if (this._physicEngine && this._player) {
      MATTER.Engine.update(this._physicEngine, delta)
      this._player.update()
      this.checkForCollisionWithDiamond()
      this.checkForCollisionWithPlatform()
      this._platformManager.update(delta)
      this.updateProps(delta)
      this.updateFrontProps(delta)
      this._scoreBoard.update()
      this.checkIfPlayerFell()

      if (this._countdown) {
        this._seconds += (1 / 60) * delta
        this.updateCountdown()
      }
    }
  }

  destroy() {
    window.removeEventListener('keydown', () => this._player.addVelocity())
    window.removeEventListener('keyup', e => this.stopPlayerJump(e))
  }
}
