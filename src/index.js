import '@babel/polyfill/noConflict'
import polyfill from 'element-closest'

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach
    }
    polyfill(window)
}

import Ani from './modules/Ani.js'
import AniElement from './modules/AniElement.js'
import AnimationGroup from './modules/AnimationGroup.js'
import { Helpers } from './modules/Helpers.js'
import { AniGroupActions } from './modules/AniGroupActions.js'
import { AniConfig } from './modules/AniConfig.js'

export { Ani, AniConfig, AniElement, AniGroupActions, AnimationGroup, Helpers }
console.log('ani-friend v1.1.01')
