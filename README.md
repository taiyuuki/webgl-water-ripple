## webgl-water-ripper

This is a WebGL implementation of water ripples.

## Usage

```bash
npm i webgl-water-ripple
```

```javascript
import WaterRipple from 'webgl-water-ripple'

const waterRipple = new WaterRipple(options)

waterRipple.animate()
```
the `options` parameter is an object with the following properties:

```typescript
interface WaterRipperOptions { 
    canvas: HTMLCanvasElement // the canvas element where the water ripple effect will be rendered.
    imageURL: string // the texture image you want to use with the water ripple effect.
    maskURL?: string // the mask texture, it controls the opacity of the water ripple.
    normalMapURL?: string // the normal map for the water ripple.
    animationSpeed?: number // the animation speed.
    scale?: number // the scale of the water ripple.
    scrollSpeed?: number // the scroll speed of the water ripple.
    direction?: number // the direction of the water ripple.
    ratio?: number // the ratio of the water ripple.
    strength?: number // the strength of the water ripple.
}
```