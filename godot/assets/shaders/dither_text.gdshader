shader_type canvas_item;
render_mode unshaded;

/**
 * dither_text.gdshader
 * Shader de semitono Bayer 4x4 de 4 colores SNES para el titulo "ITZAMNA ACADEMIA".
 * Reproduce exactamente el degradado punteado de 16 bits sin filtros continuos.
 */

uniform int color_scheme : hint_range(0, 1) = 0; // 0: Oro/Ambar/Cinabrio (ITZAMNA), 1: Azul Maya (ACADEMIA)
uniform float outline_size : hint_range(0.0, 4.0) = 1.0;
uniform vec4 outline_color : source_color = vec4(0.0, 0.0, 0.0, 1.0);
uniform vec4 shadow_color : source_color = vec4(0.23, 0.03, 0.03, 1.0);
uniform vec2 shadow_offset = vec2(2.0, 2.0);

float bayer4(vec2 p) {
    vec2 b = mod(floor(p), 4.0);
    float v = 0.0;
    if (b.y < 0.5) {
        if (b.x < 0.5) v = 0.0;
        else if (b.x < 1.5) v = 8.0;
        else if (b.x < 2.5) v = 2.0;
        else v = 10.0;
    } else if (b.y < 1.5) {
        if (b.x < 0.5) v = 12.0;
        else if (b.x < 1.5) v = 4.0;
        else if (b.x < 2.5) v = 14.0;
        else v = 6.0;
    } else if (b.y < 2.5) {
        if (b.x < 0.5) v = 3.0;
        else if (b.x < 1.5) v = 11.0;
        else if (b.x < 2.5) v = 1.0;
        else v = 9.0;
    } else {
        if (b.x < 0.5) v = 15.0;
        else if (b.x < 1.5) v = 7.0;
        else if (b.x < 2.5) v = 13.0;
        else v = 5.0;
    }
    return (v + 0.5) / 16.0;
}

vec3 get_gold_4_color(float t, float bayer) {
    // 4 colores: #ffe5a3, #fabc4c, #d97706, #a62b2b
    float stepped = clamp(t + (bayer - 0.5) * 0.35, 0.0, 1.0);
    if (stepped < 0.28) return vec3(1.000, 0.898, 0.639); // #ffe5a3
    if (stepped < 0.58) return vec3(0.980, 0.737, 0.298); // #fabc4c
    if (stepped < 0.82) return vec3(0.851, 0.467, 0.024); // #d97706
    return vec3(0.651, 0.169, 0.169);                     // #a62b2b
}

vec3 get_blue_4_color(float t, float bayer) {
    // 4 colores Azul Maya: #cffafe, #73c2fb, #0284c7, #083344
    float stepped = clamp(t + (bayer - 0.5) * 0.35, 0.0, 1.0);
    if (stepped < 0.28) return vec3(0.812, 0.980, 0.996); // #cffafe
    if (stepped < 0.58) return vec3(0.451, 0.761, 0.984); // #73c2fb
    if (stepped < 0.82) return vec3(0.008, 0.518, 0.780); // #0284c7
    return vec3(0.031, 0.200, 0.267);                     // #083344
}

void fragment() {
    vec4 base_color = texture(TEXTURE, UV);
    if (base_color.a < 0.1) {
        discard;
    }

    vec2 pixel_coord = floor(FRAGCOORD.xy);
    float bayer = bayer4(pixel_coord);
    float vertical_t = UV.y;

    vec3 fill_color;
    if (color_scheme == 0) {
        fill_color = get_gold_4_color(vertical_t, bayer);
    } else {
        fill_color = get_blue_4_color(vertical_t, bayer);
    }

    COLOR = vec4(fill_color, base_color.a);
}
