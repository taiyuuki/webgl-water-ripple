function getVertexShaderSource(mask: boolean) {
    let source = `
    uniform vec4 g_Texture0Resolution;
    uniform vec4 g_Texture2Resolution;

    attribute vec2 a_Position;
    attribute vec2 a_TexCoord;

    varying vec4 v_TexCoord;

    varying vec4 v_TexCoordRipple;

    uniform float g_Time;
    uniform float g_AnimationSpeed;
    uniform float g_Scale;
    uniform float g_ScrollSpeed;
    uniform float g_Direction;
    uniform float g_Ratio;

    vec2 rotationVec2(vec2 v, float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
    }

    void main() {
        gl_Position = vec4(a_Position, 0.0, 1.0);
        v_TexCoord = a_TexCoord.xyxy;

        vec2 coordsRotated = v_TexCoord.xy;
        vec2 coordsRotated2 = v_TexCoord.xy * 1.333;
        
        vec2 scroll = rotationVec2(vec2(0.0, 1.0), g_Direction) * g_ScrollSpeed * g_ScrollSpeed * g_Time;
        
        v_TexCoordRipple.xy = coordsRotated + g_Time * g_AnimationSpeed * g_AnimationSpeed + scroll;
        v_TexCoordRipple.zw = coordsRotated2 - g_Time * g_AnimationSpeed * g_AnimationSpeed + scroll;
        v_TexCoordRipple *= g_Scale;

        float rippleTextureAdjustment = (g_Texture0Resolution.x / g_Texture0Resolution.y);
        v_TexCoordRipple.xz *= rippleTextureAdjustment;
        v_TexCoordRipple.yw *= g_Ratio;
    `

    if (mask) {
        source += `
        v_TexCoord.zw = vec2(v_TexCoord.x * g_Texture2Resolution.z / g_Texture2Resolution.x,
        v_TexCoord.y * g_Texture2Resolution.w / g_Texture2Resolution.y);
        `
    }

    source += `
    }
    `

    return source
}

function getFragmentShaderSource(mask: boolean) {
    let source = `
    #ifdef GL_ES
    precision highp float;
    #endif
    
    uniform float g_Strength;
    
    uniform sampler2D g_Texture0;
    `
    if (mask) {
        source += `
        uniform sampler2D g_Texture1;
        `
    }
    source += `
    uniform sampler2D g_Texture2;
    
    varying vec4 v_TexCoord;
    varying vec4 v_TexCoordRipple;

    void main() {
        vec2 texCoord = v_TexCoord.xy;
        
        float mask = 1.0;
        `
    if (mask) {
        source += `
        mask = texture2D(g_Texture1, texCoord).r;
        `
    }
    source += `
        vec4 rippleCoords = fract(v_TexCoordRipple);
        
        vec3 n1 = texture2D(g_Texture2, rippleCoords.xy).xyz * 2.0 - 1.0;
        vec3 n2 = texture2D(g_Texture2, rippleCoords.zw).xyz * 2.0 - 1.0;
        vec3 normal = normalize(vec3(n1.xy + n2.xy, n1.z));
        
        texCoord.xy += normal.xy * g_Strength * g_Strength * mask;

        gl_FragColor = texture2D(g_Texture0, texCoord);
    }
    `

    return source
}

export { getVertexShaderSource, getFragmentShaderSource }
