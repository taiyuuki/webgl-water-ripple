import GlslCanvas from 'glslCanvas'
import { getFragmentShaderSource, getVertexShaderSource } from './shaders'

// import { waterNormalTexture } from './waternormal'

type PropertyName = 'animationSpeed' | 'direction' | 'ratio' | 'scale' | 'scrollSpeed' | 'strength'

interface WaterRipperOptions { 
    canvas: HTMLCanvasElement
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

class WaterRipple {
    _animationID: number
    _time: number
    _glsl: GlslCanvas

    constructor(options: WaterRipperOptions) {
        const { canvas, imageURL } = options
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            throw new TypeError('[WaterRipple] A canvas element is required.')
        }
        if (!imageURL || typeof imageURL !== 'string') {
            throw new TypeError('[WaterRipple] An Image URL is required.')
        }
        this._time = 0
        this._animationID = -1
        this._glsl = new GlslCanvas(canvas)
        const hasMask = options.maskURL ? true : false

        const opts = Object.assign({
            animationSpeed: 0.2,
            scale: 2,
            scrollSpeed: 0.2,
            direction: 270,
            ratio: 1.0,
            strength: 0.1,
        }, options)

        this._glsl.load(getFragmentShaderSource(hasMask), getVertexShaderSource(hasMask))   
        
        this._glsl.setUniform('g_CanvasResolution', canvas.width, canvas.height, 1, 1)
        this._glsl.setUniform('g_AnimationSpeed', opts.animationSpeed)
        this._glsl.setUniform('g_Scale', opts.scale)
        this._glsl.setUniform('g_ScrollSpeed', opts.scrollSpeed)
        this._glsl.setUniform('g_Direction', opts.direction * Math.PI / 180)
        this._glsl.setUniform('g_Ratio', opts.ratio)
        this._glsl.setUniform('g_Strength', opts.strength)
        
        this._loadImage(imageURL, 'g_Texture0')
        if (opts.maskURL) {
            this._loadImage(opts.maskURL, 'g_Texture1')
        }
        if (opts.normalMapURL) {
            this._loadImage(opts.normalMapURL, 'g_Texture2')
        }
        else {

            // this._loadImage(waterNormalTexture, 'g_Texture2')

            import('./waternormal').then(({ waterNormalTexture }) => {
                this._loadImage(waterNormalTexture, 'g_Texture2')
            })
        }
    }

    private async _loadImage(url: string, uniformName: string) {
        const resolutionName = `${uniformName}Resolution`
        const img = new Image()
        img.src = url

        return new Promise((resolve, reject) => {
            img.onload = () => {
                this._glsl.setUniform(uniformName, url)
                this._glsl.setUniform(resolutionName, img.naturalWidth, img.naturalHeight, 1, 1)
                resolve(url)
            }
            img.onerror = () => {
                console.error('Failed to load image:', url)
                reject(url)
            }
        })
    }

    animate() {
        this._time += 0.005
        this._glsl.setUniform('g_Time', this._time)
        cancelAnimationFrame(this._animationID)

        this._animationID = requestAnimationFrame(() => {
            this.animate()
        })
    }

    destroy() {
        if (this._animationID) {
            cancelAnimationFrame(this._animationID)
            this._time = 0
            this._animationID = -1
        }
    }

    setProperty(propName: PropertyName, value: any) {
        if (propName === 'direction') {
            value = value * Math.PI / 180
        }
        this._glsl.setUniform(`g_${propName[0].toUpperCase() + propName.slice(1)}`, value)
    }
}

export { WaterRipple }
