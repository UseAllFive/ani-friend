export const Helpers = {
    getAttribute(el, att) {
        if (el.hasAttribute(att)) {
            return el.getAttribute(att)
        } else if (el.hasAttribute(`data-${att}`)) {
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
    wrapLines($container) {
        // get the text from the conatiner
        var text = $container.innerText

        // split the text into words
        var words = text.split(' ')

        // wrap each word in a span and add it to a tmp
        var tmp = ''
        tmp += '<span>' + words.join(' </span><span>') + ' </span> '

        // remove the text from the container, and replace it with the wrapped words
        $container.innerHTML = tmp

        // prepare the offset variable and tmp
        var tmp = ''
        var top = null
        $container.querySelectorAll('span').forEach((word) => {
            // if this is the first iteration
            if (top === null) {
                // set the top
                top = word.offsetTop
                // open the first line
                tmp = '<span class="ani-line"><span class="ani-line-group">'
            }

            // if this is a new line (top is bigger then the previous word)
            if (top < word.offsetTop) {
                // close the previous line and start a new one
                tmp += '</span></span><span class="ani-line"><span class="ani-line-group">'
                // change the top
                top = word.offsetTop
            }

            // add the content of the word node + a space
            tmp += word.innerText + ' '
        })
        // close the last line
        tmp += '</span>'

        // remove the content of the conatiner, and replace it with the wrapped lines
        $container.innerHTML = tmp
    },
}
