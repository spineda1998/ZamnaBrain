import React, { useEffect, useRef } from 'react';

interface WakahChanGalaxyProps {
  className?: string;
  speed?: number;
  interactive?: boolean;
}

/**
 * WakahChanGalaxy: Shader de fondo 100% Pixel Art con Dithering Ordenado (Bayer 4x4).
 * Cosmología maya: La Vía Láctea (Wakah Chan - Gran Serpiente Cósmica Celestial)
 * en tonalidades Jade Cósmico y Oro Sagrado ritual.
 */
export const WakahChanGalaxy: React.FC<WakahChanGalaxyProps> = ({
  className = '',
  speed = 1.0,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;

    // Try WebGL
    try {
      gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext);
    } catch {
      gl = null;
    }

    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      targetMouseX = (clientX - rect.left) / rect.width;
      targetMouseY = 1.0 - (clientY - rect.top) / rect.height; // WebGL Y is inverted
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    if (gl) {
      // Vertex Shader
      const vsSource = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      // Fragment Shader: 100% Pixel Art con Dithering Ordenado (Bayer 4x4 Matrix)
      // Paleta ceremonial Maya: Jade Cósmico, Oro Ritual y Obsidiana
      const fsSource = `
        precision highp float;
        varying vec2 vUv;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;

        // Tamaño de bloque para pixel art nítido (4.0 screen pixels per retro pixel)
        const float PIXEL_SIZE = 4.0;

        // Hash pseudoaleatorio
        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        // Ruido de gradiente
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

        // Fractal Brownian Motion para nebulosas cósmicas
        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 rot = mat2(0.877, 0.479, -0.479, 0.877);
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p = rot * p * 2.02 + vec2(31.41);
            a *= 0.5;
          }
          return v;
        }

        // Matriz de Dithering Ordenado Bayer 4x4 (valores normalizados centrados)
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
          return (v + 0.5) / 16.0 - 0.5; // [-0.46875, +0.46875]
        }

        // Paleta Sagrada Maya Cuantizada
        vec3 getObsidianVoid(float t) {
          if (t < 0.33) return vec3(0.04, 0.03, 0.05); // Obsidiana abisal
          if (t < 0.66) return vec3(0.08, 0.05, 0.12); // Púrpura cósmico profundo
          return vec3(0.06, 0.10, 0.09);               // Ecos de jade oscuro
        }

        vec3 getJadePalette(float v) {
          if (v < 0.18) return vec3(0.05, 0.18, 0.14); // Jade abisal
          if (v < 0.38) return vec3(0.10, 0.30, 0.22); // Jade profundo
          if (v < 0.58) return vec3(0.17, 0.48, 0.35); // Jade sagrado
          if (v < 0.78) return vec3(0.25, 0.68, 0.48); // Jade esmeralda brillante
          if (v < 0.92) return vec3(0.42, 0.88, 0.68); // Menta celestial
          return vec3(0.65, 0.95, 0.85);               // Jade estelar
        }

        vec3 getGoldPalette(float v) {
          if (v < 0.22) return vec3(0.42, 0.18, 0.06); // Ámbar ritual sombra
          if (v < 0.45) return vec3(0.68, 0.32, 0.04); // Oro bruñido
          if (v < 0.70) return vec3(0.88, 0.54, 0.12); // Oro maya
          if (v < 0.88) return vec3(0.98, 0.74, 0.30); // Oro solar Kinich Ahau
          return vec3(1.00, 0.94, 0.60);               // Núcleo blanco-dorado
        }

        void main() {
          // 1. CUANTIZACIÓN ESPACIAL EN CUADRÍCULA PIXEL ART (100% RETRO)
          vec2 retroPixelCoord = floor(gl_FragCoord.xy / PIXEL_SIZE);
          vec2 snappedFragCoord = (retroPixelCoord + 0.5) * PIXEL_SIZE;
          
          vec2 uv = (snappedFragCoord - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

          // Inclinación sutil con el mouse
          vec2 m = (u_mouse - 0.5) * 0.2;
          uv += m * 0.15;

          float t = u_time * 0.10;

          // Coordenadas polares para la Espiral Galáctica Maya (Wakah Chan)
          float r = length(uv);
          float angle = atan(uv.y, uv.x);

          // Espiral cósmica de la Vía Láctea / Árbol del Mundo
          float spiralAngle = angle + r * 3.6 - t * 0.38;
          vec2 spiralUv = vec2(cos(spiralAngle), sin(spiralAngle)) * r;

          // Capas de nebulosa procedural FBM
          float n1 = fbm(spiralUv * 2.6 + vec2(t * 0.2, -t * 0.15));
          float n2 = fbm(uv * 3.0 - vec2(t * 0.1, t * 0.08) + n1 * 1.3);
          float n3 = fbm(spiralUv * 5.2 + n2 * 0.7);

          // Intensidad de los brazos espirales de jade
          float spiralArmMask = pow(smoothstep(0.25, 0.75, n1 * 0.65 + n2 * 0.45), 1.6);
          float coreDist = length(uv);
          float coreGlow = exp(-coreDist * 3.0);

          // Componente continuo de Jade y Oro
          float rawJade = clamp((spiralArmMask * 1.1 + pow(n2, 1.8) * 0.7 + pow(n3, 2.5) * 0.5) * (1.1 - coreDist * 0.35), 0.0, 1.0);
          float rawGold = clamp(coreGlow * 1.3 + pow(n2 * n3, 2.2) * 1.4 + exp(-coreDist * 6.0) * 1.8, 0.0, 1.0);

          // 2. APLICAR DITHERING ORDENADO BAYER 4x4
          float dither = bayer4(retroPixelCoord);
          float ditherStrength = 0.20; // Dithering ordenado fino perfectamente calibrado

          float ditheredJade = clamp(rawJade + dither * ditherStrength, 0.0, 1.0);
          float ditheredGold = clamp(rawGold + dither * (ditherStrength * 1.1), 0.0, 1.0);

          // Fondo abisal con dithering sutil
          float bgDither = clamp((length(uv) * 0.4 + n1 * 0.2) + dither * 0.15, 0.0, 1.0);
          vec3 col = getObsidianVoid(bgDither);

          // Mezclar con Jade y Oro según los umbrales dithered
          if (ditheredJade > 0.15) {
            vec3 jadeColor = getJadePalette(ditheredJade);
            col = mix(col, jadeColor, smoothstep(0.15, 0.35, ditheredJade));
          }

          if (ditheredGold > 0.25) {
            vec3 goldColor = getGoldPalette(ditheredGold);
            col = mix(col, goldColor, smoothstep(0.25, 0.60, ditheredGold));
          }

          // 3. ESTRELLAS Y CONSTELACIONES PIXEL ART (Tzab-ek / Pléyades)
          float starSeed = hash(retroPixelCoord);
          if (starSeed > 0.982) {
            float twinkle = 0.5 + 0.5 * sin(u_time * (3.0 + starSeed * 10.0) + starSeed * 20.0);
            if (twinkle > 0.45) {
              if (starSeed > 0.993) {
                col = vec3(1.0, 0.98, 0.85); // Estrella oro blanco
              } else if (starSeed > 0.988) {
                col = vec3(0.55, 0.92, 0.75); // Estrella jade
              } else {
                col = vec3(0.98, 0.78, 0.35); // Estrella solar
              }
            }
          }

          // Viñeta retro suave en las esquinas
          float vignette = smoothstep(1.3, 0.4, length(uv));
          if (vignette < 0.85 + dither * 0.1) {
            col *= 0.85;
          }

          gl_FragColor = vec4(col, 1.0);
        }
      `;

      const createShader = (type: number, source: string) => {
        const shader = gl!.createShader(type);
        if (!shader) return null;
        gl!.shaderSource(shader, source);
        gl!.compileShader(shader);
        if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
          console.warn('Shader compile failed:', gl!.getShaderInfoLog(shader));
          gl!.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);

      if (vs && fs) {
        program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);

          if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.warn('Program link failed:', gl.getProgramInfoLog(program));
            program = null;
          }
        }
      }

      if (program) {
        gl.useProgram(program);

        // Quad positions
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = new Float32Array([
          -1, -1,
           1, -1,
          -1,  1,
          -1,  1,
           1, -1,
           1,  1,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const posAttr = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(posAttr);
        gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

        const resUniform = gl.getUniformLocation(program, 'u_resolution');
        const timeUniform = gl.getUniformLocation(program, 'u_time');
        const mouseUniform = gl.getUniformLocation(program, 'u_mouse');

        const startTime = performance.now();

        const renderGL = () => {
          if (!gl || !program) return;
          const now = performance.now();
          const elapsed = (now - startTime) * 0.001 * speed;

          // Smooth mouse lerp
          mouseX += (targetMouseX - mouseX) * 0.05;
          mouseY += (targetMouseY - mouseY) * 0.05;

          gl.useProgram(program);
          gl.uniform2f(resUniform, canvas.width, canvas.height);
          gl.uniform1f(timeUniform, elapsed);
          gl.uniform2f(mouseUniform, mouseX, mouseY);

          gl.drawArrays(gl.TRIANGLES, 0, 6);
          animationFrameId = requestAnimationFrame(renderGL);
        };

        renderGL();
        return () => {
          cancelAnimationFrame(animationFrameId);
          window.removeEventListener('resize', resize);
          window.removeEventListener('mousemove', handlePointerMove);
          window.removeEventListener('touchmove', handlePointerMove);
        };
      }
    }

    // 2D Canvas Fallback en Pixel Art con Dithering (si WebGL no estuviera disponible)
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const bayer4Matrix = [
      [0, 8, 2, 10],
      [12, 4, 14, 6],
      [3, 11, 1, 9],
      [15, 7, 13, 5],
    ];

    const render2D = () => {
      time += 0.015 * speed;
      const pixelSize = 6;
      const cols = Math.ceil(canvas.width / pixelSize);
      const rows = Math.ceil(canvas.height / pixelSize);

      ctx.fillStyle = '#0a080d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = cols / 2;
      const cy = rows / 2;

      for (let r = 0; r < rows; r += 2) {
        for (let c = 0; c < cols; c += 2) {
          const dx = (c - cx) / cx;
          const dy = (r - cy) / cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          const spiral = Math.sin(angle * 2 + dist * 5 - time * 2);
          const energy = Math.max(0, 1 - dist) * 0.7 + spiral * 0.3;

          const dither = (bayer4Matrix[r % 4][c % 4] / 16 - 0.5) * 0.3;
          const val = energy + dither;

          if (val > 0.65) {
            ctx.fillStyle = val > 0.8 ? '#fabc4c' : '#b45309';
            ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize * 2, pixelSize * 2);
          } else if (val > 0.35) {
            ctx.fillStyle = val > 0.5 ? '#2d6a4f' : '#1b4d3e';
            ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize * 2, pixelSize * 2);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render2D);
    };

    render2D();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full block pointer-events-none select-none ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};
