shader_type canvas_item;
render_mode unshaded;

/**
 * cosmic_bg.gdshader
 * Port oficial para Godot 4 del fondo espacial ceremonial Maya.
 * - Simula el hardware del PPU de Super Nintendo (SNES).
 * - Matriz ordenada de semitono Bayer 4x4.
 * - Paleta indexada de 256 colores ceremoniales Modo 3/4.
 * - Cuantizacion RGB555 a 15 bits reales (32 pasos discretos por canal).
 * - Elementos celestiales procedurales: Piramides escalonadas, Mascaras de Jade y Galaxias.
 */

uniform float speed : hint_range(0.1, 3.0) = 0.8;
uniform bool is_dimmed = false;
uniform vec2 touch_offset = vec2(0.0, 0.0);
uniform float pixel_size : hint_range(1.0, 8.0) = 3.0;

// Generador de ruido hash para estrellas
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(vec2(0.877, 0.479), vec2(-0.479, 0.877));
    for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = rot * p * 2.02 + vec2(31.41, 31.41);
        a *= 0.5;
    }
    return v;
}

// Matriz de Dithering Ordenado Bayer 4x4
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

// Cuantizacion DAC hardware SNES PPU RGB555 (15 bits: 5 bits por canal = 32 niveles)
vec3 quantize_rgb555(vec3 c) {
    return floor(clamp(c, vec3(0.0), vec3(1.0)) * 31.0 + vec3(0.5)) / 31.0;
}

// Paleta indexada de 256 colores SNES (Modo 3/4) con tonalidades Azul Maya #73C2FB
vec3 get_snes_256_palette(float level, bool dimmed) {
    float idx = floor(clamp(level, 0.0, 1.0) * 15.0 + 0.5);
    vec3 c;
    if (idx <= 0.0) c = vec3(0.016, 0.035, 0.078);      // #040914 Negro abisal
    else if (idx <= 1.0) c = vec3(0.031, 0.078, 0.157); // #081428 Azul profundo 1
    else if (idx <= 2.0) c = vec3(0.047, 0.125, 0.235); // #0c203c Azul profundo 2
    else if (idx <= 3.0) c = vec3(0.063, 0.173, 0.314); // #102c50 Azul noche
    else if (idx <= 4.0) c = vec3(0.078, 0.220, 0.392); // #143864 Azul cenote
    else if (idx <= 5.0) c = vec3(0.098, 0.282, 0.490); // #19487d Turquesa marino
    else if (idx <= 6.0) c = vec3(0.141, 0.361, 0.588); // #245c96 Azul indigo maya
    else if (idx <= 7.0) c = vec3(0.204, 0.455, 0.706); // #3474b4 Jade-azul intermedio
    else if (idx <= 8.0) c = vec3(0.298, 0.565, 0.824); // #4c90d2 Azul cobalto cielo
    else if (idx <= 9.0) c = vec3(0.451, 0.761, 0.984); // #73C2FB AZUL MAYA CANONICO
    else if (idx <= 10.0) c = vec3(0.545, 0.816, 0.988);// #8bd0fc Resplandor sagrado
    else if (idx <= 11.0) c = vec3(0.655, 0.875, 1.000);// #a7dfff Cian celestial
    else if (idx <= 12.0) c = vec3(0.769, 0.925, 1.000);// #c4ecff Brillo astral
    else if (idx <= 13.0) c = vec3(0.863, 0.961, 1.000);// #dcf5ff Luz estelar
    else if (idx <= 14.0) c = vec3(0.941, 0.984, 1.000);// #f0fbff Nucleo cosmico
    else c = vec3(1.000, 1.000, 1.000);                 // #ffffff Destello puro

    if (dimmed) {
        c = mix(c, vec3(0.016, 0.035, 0.078), 0.58);
    }
    return quantize_rgb555(c);
}

// 1. Mini Galaxia Satelite
float get_mini_galaxy(vec2 p, float rot_speed, float time) {
    float r = length(p);
    if (r > 0.18) return 0.0;
    float angle = atan(p.y, p.x) + r * 18.0 - time * rot_speed;
    float arms = sin(angle * 2.0) * 0.5 + 0.5;
    float core = clamp(1.0 - r * 12.0, 0.0, 1.0);
    float disk = clamp(1.0 - r * 5.8, 0.0, 1.0);
    return clamp(arms * disk * 0.85 + core * 1.15, 0.0, 1.0);
}

// 2. Piramide Maya Escalonada
float get_pyramid(vec2 p) {
    vec2 lp = p * 10.0;
    float y = lp.y + 1.2;
    float x = abs(lp.x);
    if (y < 0.0 || y > 2.2 || x > 2.2) return 0.0;
    float tier = floor(y * 2.6);
    float max_w = 2.0 - tier * 0.35;
    if (x > max_w) return 0.0;
    float stair = (x < 0.30) ? 0.35 : 0.0;
    float temple = (tier >= 5.0) ? 0.30 : 0.0;
    float edge = (fract(y * 2.6) > 0.70) ? 0.25 : 0.0;
    return clamp(0.70 + stair + temple + edge, 0.0, 1.0);
}

