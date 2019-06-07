```
npm install --save ani-friend
```

# Ani Friend

This tool will reveal an area when in view and allow you to control
how the container and any children elements appear.

As the user scroll, it will lazyload images when they're at
one screen height lower.

There are built in animation presets, or you can build your own.

### Usage

```javascript
import { Ani } from 'ani-friend'

new Ani()
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

### HTML Attributes

`ani`: Takes a string for the parent preset name
`ani-child`: Defines this node to be a child
`ani-preset`: Micro animations for individual objects.

-   `basic-appear` comes with: `fade` and `wipe`
-   Then you may append a direction `-up`, `-down`, `-left`, `-right`
    `ani-child-order`: you can sequence the order of nodes that come in
-   If you leave one blank, it takes the dom order, but ranks lower than nodes that are set
    `load-src`: add to image tags in lieu src attributes, and it will lazy load

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
