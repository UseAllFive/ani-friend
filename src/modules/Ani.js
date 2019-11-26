import AnimationGroup from './AnimationGroup'
import { AniConfig } from './AniConfig'

class Ani {
    constructor() {
        this.groups = []
        this.createObserver()
        this.update()
    }

    observe(el) {
        this.observer.observe(el)
    }

    createObserver() {
        let options = {
            root: null,
            rootMargin: AniConfig.rootMargin,
            threshold: AniConfig.threshold,
        }
        this.observer = new IntersectionObserver((entries) => this.onIntersect(entries), options)
    }

    onIntersect(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const elem = entry.target
                const item = this.groups.find((item) => item.el === elem)
                item.loadAssetsAndAppear()
            }
        })
    }

    update() {
        this.els = document.querySelectorAll('[ani]:not([data-ani-added]), [data-ani]:not([data-ani-added])')
        this.els.forEach((item) => {
            item.setAttribute('data-ani-added', true)
            this.groups.push(new AnimationGroup(item, this))
        })
    }
}
export default Ani
