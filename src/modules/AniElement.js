import { TweenMax, Power4 } from 'gsap/TweenMax'

export class AniElement {
    constructor(el, index, preset) {
        this.el = el
        this.index = index
        this.delaySpeed = 0.1
        this.movement = 500
        if (preset && typeof preset === 'string' && preset !== '') {
            this.preset = preset
        } else {
            this.preset = 'fade-up'
        }
    }

    appear() {
        const motions = this.preset.split('-')
        const direction = motions[1] ? motions[1] : null
        if (motions[0] === 'wipe') {
            this.wipe(direction)
        } else {
            this.fade(direction)
        }
    }

    fade(direction) {
        let startProps = { x: 0, y: 0, opacity: 0 }
        if (typeof direction === 'string') {
            switch (direction) {
                case 'up':
                    startProps.y = this.movement
                    break
                case 'down':
                    startProps.y = -this.movement
                    break
                case 'left':
                    startProps.x = this.movement
                    break
                case 'right':
                default:
                    startProps.x = -this.movement
                    break
            }
        }
        TweenMax.fromTo(this.el, 1.0, startProps, {
            opacity: 1,
            y: 0,
            x: 0,
            ease: Power4.easeOut,
            delay: this.index * this.delaySpeed,
        })
    }

    wipe(direction) {
        let startProps = this.clipPath(100)
        let endProps = this.clipPath(0)
        switch (direction) {
            case 'up':
                startProps = this.clipPath(100, 0, 0, 0)
                endProps = this.clipPath(0, 0, 0, 0)
                break
            case 'down':
                startProps = this.clipPath(0, 0, 100, 0)
                endProps = this.clipPath(0, 0, 0, 0)
                break
            case 'left':
                startProps = this.clipPath(0, 0, 0, 100)
                endProps = this.clipPath(0, 0, 0, 0)
                break
            case 'right':
            default:
                startProps = this.clipPath(0, 100, 0)
                endProps = this.clipPath(0, 0, 0)
                break
        }
        endProps.delay = this.index * this.delaySpeed
        endProps.ease = Power4.easeOut
        TweenMax.fromTo(this.el, 1.0, startProps, endProps)
    }

    clipPath(top = 0, right = 0, bottom = 0, left = 0) {
        const paths = {
            clipPath: `inset(${top}% ${right}% ${bottom}% ${left}%)`,
            // TODO: make up/down work in safari
            webkitClipPath: `inset(${top}% ${right}% ${bottom}% ${left}%)`,
        }
        return paths
    }
}