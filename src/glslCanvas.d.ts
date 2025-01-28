declare module 'glslCanvas' {

    class Texture {
        constructor(gl: WebGLRenderingContext, name: string, options: any)
        load(options: any): void
        bind(unit: number): void
        setUrl(url: string, option?: any): void
        on(event: string, callback: (args: any)=> void): void
        destroy(): void
        texture: WebGLTexture
        width: number
        height: number
    }

    type ContextOptions = Partial<WebGLContextAttributes> & {
        vertexString?: string
        fragmentString?: string
        backgroundColor?: string
    }

    type Options = { onError: (errorCode: number)=> void }

    class GlslCanvas {
        constructor(canvas: HTMLCanvasElement, contextOptions?: ContextOptions, options?: Options)

        canvas: HTMLCanvasElement
        gl: WebGLRenderingContext | undefined
        deps: { [key: string]: string }
        program: WebGLProgram | undefined
        textures: { [key: string]: Texture }
        buffers: { [key: string]: any }
        uniforms: { [key: string]: any }
        vbo: { [key: string]: WebGLBuffer }
        isValid: boolean
        animationFrameRequest: number | undefined
        BUFFER_COUNT: number
        vertexString: string
        fragmentString: string
        timeLoad: number
        timePrev: number
        timeDelta: number
        forceRender: boolean
        paused: boolean
        realToCSSPixels: number
        nMouse: number
        nDelta: number
        nTime: number
        nDate: number

        destroy(): void
        load(fragString?: string, vertString?: string): void
        test(callback: (result: any)=> void, fragString?: string, vertString?: string): void
        loadTexture(name: string, urlElementOrData: any | string, options?: any): void
        refreshUniforms(): void
        setUniform(name: string, ...value: any[]): void
        setUniforms(uniforms: any): void
        setMouse(mouse: { x: number, y: number }): void
        uniform(method: string, type: string, name: string, ...value: any[]): void
        uniformTexture(name: string, texture: any, options?: any): void
        resize(): boolean
        render(): void
        pause(): void
        play(): void
        renderPrograms(): void
        getBuffers(fragString: string): { [key: string]: any }
        loadPrograms(buffers: { [key: string]: any }): void
        createSwappableBuffer(W: number, H: number, program: WebGLProgram): any
        createBuffer(W: number, H: number, program: WebGLProgram): any
        resizeSwappableBuffers(): void

        version(): string

        trigger(event: string, args: any): void

        on(type: string, listener: (...args: any[])=> void): void
        off(type: string, listener: (...args: any[])=> void): void

        listSubscriptions(): void
        subscribe(listener: (event: string, args: any)=> void): void
        unsubscribe(listener: (event: string, args: any)=> void): void
        unsubscribeAll(): void
    }

    export default GlslCanvas

}
