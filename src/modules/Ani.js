import { AnimationGroup } from './AnimationGroup'

export class Ani {
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
