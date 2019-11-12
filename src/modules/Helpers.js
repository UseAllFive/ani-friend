export const Helpers = {
    getAttribute: function(el, att) {
        if (el.hasAttribute(att)) {
            return el.getAttribute(att)
        } else if (el.hasAttribute(`data-${att}`)) {
            return el.getAttribute(`data-${att}`)
        }
        return false
    },
    hasAttribute: function(el, att) {
        if (el.hasAttribute(att) || el.hasAttribute(`data-${att}`)) {
            return true
        }
        return false
    },
    isInViewport: function(elem, padding = 0) {
        // If at the bottom of the page:
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            // Remove padding in case an el is near the bottom
            padding = 0
        }
        const bounding = elem.getBoundingClientRect()
        return bounding.top - padding < (window.innerHeight || document.documentElement.clientHeight)
    },
    wrapLines: function($container) {
        // get the text from the conatiner
        var text = $container.innerText

        // split the text into words
        var words = text.split(' ')

        var parsedWords = []
        words.forEach((word) => {
            if (word.indexOf('-') !== -1) {
                var hyphenatedWords = word.split('-')
                hyphenatedWords.forEach((hw, i) => {
                    let wordUpdated = hw
                    if (i !== hyphenatedWords.length - 1) {
                        wordUpdated += '-'
                    }
                    parsedWords.push(wordUpdated)
                })
            } else {
                parsedWords.push(word)
            }
        })

        // wrap each word in a span and add it to a tmp
        var tmp = ''
        parsedWords.forEach((word) => {
            let spacing = word.indexOf('-') !== -1 ? '' : ' '
            tmp += `<span>${word}${spacing}</span>`
        })

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
            let spacing = word.innerText.indexOf('-') !== -1 ? '' : ' '
            // add the content of the word node + a space
            tmp += word.innerText + spacing
        })
        // close the last line
        tmp += '</span>'

        // remove the content of the conatiner, and replace it with the wrapped lines
        $container.innerHTML = tmp
    },
}
