if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}
import { Ani } from './modules/Ani'

window.Ani = Ani
