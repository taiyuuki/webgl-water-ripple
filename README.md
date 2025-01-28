## webgl-water-ripper

This is a WebGL implementation of applying water ripples effect to an image.

## Usage

[Demo](https://webgl-water-ripple.netlify.app/)

Download the [water-ripple-min.js](../../tree/main/test/water-ripple-min.js) file and include it in your HTML file. There is a `webglWR` object in the global scope, which you can use to create a new instance of `WaterRipple`.

```html
<canvas id="water-ripple"></canvas>
<script src="water-ripple-min.js"></script>
<script>
    const options = {
        canvas: '#water-ripple',
        imageURL: 'https://example.com/image.jpg',
    }

    const waterRipple = new webglWR.WaterRipple(options)
</script>
```

You can see the [index.html](../../tree/main/test/index.html) file for a complete example.

Or install the package using npm:

```bash
npm i webgl-water-ripple
```

```javascript
import { WaterRipple } from 'webgl-water-ripple'

const options = {
    canvas: document.querySelector('canvas'),
    imageURL: 'https://example.com/image.jpg',
}

const waterRipple = new WaterRipple(options)

waterRipple.setProperty('animationSpeed', 0.3)
waterRipple.setProperty('scrollSpeed', 0.3)

// waterRipple.stop() // stop the animation
// waterRipple.destroy() // destroy the instance
```

The `options` parameter is an object with the following properties:

```typescript
interface WaterRipperOptions { 
    canvas: HTMLCanvasElement | string
    imageURL: string
    maskURL?: string
    normalMapURL?: string
    animationSpeed?: number
    scale?: number
    scrollSpeed?: number
    direction?: number
    ratio?: number
    strength?: number
}
```

- `canvas` (required)
    - Type: HTMLCanvasElement | string
    - The canvas element where the water ripples will be drawn.
    - If a string is provided, it will be used as a selector to find the canvas element.
- `imageURL` (required)
    - Type: string
    - The URL of the main image to use for the water ripples.
- `maskURL` (optional)
    - Type: string
    - default: `undefined`
    - The URL of the mask to determine what areas of your image the water ripples effect is applied to.
- `normalMapURL` (optional)
    - Type: string
    - default: if not provided, a default normal map will be used.
    - The URL of the normal map for the water ripples.
- `animationSpeed` (optional)
    - Type: number
    - default: `0.2`
    - The speed of the water ripples animation.
    - Using `setProperty` method to change the value.
- `scale` (optional)
    - Type: number
    - default: `1`
    - The scale of the water ripples.
    - Using `setProperty` method to change the value.
- `scrollSpeed` (optional)
    - Type: number
    - default: `0.2`
    - The speed of the water ripples scroll.
    - Using `setProperty` method to change the value.
- `direction` (optional)
    - Type: number
    - default: `0`
    - The direction of scrolling. Only works when the scrollSpeed is greater than 0. The value should be in degrees and range from 0 to 360.
    - Using `setProperty` method to change the value.
- `ratio` (optional)
    - Type: number
    - default: `1`
    - The ratio of the ripple texture to the canvas size.
    - Using `setProperty` method to change the value.
- `strength` (optional)
    - Type: number
    - default: `0.1`
    - The strength of the water ripples.
    - Using `setProperty` method to change the value.