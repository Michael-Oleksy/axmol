#version 310 es
precision highp float;

// GLES2 not support const float, will trigger error:
// a vertex attribute index out of boundary is detected
#define thickness 0.15

layout(location = COLOR0) in vec4 v_color;
layout(location = TEXCOORD0) in vec2 v_texCoord;

layout(binding = 0) uniform sampler2D u_tex0;

layout(std140) uniform fs_ub {
    vec4 u_textColor;
    vec4 u_effectColor;
};

layout(location = SV_Target0) out vec4 FragColor;

void main()
{
    float dist = texture(u_tex0, v_texCoord).x;
#ifdef GLES2
    float smoothing = 0.04;
#else
    float smoothing = fwidth(dist);
#endif
    float pivot = abs(0.5 - thickness * u_effectColor.w);
    float alpha = smoothstep(pivot - smoothing, pivot + smoothing, dist);
    float border = smoothstep(0.5 - smoothing, 0.5 + smoothing, dist);
    FragColor = vec4( mix(u_effectColor.xyz, u_textColor.rgb, border), alpha);
}