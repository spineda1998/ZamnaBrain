# Plan de Implementación: Re-hidratación de Feed & Minijuegos Tetris Maya y Memorama

Transformación y re-hidratación integral de la pantalla principal **Feed** con fidelidad pixel-art exacta a la imagen de referencia mesoamericana, junto con el desarrollo de dos nuevos minijuegos arcade completos e interactivos: **Tetris Maya** (bloques de piedra y retos numéricos) y **Memorama Maya** (emparejamiento de glifos vigesimales con números arábigos), integrados en la navegación y en los desafíos diarios.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Decisiones confirmadas a partir de las preferencias del usuario:
> - **Mecánica de Tetris Maya**: Tetris clásico arcade con bloques tallados de piedra maya (estelas, glifos tallados) y retos de bonificación numérica maya al limpiar múltiples líneas.
> - **Enfoque educativo de Memorama Maya**: Emparejamiento de cartas de glifos numéricos vigesimales (puntos, barras y caracoles/semillas 0–19) con sus equivalentes en números arábigos decimales.
> - **Puntos de acceso**: Ambos minijuegos estarán disponibles tanto en la pestaña dedicada de **Minijuegos** (con selector de modo Zuma / Tetris / Memorama) como activables directamente desde las tarjetas interactivas de **Desafíos Diarios** en la pantalla de **Feed**.

---

## 1. Overview & Core Concept

- **Feed Ceremonial Re-hidratado**: Una pantalla de resumen dinámica con estética de arcade retro maya (paleta obsidiana, jade, oro solar y rojo arcilla) que muestra:
  - Barra superior con saldo de Cacaos/Monedas (`⊚ 2,450`), Gemas de Jade/Diamantes (`💎 180`) y estado `ACTIVO`.
  - Tarjeta de expedición principal: **Senda Sagrada (Mundo 2: Selvas de Palenque)** con barra de progreso pixel art (`🚩 68% AVANCE`), preludio del próximo reto (*Templo de los Glifos Vigesimales*, costo `-15 ENERGÍA`) y botón de acción directa `CONTINUAR SENDA →`.
  - Panel de **Actividad Reciente** con historial de partidas, estrellas ganadas y racha activa de 7 días con bonificación solar.
  - Panel de **Desafíos Diarios** con temporizador en tiempo real (`RELOJ 08:42:15`), misiones interactivas (*Cálculo de Mazorcas*, *Reflejo Serpiente Zuma*, *Glifos Sonoros*) con botones ejecutables (`JUGAR`, `ENTRAR`, `ESTUDIAR`).
  - Barra inferior de cabina arcade (`🎮 CABINA: ITZAMNA #042 · ● CRÉDITO 1P DISPONIBLE`).
- **Tetris Maya**: Minijuego en Canvas/React con gravedad, rotación, caída rápida, tablero 10×20 de piedra maya, piezas talladas en piedra caliza con glifos incrustados, efectos de sonido sintetizados por Web Audio API y multiplicadores por combos de líneas vigesimales.
- **Memorama Maya**: Minijuego de memoria con tablero de cartas reversibles talladas en jade y arcilla, donde el jugador voltea cartas para emparejar glifos numéricos mayas (concha=0, puntos=1, barras=5) con sus valores arábigos (0 al 19), con medidor de turnos, racha de aciertos y tiempo.

---

## 2. User Experience & Visual Design

### Estética y Dirección Visual
- **Fidelidad al mock**: Marco de máquina recreativa mesoamericana con grecas rojas/doradas en bordes, tipografía dual `Press Start 2P` (títulos y métricas numéricas) y `Silkscreen` (subtítulos, descripciones y micro-etiquetas).
- **Paleta de Colores**:
  - Fondo cantera/obsidiana: `#141414` y `#1a1a1a`
  - Contenedores de arcilla y madera oscura: `#221c17`, `#261f1a`, `#2a2018`
  - Acentos de Oro Solar: `#d99b26`, `#fbbf24`, `#f59e0b`
  - Verde Jade de Bonificación: `#22c55e`, `#10b981`, `#15803d`
  - Rojo Templo Ceremonial: `#a62b2b`, `#881337`, `#7f1d1d`
  - Turquesa Cenote: `#06b6d4`, `#0891b2`
- **Componentes Pixel Art**:
  - Gráficos de textura cuadriculada para la ilustración de *Selvas de Palenque*.
  - Iconos pixelados dedicados para Balanza de Jade (⚖️), Medalla de Nodo (🎖️), Racha de Fuego (🔥), Cuadrícula de Mazorcas (⊞), Serpiente de Zuma (∞) y Oreja/Glifo Sonoro (👂).
  - Botones retro con borde biselado e interactividad de presión física (sombra desplazada al hacer click).

### Flujo de Navegación
1. **Feed (Pestaña Inicial)**: El jugador visualiza su estado general, racha y próximos retos. Al presionar `CONTINUAR SENDA →`, salta directamente a la aventura en Sendero Sagrado. Al presionar `JUGAR` en los Desafíos Diarios, lanza Tetris Maya, Zuma o Memorama.
2. **Selector de Minijuegos (Pestaña Minijuegos)**: Vista arcade estilo cabina con 3 gabinetes seleccionables:
   - *Zuma Serpiente Sagrada* (modo existente enriquecido).
   - *Tetris Maya* (bloques de piedra ancestrales).
   - *Memorama Vigesimal* (emparejamiento de glifos y números).
