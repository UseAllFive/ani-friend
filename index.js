const animation = {
    'default-appear': (el, children) => {
        el.style.opacity = 1
    },
}

animation['basic-appear'] = (el, children) => {
    el.style.opacity = 1
    el.style.transition = 'none'
    children.forEach((item, index) => {
        let preset = ''
        if (item.hasAttribute('ani-preset')) {
            preset = item.getAttribute('ani-preset')
        }
        const ani = new AniElement(item, index, preset)
        ani.appear()
    })
}

class AniElement {
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
            ease: Quint.easeOut,
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
        endProps.ease = Quint.easeOut
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

    getFunction() {}
}

class AnimationGroup {
    constructor(el) {
        this.el = el
        // Reveal when at this percent of the screen:
        this.offsetPercentage = 0.25
        this.images = el.querySelectorAll('img[load-src]')
        this.imageLoadedCount = 0
        this.hasAppeared = false
        this.children = [].slice.call(this.el.querySelectorAll('[ani-child]'))
        this.children.forEach((item, index) => {
            if (item.hasAttribute('ani-child-order')) {
                item.order = parseInt(item.getAttribute('ani-child-order'))
            } else {
                item.order = this.children.length + index
            }
        })
        this.children.sort((a, b) => (a.order > b.order ? 1 : -1))
        this.onAppear = () => {
            this.el.classList.add('appear')
        }
        if (el.hasAttribute('ani')) {
            if (typeof animation[el.getAttribute('ani')] === 'function') {
                this.onAppear = animation[el.getAttribute('ani')]
            }
        }
    }

    check() {
        if (this.isInViewport(this.el, window.innerHeight)) {
            this.loadAssets()
        }
        if (
            !this.hasAppeared &&
            this.imageLoadedCount === this.images.length &&
            this.isInViewport(this.el, window.innerHeight * -this.offsetPercentage)
        ) {
            this.appear()
        }
    }

    appear() {
        this.hasAppeared = true
        this.onAppear(this.el, this.children)
    }

    isInViewport(elem, padding = 0) {
        const bounding = elem.getBoundingClientRect()
        return bounding.top - padding < (window.innerHeight || document.documentElement.clientHeight)
    }

    imageLoadHandler(event) {
        this.imageLoadedCount++
        // Want to check again in case user hasn't scrolled
        // while the image finishes loading
        this.check()
    }

    loadAssets() {
        this.images.forEach((img) => {
            if (img.hasAttribute('load-src')) {
                const src = img.getAttribute('load-src')
                img.removeAttribute('load-src')
                img.addEventListener('load', this.imageLoadHandler.bind(this))
                img.addEventListener('error', this.imageLoadHandler.bind(this))
                img.setAttribute('src', src)
            }
        })
    }
}

class Ani {
    constructor() {
        this.els = document.querySelectorAll('[ani]')
        this.groups = []
        this.els.forEach((item) => {
            this.groups.push(new AnimationGroup(item))
        })
        window.addEventListener('scroll', (event) => {
            this.check()
        })

        this.check()
    }

    check() {
        this.groups.forEach((item) => {
            item.check()
        })
    }
}

new Ani()
