export const Helpers = {
    getAttribute(el, att) {
        if (el.hasAttribute(att)) {
            return el.getAttribute(att)
        } else if (el.hasAttribute(`data-${att}`)) {
            console.log('get attributee')
            return el.getAttribute(`data-${att}`)
        }
        return false
    },
    hasAttribute(el, att) {
        if (el.hasAttribute(att) || el.hasAttribute(`data-${att}`)) {
            return true
        }
        return false
    },
}
