import AniElement from './AniElement'
import { Helpers } from './Helpers'

export const AniGroupActions = {
    'default-appear': (el) => {
        el.style.opacity = 1
    },
}

AniGroupActions['basic-appear'] = (el, children) => {
    el.style.opacity = 1
    el.style.transition = 'none'
    el.classList.add('ani-has-appeared')
    el.classList.add('ani-start')
    let count = 0
    let completeCount = 0
    const onComplete = () => {
        completeCount++
        if (completeCount === count) {
            el.classList.remove('ani-start')
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
