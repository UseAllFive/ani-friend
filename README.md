```
npm install --save ani-friend
```

# Animation Friend

This tool will reveal an area when in view and allow you to control
how the container and any children elements appear.

As the user scrolls, it will lazyload images when they’re at
one screen height lower.

There are built in animation presets, or you can build your own.

### Usage

```javascript
import { Ani } from 'ani-friend'

const ani = new Ani()

// If new elements that are animation groups get added dynamically,
// calling this will add any new elements with an ani attribute
ani.update()
```

```html
<section ani="basic-appear">
    <img ani-child load-src="/images/classes.jpg" />
    <img ani-child ani-child-order="4" ani-preset="fade-down" load-src="/images/marketing.jpg" />
    <img ani-child ani-child-order="2" ani-preset="wipe-down" load-src="/images/marketing.jpg" />
    <div ani-child ani-preset="fade" ani-child-order="1" style="background: green; display: inline-block">
        <img ani-child ani-child-order="3" ani-preset="wipe-left" load-src="/images/marketing.jpg" />
    </div>
    <img ani-child ani-child-order="1" ani-preset="fade-up" load-src="/images/marketing.jpg" />
</section>
```

Add this to your styles in the head, so all elements are hidden prior to DOM loading:

```css
[ani],
[data-ani] {
    opacity: 0;
}
```

### HTML Attributes

You may preface each attribute with `data-` if necessary.

`ani`: Takes a string for the parent preset name
`load-src`: add to image tags in lieu src attributes, and it will lazy load
`ani-child`: Defines this node to be a child
`ani-child-order`: you can sequence the order of nodes that come in
`ani-preset`: Micro animations for individual objects.

-   `basic-appear` comes with: `fade`, `wipe`, and `zoom`
-   Then you may append a direction `-up`, `-down`, `-left`, `-right`; Zoom: `-in` and `-out`.
-   For zoom, the element must be in a wrapper with an `overflow: hidden` that will crop the target.
-   If you leave one blank, it takes the dom order, but ranks lower than nodes that are set

### Example animation preset

```javascript
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
```