// 3. Mascara Sagrada de Jade
float get_jade_mask(vec2 p) {
    vec2 lp = p * 11.0;
    float r = length(vec2(lp.x * 1.2, lp.y));
    if (r > 1.6) return 0.0;
    float x = abs(lp.x);
    float y = lp.y;
    if (x > 0.32 && x < 0.72 && abs(y - 0.18) < 0.20) return 0.10;
    if (x < 0.22 && y > -0.25 && y < 0.25) return 0.95;
    if (x < 0.48 && abs(y + 0.45) < 0.16) return 0.20;
    if (y > 0.85 && x < 1.1) {
        return (mod(floor(x * 3.5), 2.0) == 0.0) ? 0.95 : 0.60;
    }
    if (x > 0.90 && abs(y) < 0.55) return 0.90;
    return clamp(1.0 - r * 0.40, 0.0, 1.0);
}

void fragment() {
    // Coordenadas cuadradas pixeladas
    vec2 screen_coord = FRAGCOORD.xy;
    vec2 retro_coord = floor(screen_coord / pixel_size);
    vec2 snapped_coord = (retro_coord + vec2(0.5)) * pixel_size;
    vec2 res = 1.0 / SCREEN_PIXEL_SIZE;
    vec2 uv = (snapped_coord - 0.5 * res) / min(res.x, res.y);

    uv += touch_offset * 0.12;

    float t = TIME * 0.12 * speed;

    // Galaxia central
    vec2 compact_uv = uv * 2.60;
    float r = length(compact_uv);
    float angle = atan(compact_uv.y, compact_uv.x);
    float spiral_angle = angle + r * 3.8 - t * 0.36;
    vec2 spiral_coord = vec2(cos(spiral_angle), sin(spiral_angle)) * r;

    float n1 = fbm(spiral_coord * 2.8 + vec2(t * 0.25, -t * 0.15));
    float n2 = fbm(compact_uv * 3.4 - vec2(t * 0.10, t * 0.08) + vec2(n1 * 1.1));
    float n3 = fbm(spiral_coord * 5.5 + vec2(n2 * 0.6));

    float arm_core = cos(spiral_angle * 2.0);
    float arm_strength = clamp((arm_core * 0.5 + 0.5) * n1 * 1.25 + pow(n2, 1.8) * 0.75 + pow(n3, 2.2) * 0.4, 0.0, 1.0);
    float core_glow = clamp(1.0 - r * 2.8, 0.0, 1.0);
    float core_intense = clamp(1.0 - r * 5.5, 0.0, 1.0);
    float galaxy_falloff = clamp(1.0 - r * 0.98, 0.0, 1.0);

    float central_galaxy = (arm_strength * 0.75 + core_glow * 0.95 + core_intense * 0.65 + n2 * 0.20) * galaxy_falloff;

    // Elementos celestiales orbitando
    vec2 gal_pos1 = uv - vec2(-0.52 + sin(t * 0.40) * 0.12, 0.36 + cos(t * 0.32) * 0.10);
    float el_mini_gal1 = get_mini_galaxy(gal_pos1, 1.4, t);

    vec2 pyr_pos = uv - vec2(-0.50 + cos(t * 0.26 + 1.2) * 0.14, -0.34 + sin(t * 0.30 + 0.8) * 0.10);
    float el_pyramid = get_pyramid(pyr_pos);

    vec2 mask_pos = uv - vec2(0.52 + sin(t * 0.28 + 2.5) * 0.12, 0.38 + cos(t * 0.24 + 1.9) * 0.11);
    float el_jade_mask = get_jade_mask(mask_pos);

    vec2 gal_pos2 = uv - vec2(0.50 + cos(t * 0.35 + 3.8) * 0.14, -0.36 + sin(t * 0.27 + 4.2) * 0.10);
    float el_mini_gal2 = get_mini_galaxy(gal_pos2, -1.2, t);

    float floating_elements = max(max(el_mini_gal1, el_pyramid), max(el_jade_mask, el_mini_gal2));

    // Dithering Bayer 4x4
    float raw_intensity = clamp(central_galaxy + floating_elements * 0.88, 0.0, 1.0);
    float bayer_val = bayer4(retro_coord);
    float dither_offset = (bayer_val - 0.5) * 0.28;
    float stepped_level = clamp(raw_intensity + dither_offset, 0.0, 1.0);

    // Paleta 256 colores SNES
    vec3 col = get_snes_256_palette(stepped_level, is_dimmed);

    // Estrellas Tzab-ek
    float star_seed = hash(retro_coord);
    float star_threshold = is_dimmed ? 0.993 : 0.988;
    if (star_seed > star_threshold) {
        float twinkle = sin(TIME * 3.8 + star_seed * 50.0);
        if (twinkle > 0.25) {
            vec3 star_col = (star_seed > 0.996) ? vec3(0.98, 0.99, 1.0) : vec3(0.451, 0.761, 0.984);
            col = quantize_rgb555(star_col);
        }
    }

    COLOR = vec4(col, 1.0);
}
