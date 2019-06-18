import { TweenMax, Power4 } from 'gsap/TweenMax'
import { AniConfig } from './AniConfig'
import { Helpers } from './Helpers'

export class AniElement {
    constructor(el, index, preset, completeHandler) {
        this.el = el
        this.index = index
        this.completeHandler = completeHandler
        this.delaySpeed = AniConfig.delaySpeed
        if (Helpers.hasAttribute(this.el, 'ani-delay-speed')) {
            this.delaySpeed = parseFloat(Helpers.getAttribute(this.el, 'ani-delay-speed'))
        }
        this.movement = AniConfig.moveDistance
        if (Helpers.hasAttribute(this.el, 'ani-move-distance')) {
            this.movement = parseFloat(Helpers.getAttribute(this.el, 'ani-move-distance'))
        }
        this.speed = AniConfig.speed
        if (Helpers.hasAttribute(this.el, 'ani-speed')) {
            this.speed = parseFloat(Helpers.getAttribute(this.el, 'ani-speed'))
        }
        if (preset && typeof preset === 'string' && preset !== '') {
            this.preset = preset
        } else {
            this.preset = 'fade'
        }
    }

    appear() {
        const motions = this.preset.split('-')
        const motionName = motions.shift()
        const option = motions.join('-')
        if (motionName === 'wipe') {
            this.wipe(option)
        } else if (motionName === 'zoom') {
            this.zoom(option)
        } else if (motionName === 'class' && option) {
            this.addClass(option)
        } else {
            this.fade(option)
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
        TweenMax.fromTo(this.el, this.speed, startProps, {
            opacity: 1,
            y: 0,
            x: 0,
            ease: Power4.easeOut,
            delay: this.index * this.delaySpeed,
            onComplete: this.completeHandler,
        })
    }

    wipe(direction = 'left') {
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
        endProps.onComplete = this.completeHandler
        TweenMax.fromTo(this.el, this.speed, startProps, endProps)
    }

    zoom(direction = 'in') {
        const wrapper = this.el.parentElement

        wrapper.style.overflow = 'hidden'
        if (getComputedStyle(this.el, null).display === 'inline') {
            wrapper.style.display = 'inline-block'
        } else {
            wrapper.style.display = getComputedStyle(this.el, null).display
        }

        if (direction === 'out') {
            TweenMax.fromTo(
                this.el,
                this.speed,
                { opacity: 0, scale: 1 },
                { opacity: 1, scale: 1.4, delay: this.index * this.delaySpeed, onComplete: this.completeHandler }
            )
        } else {
            TweenMax.fromTo(
                this.el,
                this.speed,
                { opacity: 0, scale: 1.4 },
                { opacity: 1, scale: 1, delay: this.index * this.delaySpeed, onComplete: this.completeHandler }
            )
        }
    }

    clipPath(top = 0, right = 0, bottom = 0, left = 0) {
        const paths = {
            clipPath: `inset(${top}% ${right}% ${bottom}% ${left}%)`,
            // TODO: make up/down work in safari
            webkitClipPath: `inset(${top}% ${right}% ${bottom}% ${left}%)`,
        }
        return paths
    }

    addClass(name) {
        setTimeout(() => {
            this.el.classList.add(name)
            this.completeHandler()
        }, this.index * this.delaySpeed)
    }
}
