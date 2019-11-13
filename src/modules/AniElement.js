import { TweenMax } from 'gsap/TweenMax'
import { AniConfig } from './AniConfig'
import { Helpers } from './Helpers'

class AniElement {
    constructor(el, index, preset, completeHandler, appearState) {
        this.el = el
        this.index = index
        this.appearState = appearState
        this.completeHandler = () => {
            this.appearState.counter++
            completeHandler()
        }
        this.delaySpeed = AniConfig.delaySpeed
        if (AniConfig.autoStagger) {
            this.delaySpeed = (1 + this.index) * this.delaySpeed
        }
        if (Helpers.hasAttribute(this.el, 'ani-delay-speed')) {
            this.delaySpeed = parseFloat(Helpers.getAttribute(this.el, 'ani-delay-speed'))
        }
        this.movement = AniConfig.moveDistance
        if (Helpers.hasAttribute(this.el, 'ani-move-distance')) {
            this.movement = parseFloat(Helpers.getAttribute(this.el, 'ani-move-distance'))
        }
        this.zoomScale = AniConfig.zoomScale
        if (Helpers.hasAttribute(this.el, 'ani-zoom-scale')) {
            this.zoomScale = parseFloat(Helpers.getAttribute(this.el, 'ani-zoom-scale'))
        }
        this.speed = AniConfig.speed
        if (Helpers.hasAttribute(this.el, 'ani-speed')) {
            this.speed = parseFloat(Helpers.getAttribute(this.el, 'ani-speed'))
        }
        this.ease = window.EaseLookup.find(AniConfig.ease)
        if (Helpers.hasAttribute(this.el, 'ani-ease')) {
            const ease = window.EaseLookup.find(Helpers.getAttribute(this.el, 'ani-ease'))
            if (ease) {
                this.ease = ease
            }
        }
        this.textLineDelaySpeed = AniConfig.textLineDelaySpeed
        if (Helpers.hasAttribute(this.el, 'ani-text-line-delay-speed')) {
            this.textLineDelaySpeed = parseFloat(AniConfig.textLineDelaySpeed)
        }
        this.textLineYOffset = AniConfig.textLineYOffset
        if (Helpers.hasAttribute(this.el, 'ani-text-line-y-offset')) {
            this.textLineYOffset = parseFloat(AniConfig.textLineYOffset)
        }
        if (preset && typeof preset === 'string' && preset !== '') {
            this.preset = preset
        } else {
            this.preset = 'fade'
        }
        this.el.style.opacity = 0
    }

    appear() {
        // only show the element if it's in the viewport,
        // otherwise we wait for the user to scroll to it
        clearTimeout(this.appearTimeout)
        if (!Helpers.isInViewport(this.el)) {
            this.appearTimeout = setTimeout(() => {
                this.appear()
            }, 250)
            return
        }
        // We need to update the delay time if a user takes
        // their time scrolling to something that was
        // already meant to be seen.
        let updatedIndex = this.index - this.appearState.counter
        updatedIndex = updatedIndex < 0 ? 0 : updatedIndex
        this.delaySpeed = AniConfig.delaySpeed
        if (AniConfig.autoStagger) {
            this.delaySpeed = (1 + updatedIndex) * this.delaySpeed
        }

        this.el.style.opacity = null
        const motions = this.preset.split('-')
        const motionName = motions.shift()
        const option = motions.join('-')
        if (motionName === 'wipe') {
            this.wipe(option)
        } else if (motionName === 'zoom') {
            this.zoom(option)
        } else if (motionName === 'class' && option) {
            this.addClass(option)
        } else if (motionName === 'text') {
            this.text(option)
        } else {
            this.fade(option)
        }
    }

    fade(direction) {
        let startProps = { x: 0, y: 0, opacity: 0 }
        if (typeof direction === 'string') {
            switch (direction) {
                case 'left':
                    startProps.x = this.movement
                    break
                case 'right':
                    startProps.x = -this.movement
                    break
                case 'down':
                    startProps.y = -this.movement
                    break
                case 'up':
                    startProps.y = this.movement
                    break
                default:
                    startProps.y = 0
            }
        }
        TweenMax.fromTo(this.el, this.speed, startProps, {
            opacity: 1,
            y: 0,
            x: 0,
            ease: this.ease,
            delay: this.delaySpeed,
            onComplete: this.completeHandler,
            clearProps: 'x,y,opacity',
        })
    }

    wipe(direction = 'left') {
        let startProps = this.clipPath(100)
        let endProps = this.clipPath(0)
        switch (direction) {
            case 'up':
                startProps = this.clipPath(500, 0, 0, 0)
                endProps = this.clipPath(0, 0, 0, 0)
                break
            case 'down':
                startProps = this.clipPath(0, 0, 500, 0)
                endProps = this.clipPath(0, 0, 0, 0)
                break
            case 'left':
                startProps = this.clipPath(0, 0, 0, 500)
                endProps = this.clipPath(0, 0, 0, 0)
                break
            case 'right':
            default:
                startProps = this.clipPath(0, 500, 0)
                endProps = this.clipPath(0, 0, 0)
                break
        }
        endProps.delay = this.delaySpeed
        endProps.ease = this.ease
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
                {
                    opacity: 1,
                    scale: this.zoomScale,
                    delay: this.delaySpeed,
                    onComplete: this.completeHandler,
                    ease: this.ease,
                    // Need to keep scale
                    clearProps: 'opacity',
                }
            )
        } else {
            TweenMax.fromTo(
                this.el,
                this.speed,
                { opacity: 0, scale: this.zoomScale },
                {
                    opacity: 1,
                    scale: 1,
                    delay: this.delaySpeed,
                    onComplete: this.completeHandler,
                    ease: this.ease,
                    clearProps: 'opacity, scale',
                }
            )
        }
    }

    text(option) {
        const originalContent = this.el.innerHTML
        Helpers.wrapLines(this.el)
        const lines = this.el.querySelectorAll('.ani-line')
        const speed = this.speed / lines.length + 1
        lines.forEach((item, index) => {
            let startingOpacity = 0
            const $group = item.querySelector('.ani-line-group')
            item.style.display = 'block'
            if (option === 'line-mask') {
                item.style.overflow = 'hidden'
                startingOpacity = 1
            }
            $group.style.display = 'inline-block'
            const complete = (i) => {
                if (i === lines.length - 1) {
                    this.el.innerHTML = originalContent
                    this.completeHandler()
                }
            }
            TweenMax.fromTo(
                $group,
                speed,
                { y: $group.offsetHeight + this.textLineYOffset, opacity: startingOpacity },
                {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    ease: this.ease,
                    delay: this.delaySpeed + index * this.textLineDelaySpeed,
                    onComplete: complete,
                    onCompleteParams: [index],
                    clearProps: 'all',
                }
            )
        })
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
        }, this.delaySpeed)
    }
}
export default AniElement
