import { AniGroupActions } from './AniGroupActions'
import { Helpers } from './Helpers'
import { AniConfig } from './AniConfig'

class AnimationGroup {
    constructor(el) {
        this.el = el
        // Reveal when at this percent of the screen:
        if (Helpers.hasAttribute(this.el, 'ani-in-view-trigger-percent')) {
            this.offsetPercentage = parseFloat(Helpers.getAttribute(this.el, 'ani-in-view-trigger-percent'))
        } else {
            this.offsetPercentage = AniConfig.inViewTriggerPercent
        }
        let images
        if (AniConfig.waitForAllImages) {
            images = el.querySelectorAll('img')
        } else {
            images = el.querySelectorAll('img[load-src], img[data-load-src]')
        }

        this.images = [...images].filter((child) => {
            return child.closest('[ani], [data-ani]') === this.el
        })

        this.images.forEach((img) => {
            const src = Helpers.hasAttribute(img, 'load-src')
                ? Helpers.getAttribute(img, 'load-src')
                : img.getAttribute('src')
            img.setAttribute('data-load-src', src)
            img.removeAttribute('src')
        })

        this.imageLoadedCount = 0
        this.hasAppeared = false

        const children = this.el.querySelectorAll('[ani-child], [data-ani-child]')

        const filteredChildren = [...children].filter((child) => {
            return child.closest('[ani], [data-ani]') === this.el
        })

        this.children = filteredChildren
        this.children.forEach((item, index) => {
            if (Helpers.hasAttribute(item, 'ani-child-order')) {
                item.order = parseInt(Helpers.getAttribute(item, 'ani-child-order'))
            } else {
                item.order = this.children.length + index
            }
        })
        this.children.sort((a, b) => (a.order > b.order ? 1 : -1))
        this.onAppear = () => {
            this.el.classList.add('appear')
        }
        if (Helpers.hasAttribute(el, 'ani')) {
            if (typeof AniGroupActions[Helpers.getAttribute(el, 'ani')] === 'function') {
                this.onAppear = AniGroupActions[Helpers.getAttribute(el, 'ani')]
            }
        }
    }

    check() {
        if (Helpers.isInViewport(this.el, window.innerHeight)) {
            this.loadAssets()
        }
        if (
            !this.hasAppeared &&
            this.imageLoadedCount === this.images.length &&
            Helpers.isInViewport(this.el, window.innerHeight * -this.offsetPercentage)
        ) {
            this.appear()
        }
    }

    appear() {
        this.hasAppeared = true
        setTimeout(() => {
            this.onAppear(this.el, this.children)
        }, AniConfig.initialDelay * 1000)
    }

    imageLoadHandler() {
        this.imageLoadedCount++
        // Want to check again in case user hasn't scrolled
        // while the image finishes loading
        this.check()
    }

    loadAssets() {
        this.images.forEach((img) => {
            if (Helpers.hasAttribute(img, 'load-src')) {
                const src = Helpers.getAttribute(img, 'load-src')
                img.removeAttribute('load-src')
                img.removeAttribute('data-load-src')
                img.addEventListener('load', this.imageLoadHandler.bind(this))
                img.addEventListener('error', this.imageLoadHandler.bind(this))
                img.setAttribute('src', src)
            }
        })
    }
}
export default AnimationGroup
