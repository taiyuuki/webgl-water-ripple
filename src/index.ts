import GlslCanvas from 'glslCanvas'
import { getFragmentShaderSource, getVertexShaderSource } from './shaders'

// import { waterNormalTexture } from './waternormal'

type PropertyName = 'animationSpeed' | 'direction' | 'ratio' | 'scale' | 'scrollSpeed' | 'strength'

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

class WaterRipple {
    _animationID: number
    _time: number
    _glsl: GlslCanvas

    constructor(options: WaterRipperOptions) {
        let { canvas, imageURL } = options

        if (typeof canvas === 'string') {
            canvas = document.querySelector(canvas) as HTMLCanvasElement
        }
        if (!canvas) {
            throw new TypeError('[WaterRipple] A canvas element is required.')
        }
        if (typeof HTMLCanvasElement !== 'undefined' && !(canvas instanceof HTMLCanvasElement)) {
            throw new TypeError('[WaterRipple] canvas is not a valid HTMLCanvasElement.')
        }
        if (!imageURL || typeof imageURL !== 'string') {
            throw new TypeError('[WaterRipple] Image URL is required.')
        }
        this._time = 0
        this._animationID = -1
        this._glsl = new GlslCanvas(canvas)
        const hasMask = options.maskURL ? true : false

        const opts = Object.assign({
            animationSpeed: 0.2,
            scale: 2,
            scrollSpeed: 0.2,
            direction: 0,
            ratio: 1.0,
            strength: 0.1,
        }, options)

        this._glsl.load(getFragmentShaderSource(hasMask), getVertexShaderSource(hasMask))   
        
        this._glsl.setUniform('g_AnimationSpeed', opts.animationSpeed)
        this._glsl.setUniform('g_Scale', opts.scale)
        this._glsl.setUniform('g_ScrollSpeed', opts.scrollSpeed)
        this._glsl.setUniform('g_Direction', opts.direction % 360 * Math.PI / 180)
        this._glsl.setUniform('g_Ratio', opts.ratio)
        this._glsl.setUniform('g_Strength', opts.strength)
        
        this._loadImage(imageURL, 'g_Texture0').then(img => {
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            const p: Promise<HTMLImageElement>[] = []
            if (opts.maskURL) {
                p.push(this._loadImage(opts.maskURL, 'g_Texture1'))
            }
            if (opts.normalMapURL) {
                p.push(this._loadImage(opts.normalMapURL, 'g_Texture2'))
            }
            else {

                // p.push(this._loadImage(waterNormalTexture, 'g_Texture2'))
    
                import('./waternormal').then(({ waterNormalTexture }) => {
                    p.push(this._loadImage(waterNormalTexture, 'g_Texture2'))
                    Promise.all(p).then(() => {
                        this.animate()
                    })
                })
            }
        })
    }

    private async _loadImage(url: string, uniformName: string, toDataURL = false) {
        const resolutionName = `${uniformName}Resolution`
        const img = new Image()
        img.src = url
        
        return new Promise<HTMLImageElement>((resolve, reject) => {
            img.onload = () => {
                if (toDataURL) {
                    const cvs = document.createElement('canvas')
                    cvs.width = img.naturalWidth
                    cvs.height = img.naturalHeight
                    const ctx = cvs.getContext('2d')
                    if (!ctx) {
                        throw new Error('[WaterRipple] Failed to get canvas context.')
                    }
                    ctx.drawImage(img, 0, 0)
                    url = cvs.toDataURL()
                }
                this._glsl.setUniform(uniformName, url)
                this._glsl.setUniform(resolutionName, img.naturalWidth, img.naturalHeight, 1, 1)
                resolve(img)
            }
            img.onerror = () => {
                console.error('[WaterRipple] Failed to load image:', url)
                reject(img)
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

    stop() {
        cancelAnimationFrame(this._animationID)
        this._time = 0
        this._animationID = -1
    }

    destroy() {
        this.stop()
        this._glsl.destroy()
    }

    setProperty(propName: PropertyName, value: any) {
        if (propName === 'direction') {
            value = value % 360 * Math.PI / 180
        }
        this._glsl.setUniform(`g_${propName[0].toUpperCase() + propName.slice(1)}`, value)
    }
}

export { WaterRipple }
