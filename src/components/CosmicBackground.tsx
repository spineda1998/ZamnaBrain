import React, { useEffect, useRef } from 'react';

export interface CosmicBackgroundProps {
  className?: string;
  speed?: number;
  interactive?: boolean;
  dimmed?: boolean;
  variant?: 'vibrant' | 'dimmed';
}

/**
 * CosmicBackground: Fondo espacial Maya con shader WebGL.
 * - Paleta oficial: #9E2A2B (Rojo Carmesí), #2A7B4C (Verde Jade), #FFFDF2 (Blanco Crema).
 * - Galaxia espiral cósmica con la Pirámide Maya en medio.
 * - Sin estrellas ni elementos satelitales dispersos.
 * - Dithering ordenado Bayer 4x4 estilo hardware retro SNES.
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
      // Vertex Shader
      const vsSource = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      // Fragment Shader: Galaxia Espiral con Pirámide Maya Central
      // Paleta: #9E2A2B (Rojo Carmesí), #2A7B4C (Verde Jade), #FFFDF2 (Blanco Crema)
      const fsSource = `
        precision highp float;
        varying vec2 vUv;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform float u_dimmed;

        const float PIXEL_SIZE = 4.0;

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
          mat2 rot = mat2(0.877, 0.479, -0.479, 0.877);
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p = rot * p * 2.02 + vec2(31.41);
            a *= 0.5;
          }
          return v;
        }

        // Matriz Bayer 4x4
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

        // Cuantización a 15-bit RGB555 hardware DAC
        vec3 quantizeRGB555(vec3 c) {
          return floor(clamp(c, 0.0, 1.0) * 31.0 + 0.5) / 31.0;
        }

        // Paleta oficial 16 niveles indexados:
        // Tonos base: Fondo abisal (#100506) -> Rojo Carmesí (#9E2A2B) -> Verde Jade (#2A7B4C) -> Crema (#FFFDF2)
        vec3 getTriadPalette(float level, float dimmed) {
          float idx = floor(clamp(level, 0.0, 1.0) * 15.0 + 0.5);
          vec3 c;

          // 0..3: Vacío cósmico y rojos oscuros
          if (idx <= 0.0) c = vec3(0.063, 0.020, 0.024);      // #100506 Abisal Carmesí
          else if (idx <= 1.0) c = vec3(0.125, 0.035, 0.043); // #20090b Carmesí muy oscuro
          else if (idx <= 2.0) c = vec3(0.247, 0.067, 0.078); // #3f1114 Carmesí profundo
          else if (idx <= 3.0) c = vec3(0.388, 0.102, 0.114); // #631a1d Carmesí medio
          // 4..7: Transición a Rojo Carmesí Canónico #9E2A2B (0.620, 0.165, 0.169)
          else if (idx <= 4.0) c = vec3(0.510, 0.137, 0.149); // #822326 Carmesí claro
          else if (idx <= 5.0) c = vec3(0.620, 0.165, 0.169); // #9E2A2B ROJO CARMESÍ OFICIAL
          else if (idx <= 6.0) c = vec3(0.482, 0.267, 0.208); // #7b4435 Transición Carmesí-Jade
          else if (idx <= 7.0) c = vec3(0.322, 0.376, 0.251); // #526040 Transición intermedia
          // 8..11: Verde Jade Canónico #2A7B4C (0.165, 0.482, 0.298)
          else if (idx <= 8.0) c = vec3(0.165, 0.482, 0.298); // #2A7B4C VERDE JADE OFICIAL
          else if (idx <= 9.0) c = vec3(0.235, 0.596, 0.373); // #3c985f Jade resplandeciente
          else if (idx <= 10.0) c = vec3(0.345, 0.718, 0.478);// #58b77a Jade luminoso
          else if (idx <= 11.0) c = vec3(0.533, 0.816, 0.635);// #88d0a2 Jade pálido
          // 12..15: Ascenso a Crema Sagrado #FFFDF2 (1.0, 0.992, 0.949)
          else if (idx <= 12.0) c = vec3(0.780, 0.902, 0.804);// #c7e6cd Brillo crema-jade
          else if (idx <= 13.0) c = vec3(0.922, 0.949, 0.867);// #ebf2dd Resplandor celestial
          else if (idx <= 14.0) c = vec3(0.980, 0.973, 0.910);// #faf8e8 Luz solar
          else c = vec3(1.000, 0.992, 0.949);                 // #FFFDF2 BLANCO CREMA OFICIAL

          if (dimmed > 0.5) {
            c = mix(c, vec3(0.063, 0.020, 0.024), 0.58);
          }
          return quantizeRGB555(c);
        }

        // Pirámide Maya Escalonada (Templo de Kukulcán) en el centro de la pantalla
        float getCenterPyramid(vec2 p) {
          // Escalar y centrar
          vec2 lp = p * 6.5;
          float y = lp.y + 0.65;
          float x = abs(lp.x);
          if (y < 0.0 || y > 1.85 || x > 1.85) return 0.0;

          // Escalones / niveles de la pirámide
          float tier = floor(y * 2.8);
          float maxW = 1.70 - tier * 0.32;
          if (x > maxW) return 0.0;

          // Escalinata central sagrada
          float stair = (x < 0.22) ? 0.35 : 0.0;
          // Templo en la cúspide
          float temple = (tier >= 4.0) ? 0.40 : 0.0;
          // Bordes de los peldaños
          float edge = (fract(y * 2.8) > 0.68) ? 0.25 : 0.0;

          return clamp(0.65 + stair + temple + edge, 0.0, 1.0);
        }

        void main() {
          vec2 retroPixelCoord = floor(gl_FragCoord.xy / PIXEL_SIZE);
          vec2 snappedFragCoord = (retroPixelCoord + 0.5) * PIXEL_SIZE;
          vec2 uv = (snappedFragCoord - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

          // Movimiento de mouse interactivo suave
          vec2 m = (u_mouse - 0.5) * 0.12;
          uv += m * 0.08;

          float t = u_time * 0.12;

          // 1. GALAXIA ESPIRAL
          vec2 compactUv = uv * 2.4;
          float r = length(compactUv);
          float angle = atan(compactUv.y, compactUv.x);

          float spiralAngle = angle + r * 3.4 - t * 0.32;
          vec2 spiralCoord = vec2(cos(spiralAngle), sin(spiralAngle)) * r;

          float n1 = fbm(spiralCoord * 2.6 + vec2(t * 0.20, -t * 0.12));
          float n2 = fbm(compactUv * 3.0 - vec2(t * 0.08, t * 0.06) + n1 * 1.0);
          float n3 = fbm(spiralCoord * 5.0 + n2 * 0.5);

          float armCore = cos(spiralAngle * 2.0);
          float armStrength = clamp((armCore * 0.5 + 0.5) * n1 * 1.2 + pow(n2, 1.8) * 0.7 + pow(n3, 2.0) * 0.35, 0.0, 1.0);

          float coreGlow = clamp(1.0 - r * 2.5, 0.0, 1.0);
          float coreIntense = clamp(1.0 - r * 4.8, 0.0, 1.0);
          float galaxyFalloff = clamp(1.0 - r * 0.95, 0.0, 1.0);

          float centralGalaxy = (armStrength * 0.75 + coreGlow * 0.85 + coreIntense * 0.60 + n2 * 0.18) * galaxyFalloff;

          // 2. PIRÁMIDE MAYA ESCALONADA EN EL CENTRO EXACTO DE LA GALAXIA
          float pyramidIntensity = getCenterPyramid(uv);

          // 3. COMBINAR GALAXIA + PIRÁMIDE CENTRAL
          float rawIntensity = clamp(centralGalaxy * 0.75 + pyramidIntensity * 0.95, 0.0, 1.0);

          // 4. MATRIZ DE DITHERING ORDENADO BAYER 4x4 SNES
          float bayerVal = bayer4(retroPixelCoord);
          float ditherOffset = (bayerVal - 0.5) * 0.28;
          float steppedLevel = clamp(rawIntensity + ditherOffset, 0.0, 1.0);

          // 5. PALETA OFICIAL #9E2A2B / #2A7B4C / #FFFDF2 (SIN ESTRELLAS)
          vec3 col = getTriadPalette(steppedLevel, u_dimmed);

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
            console.warn('Program link failed:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            program = null;
          }
        }
      }

      if (program) {
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const posAttr = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(posAttr);
        gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(program, 'u_resolution');
        const uTime = gl.getUniformLocation(program, 'u_time');
        const uMouse = gl.getUniformLocation(program, 'u_mouse');
        const uDimmed = gl.getUniformLocation(program, 'u_dimmed');

        let startTime = performance.now();

        const render = () => {
          if (isDisposed) return;

          mouseX += (targetMouseX - mouseX) * 0.05;
          mouseY += (targetMouseY - mouseY) * 0.05;

          const now = performance.now();
          const elapsed = ((now - startTime) / 1000) * speed;

          gl!.useProgram(program!);
          gl!.uniform2f(uRes, canvas.width, canvas.height);
          gl!.uniform1f(uTime, elapsed);
          gl!.uniform2f(uMouse, mouseX, mouseY);
          gl!.uniform1f(uDimmed, isDimmed ? 1.0 : 0.0);

          gl!.drawArrays(gl!.TRIANGLES, 0, 6);

          animationFrameId = requestAnimationFrame(render);
        };

        render();
      }
    } else {
      // 2D Canvas Fallback si WebGL no está disponible
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let startTime = performance.now();
        const render2D = () => {
          if (isDisposed) return;
          const w = canvas.width;
          const h = canvas.height;
          const t = ((performance.now() - startTime) / 1000) * speed;

          // Fondo oscuro carmesí
          ctx.fillStyle = '#100506';
          ctx.fillRect(0, 0, w, h);

          // Galaxia central
          const cx = w / 2;
          const cy = h / 2;
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.min(w, h) * 0.45);
          grad.addColorStop(0, '#FFFDF2');
          grad.addColorStop(0.3, '#2A7B4C');
          grad.addColorStop(0.7, '#9E2A2B');
          grad.addColorStop(1, '#100506');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.min(w, h) * 0.45, 0, Math.PI * 2);
          ctx.fill();

          // Pirámide central en 2D pixel art
          ctx.fillStyle = '#9E2A2B';
          ctx.fillRect(cx - 30, cy + 10, 60, 20);
          ctx.fillRect(cx - 20, cy - 5, 40, 15);
          ctx.fillRect(cx - 10, cy - 18, 20, 13);
          ctx.fillStyle = '#FFFDF2';
          ctx.fillRect(cx - 5, cy - 25, 10, 7);

          animationFrameId = requestAnimationFrame(render2D);
        };
        render2D();
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
      className={`fixed inset-0 w-full h-full pointer-events-none -z-10 [image-rendering:pixelated] ${className}`}
      style={{
        imageRendering: 'pixelated',
        backgroundColor: '#100506',
      }}
    />
  );
};
