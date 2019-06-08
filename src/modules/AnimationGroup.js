import { AniPresets } from './AniPresets'
import { Helpers } from './Helpers'

export class AnimationGroup {
    constructor(el) {
        this.el = el
        // Reveal when at this percent of the screen:
        this.offsetPercentage = 0.25
        this.images = el.querySelectorAll('img[load-src], img[data-load-src]')
        this.imageLoadedCount = 0
        this.hasAppeared = false
        this.children = [].slice.call(this.el.querySelectorAll('[ani-child], [data-ani-child]'))
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
            if (typeof AniPresets[Helpers.getAttribute(el, 'ani')] === 'function') {
                this.onAppear = AniPresets[Helpers.getAttribute(el, 'ani')]
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
