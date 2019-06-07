import { AniElement } from './modules/AniElement'

export const AniPresets = {
    'default-appear': (el, children) => {
        el.style.opacity = 1
    },
}

AniPresets['basic-appear'] = (el, children) => {
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
