import { AniElement } from './AniElement'
import { Helpers } from './Helpers'

export const AniPresets = {
    'default-appear': (el, children) => {
        el.style.opacity = 1
    },
}

AniPresets['basic-appear'] = (el, children) => {
    el.style.opacity = 1
    el.style.transition = 'none'
    el.classList.add('ani-started')
    let count = 0
    let completeCount = 0
    const onComplete = () => {
        completeCount++
        if (completeCount === count) {
            el.classList.remove('ani-started')
            el.classList.add('ani-complete')
        }
    }
    children.forEach((item, index) => {
        let preset = ''
        count++
        if (Helpers.hasAttribute(item, 'ani-preset')) {
            preset = Helpers.getAttribute(item, 'ani-preset')
        }
        const ani = new AniElement(item, index, preset, onComplete)
        ani.appear()
    })
}