3. **Mecánica de Retorno y Recompensas**: Al terminar cualquier minijuego, se calculan estrellas y Cacaos/Jade, se muestra pantalla de victoria/derrota con confeti y se actualizan los contadores en tiempo real.

---

## 3. Key Product Decisions & Trade-Offs

- **Canvas 2D para Tetris Maya vs. DOM Grid**: Se empleará Canvas HTML5 nativo para el tablero de Tetris para garantizar una tasa de refresco constante a 60 FPS, detección precisa de colisiones, rotación fluida y renderizado de texturas de bloques de piedra sin sobrecargar el árbol DOM de React.
- **Card Flip CSS 3D para Memorama**: Se implementará con CSS `transform: rotateY(180deg)` y `backface-visibility: hidden` sobre componentes React, logrando una animación de volteo de tarjeta táctil y suave sin librerías externas pesadas.
- **Persistencia de Desafíos y Monedas en Memoria/API**: Las monedas y energía mostradas en el Feed se sincronizan con el backend REST (`/v1/me/progress`), manteniendo consistencia entre las partidas de los distintos modos de juego.

---

## 4. Technical Architecture & Data Strategy

### Diagrama de Arquitectura de Componentes

```
┌────────────────────────────────────────────────────────────────────────┐
│                               App.tsx                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                Header.tsx (Stats: Cacaos, Jade, Nick)            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                 Barra de Navegación (Tabs)                       │  │
│  │  [ Feed ] · [ Sendero ] · [ Minijuegos ] · [ Códice ] · [ Leader]│  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                  │                                     │
│      ┌───────────────────────────┼───────────────────────────┐         │
│      ▼                           ▼                           ▼         │
│ ┌───────────────┐      ┌────────────────────┐      ┌────────────────┐  │
│ │   FeedView    │      │  MinigamesArcade   │      │   SenderoMap   │  │
│ │ (Mockup 100%  │      │  ┌──────────────┐  │      │                │  │
│ │  fidelidad a  │      │  │ ZumaGame     │  │      └────────────────┘  │
│ │  la imagen)   │      │  ├──────────────┤  │                          │
│ │  - Selvas     │      │  │ MayaTetris   │  │                          │
│ │  - Actividad  │      │  ├──────────────┤  │                          │
│ │  - Desafíos   │      │  │ MayaMemorama │  │                          │
│ │  - Cabina 1P  │      │  └──────────────┘  │                          │
│ └───────────────┘      └────────────────────┘                          │
└────────────────────────────────────────────────────────────────────────┘
```

### Estructura de Nuevos Componentes
1. `src/components/FeedView.tsx`: Réplica exacta del diseño `Inicio - Feed & Desafíos Diarios Maya.png`, con soporte de navegación a los retos diarios y a la senda.
2. `src/components/games/MayaTetris.tsx`: Motor completo de Tetris en Canvas con 7 tetrominós tallados en piedra, cálculo de líneas, niveles de velocidad, puntuación y desafío numérico al limpiar 2+ líneas.
3. `src/components/games/MayaMemorama.tsx`: Juego de memoria con 16 cartas (8 parejas de glifos mayas 0-19 vs número arábigo), animaciones de volteo, contador de movimientos y cronómetro.
4. `src/components/games/MinigamesHub.tsx`: Cabina de selección arcade para alternar entre Zuma, Tetris Maya y Memorama.

---

## 5. Plan de Ejecución Paso a Paso

1. **Creación del componente FeedView**:
   - Construir la estructura completa de tarjetas, cabecera de recursos (`⊚ 2,450`, `💎 180`), estado `ACTIVO`.
   - Implementar el widget de *Mundo 2: Selvas de Palenque* con arte pixel de estela maya y barra de avance 68%.
   - Implementar la sección de *Actividad Reciente* (Balanza de Jade, Nodo 03 superado, Racha de 7 días).
   - Implementar la sección de *Desafíos Diarios* (*Cálculo de Mazorcas*, *Reflejo Serpiente Zuma*, *Glifos Sonoros*) con listeners de juego interactivos.
   - Implementar el pie de máquina recreativa (*CABINA: ITZAMNA #042*).
2. **Desarrollo del Minijuego Tetris Maya**:
   - Tablero Canvas con estética de templo maya.
   - Rotación y movimiento con teclado y botones virtuales para dispositivos táctiles.
   - Integración de reto matemático maya de bonificación solar tras racha de líneas.
3. **Desarrollo del Minijuego Memorama Maya**:
   - Sistema de generación de parejas de glifos vigesimales (0 al 19) y números arábigos.
   - Volteo de cartas con micro-interacciones, efectos de acierto y victoria con entrega de Cacaos/Jade.
4. **Integración en App y Header**:
   - Añadir la pestaña **Feed** como vista por defecto al iniciar sesión.
   - Actualizar la pestaña **Minijuegos** para presentar la marquesina de selección (Zuma, Tetris, Memorama).
   - Conectar los botones del Feed (`CONTINUAR SENDA`, `JUGAR`, `ENTRAR`, `ESTUDIAR`) para activar directamente el juego o vista correspondiente.
5. **Verificación y Compilación**:
   - Compilación completa (`compile_applet`) y verificación de tipos (`lint_applet`).
