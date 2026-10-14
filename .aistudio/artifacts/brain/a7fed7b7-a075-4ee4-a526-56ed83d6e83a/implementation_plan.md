# Plan de Implementación: CosmicBackground Shader WebGL, Integración en Login/Feed y Mascota Ceremonial

Este plan describe la arquitectura y modificaciones necesarias para implementar el nuevo componente `CosmicBackground.tsx`, configurar la paleta solicitada (Azul Maya profundo, destellos Jade y Negro Abisal), adaptar su presentación atenuada en el Feed, y sincronizar la mascota de referencia para la pantalla de inicio y el spinner animado.

---

## 1. Nuevo Componente: `src/components/CosmicBackground.tsx`
- **Tecnología**: WebGL Fragment Shader nativo sobre elemento `<canvas>` con fallback a Canvas 2D idéntico.
- **Renderizado Pixel Art & Dithering Ordenado**:
  - Cuantización espacial nítida (`imageRendering: 'pixelated'`, tamaño de pixel virtual retro ajustable).
  - Algoritmo de Dithering Ordenado mediante matriz Bayer 4x4 / 8x8 normalizada y calibrada para transiciones suaves de estilo retro 16-bit.
- **Paleta Ceremonial Seleccionada**:
  - **Negro Abisal de fondo**: `#020408`, `#05080f`, `#09111e`.
  - **Azul Maya Profundo (Brazos espirales y nebulosa central)**: `#0d2744`, `#13406b`, `#1d659e`, `#29b6f6`.
  - **Destellos de Jade Cósmico**: `#064e3b`, `#059669`, `#10b981`, `#34d399`.
  - **Centellas estelares**: Puntos dorados y menta (`#fabc4c`, `#a7f3d0`) simulando constelaciones mayas (*Tzab-ek*).
- **Parámetros configurables (`CosmicBackgroundProps`)**:
  - `variant: 'login' | 'feed' | 'subtle'`:
    - En `'login'`: intensidad completa y contraste vibrante detrás de la tablilla de arcilla.
    - En `'feed'`: renderizado oscurecido y atenuado (baja saturación/brillo) con superposición oscura semitransparente para preservar la máxima legibilidad de los textos y retos semanales.
  - `speed`: factor de velocidad de rotación cósmica (por defecto 0.8–1.0).
  - `interactive`: perturbación reactiva al cursor/tacto en coordenadas UV.
  - `dimmed`: flag para atenuación rápida adicional.

---

## 2. Integración en Pantalla de Login (`src/components/LoginModal.tsx`)
- Sustituir `WakahChanGalaxy` por `CosmicBackground` en modo `variant="login"`.
- Mantener la tablilla de arcilla roja cinabrio (`#a62b2bff`), las grecas mayas doradas y el encabezado arcade `ITZAMNA ACADEMIA` con drop-shadow 3D.
- Posicionar la mascota ceremonial centrada sobre la tablilla con animación de flotación limpia sin auras circulares.

---

## 3. Integración en el Feed Principal (`src/components/FeedView.tsx` y `src/App.tsx`)
- Integrar `CosmicBackground` como capa de fondo de la aplicación en la pestaña de inicio/feed con `variant="feed"`.
- Configurar el shader con opacidad y luminosidad reducidas, añadiendo una sutil capa de absorción de luz para que las tarjetas de retos, misiones y estadísticas de alumno mantengan un contraste AAA óptimo.
- Asegurar que no interfiera con los eventos de scroll ni la barra de navegación inferior `BottomNav`.

---

## 4. Mascota de Referencia (`DeityAxolotl.tsx`) y Spinner (`PixelArtSpinner.tsx`)
- **Mascota Ceremonial en Login**:
  - Ajustar la silueta y paleta del sprite pixel art sagrado según la referencia ceremonial: cerebro sagrado místico con plumas de quetzal, diadema dorada con gema de jade y expresión arcade estilizada.
  - Garantizar fondo 100% transparente sin orbes, discos ni círculos decorativos exteriores.
  - Mantener la animación de flotación levitante fluida mediante keyframes CSS `float`.
- **Spinner de Carga (`PixelArtSpinner.tsx`)**:
  - Sincronizar el sprite con la versión miniatura idéntica de la mascota ceremonial.
  - Conservar la animación sutil de levitación y respiración de píxeles (`spinnerFloat`) tanto en el botón de combate como en los estados de transición.

---

## 5. Verificación y Validación
- Compilar la aplicación mediante `compile_applet` para garantizar que no existan errores de TypeScript ni sintaxis.
- Verificar el comportamiento responsivo del canvas en pantallas móviles y desktop.
- Confirmar el desempeño fluido a 60 FPS del shader WebGL con degradación elegante a Canvas 2D.
