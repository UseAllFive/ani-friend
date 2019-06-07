import { AnimationGroup } from './AnimationGroup'

export class Ani {
    constructor() {
        this.groups = []
        this.update()
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

    update() {
        this.els = document.querySelectorAll('[ani]:not([data-ani-added]), [data-ani]:not([data-ani-added])')
        this.els.forEach((item) => {
            item.setAttribute('data-ani-added', true)
            this.groups.push(new AnimationGroup(item))
        })
    }
}
