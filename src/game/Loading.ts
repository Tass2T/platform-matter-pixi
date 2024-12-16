import { Container, Graphics, Text } from 'pixi.js'
import { AppScreen } from '../models'
import gameConfig from '../../gameConfig.ts'
import gsap from 'gsap'
import config from '../../gameConfig.ts'

export default class Loading extends Container implements AppScreen {
    #letters: Array<Text> = []
    #tween: gsap.core.Tween

    constructor() {
        super()

        const background = new Graphics().rect(0, 0, gameConfig.WIDTH, gameConfig.HEIGHT).fill(0x000000)

        this.addChild(background)

        this.initText()
    }

    initText = () => {
        const sentence = 'CHARGEMENT'

        sentence.split('').forEach((l, index) => {
            const letter = new Text({
                text: l,
                style: { fontFamily: 'Arial', fontSize: 44, fill: 0xffffff, align: 'center' },
            })
            letter.position.set(config.WIDTH / 3 + index * 40, config.HEIGHT / 2)
            this.#letters.push(letter)
        })

        this.#tween = gsap.to(this.#letters, {
            pixi: { y: config.HEIGHT / 2 - 30 },
            duration: 0.4,
            repeat: -1,
            stagger: 0.2,
        })
        this.addChild(...this.#letters)
    }

    hide = () => {
        this.#tween.kill()
        this.visible = false
    }
}
