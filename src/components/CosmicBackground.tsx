import React, { useEffect, useRef } from 'react';

export interface CosmicBackgroundProps {
  className?: string;
  speed?: number;
  interactive?: boolean;
  dimmed?: boolean;
  variant?: 'vibrant' | 'dimmed';
}

/**
 * CosmicBackground: Fondo espacial Maya interactivo impulsado por un Shader WebGL.
 * Renderiza una galaxia espiral con dithering ordenado (matriz Bayer 4x4) y cuantización 100% pixel art.
 * Paleta ceremonial: Azul Maya profundo, destellos de Jade sagrado, Oro cósmico y Negro abisal.
 * Soporta modo 'dimmed' para el Feed principal (atenuado y oscurecido para máxima legibilidad).
 */
export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  className = '',
  speed = 1.0,
  interactive = true,
  dimmed = false,
  variant,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDimmed = dimmed || variant === 'dimmed';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let isDisposed = false;

    // Obtener contexto WebGL
    try {
      gl =
        canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' }) ||
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
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
      targetMouseX = (clientX - rect.left) / Math.max(1, rect.width);
      targetMouseY = 1.0 - (clientY - rect.top) / Math.max(1, rect.height);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    if (gl) {
      // Shaders WebGL
      const vsSource = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      // Fragment Shader: Galaxia Espiral con Dithering Ordenado Bayer 4x4
      // Paleta: Azul Maya profundo + Jade sagrado + Oro cósmico + Negro abisal
      const fsSource = `
        precision highp float;
        varying vec2 vUv;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform float u_dimmed;

        // Tamaño de bloque para pixel art nítido (4.0 pixeles de pantalla por pixel retro)
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

        // Fractal Brownian Motion (FBM) para nebulosas galácticas
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

        // Matriz de Dithering Ordenado Bayer 4x4 (normalizada en rango [-0.5, 0.5])
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
          return (v + 0.5) / 16.0 - 0.5;
        }

        // PALETAS CEREMONIALES AZUL MAYA & JADE
        // 1. Vacío abisal cósmico
        vec3 getAbyssalVoid(float t) {
          if (t < 0.35) return vec3(0.015, 0.03, 0.06); // Negro azulado abisal
          if (t < 0.70) return vec3(0.025, 0.05, 0.11); // Azul noche cósmico
          return vec3(0.04, 0.08, 0.16);                // Azul maya umbrío
        }

        // 2. Capa Azul Maya profundo y celestial
        vec3 getMayaBluePalette(float v) {
          if (v < 0.20) return vec3(0.05, 0.12, 0.24); // Azul cobalto profundo
          if (v < 0.40) return vec3(0.08, 0.22, 0.42); // Azul maya clásico
          if (v < 0.60) return vec3(0.12, 0.35, 0.60); // Azul maya sagrado
          if (v < 0.80) return vec3(0.20, 0.50, 0.78); // Azul turquesa cósmico
          if (v < 0.92) return vec3(0.38, 0.72, 0.92); // Azul cian celestial
          return vec3(0.70, 0.90, 0.98);               // Brillo estelar maya
        }

        // 3. Destellos de Jade sagrado mesoamericano
        vec3 getJadePalette(float v) {
          if (v < 0.25) return vec3(0.03, 0.18, 0.14); // Jade abisal
          if (v < 0.50) return vec3(0.06, 0.32, 0.24); // Jade profundo
          if (v < 0.75) return vec3(0.12, 0.55, 0.38); // Jade esmeralda
          if (v < 0.90) return vec3(0.24, 0.78, 0.52); // Jade luminoso
          return vec3(0.55, 0.94, 0.76);               // Menta jade celestial
        }

        // 4. Oro cósmico y núcleo estelar
        vec3 getGoldPalette(float v) {
          if (v < 0.30) return vec3(0.40, 0.20, 0.05); // Ámbar ritual sombra
          if (v < 0.60) return vec3(0.75, 0.45, 0.10); // Oro maya
          if (v < 0.85) return vec3(0.95, 0.72, 0.25); // Oro solar Kinich Ahau
          return vec3(1.00, 0.95, 0.65);               // Núcleo blanco-dorado
        }

        void main() {
          // 1. CUANTIZACIÓN ESPACIAL EN CUADRÍCULA PIXEL ART RETRO
          vec2 retroPixelCoord = floor(gl_FragCoord.xy / PIXEL_SIZE);
          vec2 snappedFragCoord = (retroPixelCoord + 0.5) * PIXEL_SIZE;
          vec2 uv = (snappedFragCoord - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

          // Inclinación sutil con el ratón
          vec2 m = (u_mouse - 0.5) * 0.22;
          uv += m * 0.15;

          float t = u_time * 0.11;

          // Coordenadas polares para la Espiral Galáctica Maya
          float r = length(uv);
          float angle = atan(uv.y, uv.x);

          // Espiral cósmica
          float spiralAngle = angle + r * 3.5 - t * 0.35;
          vec2 spiralUv = vec2(cos(spiralAngle), sin(spiralAngle)) * r;

          // Capas procedurales de nebulosa FBM
          float n1 = fbm(spiralUv * 2.5 + vec2(t * 0.2, -t * 0.14));
          float n2 = fbm(uv * 2.8 - vec2(t * 0.09, t * 0.07) + n1 * 1.2);
          float n3 = fbm(spiralUv * 5.0 + n2 * 0.7);

          // Brazos espirales y núcleo cósmico
          float spiralArmMask = pow(smoothstep(0.24, 0.76, n1 * 0.62 + n2 * 0.48), 1.5);
          float coreDist = length(uv);
          float coreGlow = exp(-coreDist * 2.8);

          // Componentes continuos
          float rawBlue = clamp((spiralArmMask * 1.15 + pow(n2, 1.7) * 0.75 + pow(n3, 2.4) * 0.4) * (1.1 - coreDist * 0.3), 0.0, 1.0);
          float rawJade = clamp((pow(n1 * n2, 1.8) * 1.35 + pow(n3, 3.0) * 0.8) * (1.2 - coreDist * 0.4), 0.0, 1.0);
          float rawGold = clamp(coreGlow * 1.25 + pow(n2 * n3, 2.3) * 1.2 + exp(-coreDist * 6.5) * 1.6, 0.0, 1.0);

          // 2. DITHERING ORDENADO BAYER 4x4
          float dither = bayer4(retroPixelCoord);
          float ditherStrength = 0.22;

          float ditheredBlue = clamp(rawBlue + dither * ditherStrength, 0.0, 1.0);
          float ditheredJade = clamp(rawJade + dither * (ditherStrength * 1.05), 0.0, 1.0);
          float ditheredGold = clamp(rawGold + dither * (ditherStrength * 1.1), 0.0, 1.0);

          // Fondo abisal con dithering ordenado
          float bgDither = clamp((length(uv) * 0.42 + n1 * 0.2) + dither * 0.16, 0.0, 1.0);
          vec3 col = getAbyssalVoid(bgDither);

          // Mezclar Azul Maya
          if (ditheredBlue > 0.14) {
            vec3 blueColor = getMayaBluePalette(ditheredBlue);
            col = mix(col, blueColor, smoothstep(0.14, 0.38, ditheredBlue));
          }

          // Destellos de Jade sagrado
          if (ditheredJade > 0.22) {
            vec3 jadeColor = getJadePalette(ditheredJade);
            col = mix(col, jadeColor, smoothstep(0.22, 0.55, ditheredJade) * 0.85);
          }

          // Oro cósmico central y filamentos
          if (ditheredGold > 0.30) {
            vec3 goldColor = getGoldPalette(ditheredGold);
            col = mix(col, goldColor, smoothstep(0.30, 0.65, ditheredGold) * 0.90);
          }

          // 3. ESTRELLAS PIXEL ART (Tzab-ek / Pléyades mesoamericanas)
          float starSeed = hash(retroPixelCoord);
          float starThreshold = u_dimmed > 0.5 ? 0.990 : 0.984; // Menos estrellas si está atenuado
          if (starSeed > starThreshold) {
            float twinkle = 0.5 + 0.5 * sin(u_time * (3.0 + starSeed * 10.0) + starSeed * 25.0);
            if (twinkle > 0.42) {
              if (starSeed > 0.994) {
                col = vec3(0.95, 0.98, 1.0); // Estrella azul-blanco
              } else if (starSeed > 0.989) {
                col = vec3(0.45, 0.92, 0.75); // Estrella jade
              } else {
                col = vec3(0.98, 0.82, 0.40); // Estrella oro maya
              }
            }
          }

          // Viñeta retro suave en los extremos
          float vignette = smoothstep(1.35, 0.35, length(uv));
          if (vignette < 0.88 + dither * 0.08) {
            col *= 0.82;
          }

          // 4. ATENUACIÓN Y OSCURECIDO PARA FEED (PRIORIZA LEGIBILIDAD)
          if (u_dimmed > 0.5) {
            col = col * 0.42 + vec3(0.015, 0.025, 0.045) * 0.58;
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
          console.warn('CosmicBackground Shader compile failed:', gl!.getShaderInfoLog(shader));
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
            console.warn('CosmicBackground Program link failed:', gl.getProgramInfoLog(program));
            program = null;
          }
        }
      }

      if (program) {
        gl.useProgram(program);

        // Geometría del Quad de pantalla completa
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

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
        const timeLocation = gl.getUniformLocation(program, 'u_time');
        const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
        const dimmedLocation = gl.getUniformLocation(program, 'u_dimmed');

        const startTime = performance.now();

        const render = (now: number) => {
          if (isDisposed || !gl || !program) return;

          // Suavizado del ratón
          mouseX += (targetMouseX - mouseX) * 0.05;
          mouseY += (targetMouseY - mouseY) * 0.05;

          const elapsedTime = ((now - startTime) / 1000) * speed;

          gl.useProgram(program);
          gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
          gl.uniform1f(timeLocation, elapsedTime);
          gl.uniform2f(mouseLocation, mouseX, mouseY);
          gl.uniform1f(dimmedLocation, isDimmed ? 1.0 : 0.0);

          gl.drawArrays(gl.TRIANGLES, 0, 6);

          animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);
      }
    } else {
      // Fallback en Canvas 2D en caso de que WebGL no esté disponible
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let frame = 0;
        const render2D = () => {
          if (isDisposed) return;
          frame++;
          ctx.fillStyle = isDimmed ? '#050c18' : '#07162c';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Nebulosa simple simulada
          const gradient = ctx.createRadialGradient(
            canvas.width * 0.5,
            canvas.height * 0.5,
            10,
            canvas.width * 0.5,
            canvas.height * 0.5,
            canvas.width * 0.6
          );
          gradient.addColorStop(0, isDimmed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(21, 84, 140, 0.4)');
          gradient.addColorStop(0.5, isDimmed ? 'rgba(10, 37, 64, 0.2)' : 'rgba(15, 118, 110, 0.3)');
          gradient.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          animationFrameId = requestAnimationFrame(render2D);
        };
        animationFrameId = requestAnimationFrame(render2D);
      }
    }

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', resize);
      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, [speed, interactive, isDimmed]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none -z-10 ${className}`}
      style={{
        imageRendering: 'pixelated',
      }}
      aria-hidden="true"
    />
  );
};
