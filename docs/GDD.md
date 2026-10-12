# GDD — ZumaBrain

**Versión:** 0.1 (borrador inicial)
**Fecha:** 2026-10-09
**Estado:** En diseño

---

## 1. Concepto

**ZumaBrain** es un videojuego-«app mobile» híbrido de aprendizaje (edutainment)
con temática **Mesoamericana (Maya + pixel-art retro)**. Combina la mecánica de
disparo clásica tipo *Zuma* con retos educativos, presentados como un recorrido
ritual en el **Sendero Sagrado**.

Referencia aspiracional: *Big Brain Academy* — un "gimnasio mental" para
jugadores de todas las edades, con sistema de roles **Profesor / Alumno**,
progresión por nodos, recompensas y tablas de clasificación (leaderboard).

### Elevator pitch
> Convierte tu cerebro en un templo. Responde retos de aritmética vigesimal,
> geometría sagrada y descifrado de glifos para avanzar por el Sendero Sagrado,
> derrota a los Guardianes mentales y conviértete en Gran Ajau.

---

## 2. Plataformas y distribución

| Plataforma | Formato | Notas |
|---|---|---|
| iOS | App Store | Requiere cuenta de desarrollador Apple |
| Android | Google Play / Play Store | APK/AAB firmado |
| Itch.io | Build web (HTML5) o desktop | Flutter Web export |

- Motor: **Flutter + Flame** (gameplay 2D sobre Flutter, UI en Flutter).
- Backend: API REST (definida en `docs/openapi.yaml`) para cuentas, progreso y leaderboard.

---

## 3. Roles

### 3.1 Alumno (Student)
- Recorre el **Sendero Sagrado**: resuelve retos por nodo, gana estrellas y recompensas.
- Juega **Minijuegos** libres (modo práctica) para afinar habilidades.
- Consulta el **Códice** (enciclopedia temática) para aprender conceptos.
- Ve su progreso y posición en el leaderboard de su clase/grupo.
- Perfil con apodo de cazador de templos (`BALAM`) y acumuladores (Cuentas Jade, Sellos Solares).

### 3.2 Profesor (Teacher)
- Crea y gestiona **grupos/clases** (código de aula).
- Asigna **sendas/secciones** y objetivos a sus alumnos.
- Consulta el **progreso detallado** de cada alumno (nodos superados, estrellas, tiempo).
- Visualiza el leaderboard de su(s) grupo(s).
- Revisa reportes de dominio por tema (arith vigesimal, geometría, glifos...).

---

## 4. Estructura de navegación

La app (post-login) usa una **NavBar inferior de 4 pestañas**:

| # | Pestaña | Función |
|---|---|---|
| 1 | **Feed** | Resumen/actividad del jugador: reto del día, noticias, acceso rápido |
| 2 | **Sendero Sagrado** | Mapa de aventura: progresión por nodos (pantalla principal de juego) |
| 3 | **Minijuegos** | Modo práctica: retos sueltos tipo ZumaBrain |
| 4 | **Códice** | Enciclopedia temática de conceptos y glifos |

Flujo principal:
```
Login (correo + contraseña)
  └─> Shell(NavBar)
        ├─ Feed
        ├─ Sendero Sagrado  → detalle de nodo → gameplay (ZumaBrain) → resultado
        ├─ Minijuegos       → gameplay (ZumaBrain) → resultado
        └─ Códice           → detalle de glifo / lección
```

---

## 5. Jugabilidad

### 5.1 Mecánica núcleo (modo Zuma)
- El jugador dispara proyectiles (bolas/glifos) desde un lanzador central.
- Las bolas viajan por un rastro y **se eliminan al formar grupos de 3+ del mismo
  color/glifo**.
- El combo correcto otorga puntos y recompensas; los fallos alimentan la
  proximidad del "cráneo" hacia la salida (game over).

### 5.2 Integración educativa (el “Brain” de ZumaBrain)
- Antes de disparar, en ciertos nodos aparece un **reto**: responder una pregunta
  (aritmética vigesimal, simetría, descifrado de glifos, fracciones...) dentro de
  un límite de tiempo.
- **Responder correcto** → potencia el disparo (bola especial, combo extra, escudo).
- **Responder incorrecto** → penaliza (retrocede el rastro o ralentiza el lanzador).
- La dificultad del reto escala con el nodo.

### 5.3 Retos por nodo (categorías)
- **Aritmética Vigesimal I** — base-20 maya, sumas/restas con puntos y barras.
- **Geometría Sagrada** — simetría de pirámides, patrones.
- **Rueda Tzolkin** — calendario ritual de 260 días, conteo de kin.
- **Cálculo Fraccionario Maya/Azteca** — fracciones en contexto histórico.
- **Templo de los Glifos** — descifrado vigesimal en 60 segundos (mini-boss Guardian).
- **Cámara de Kukulkán/Quetzalcóatl** — boss final (Gran Ajau Regional).

### 5.4 Estados de nodo (Sendero Sagrado)
```
LOCKED    → bloqueado hasta superar el nodo anterior (o el requisito especificado)
ACTIVE    → nodo actual del jugador ("¡ESTÁS AQUÍ!")
COMPLETED → superado; guarda estrellas (0-3) y recompensa obtenida
```

### 5.5 Progresión y recompensas
- **Sellos Solares:** estrellas (0-3) por nodo según desempeño + tiempo.
- **Cuentas Jade:** moneda de progreso ("+120 Cuentas Jade" por nodo superado).
- **Glifo Dorado de la Sabiduría Vigesimal:** recompensa de nodo boss.
- Los nodos completados con 3/3 desbloquean contenido del Códice y minijuegos bonus.

---

## 6. Pantallas (inventario actual)

| Pantalla | Archivo de diseño | Estado |
|---|---|---|
| Login / Main Menu | Login (códice de acceso) | Diseñada (HTML/Pencil) |
| Shell + NavBar (4 pestañas) | NavBar | Diseñada (HTML/Pencil) |
| Sendero Sagrado (mapa 6 nodos) | Mapa Aventura | Diseñada (HTML/Pencil) |
| Feed | — | Pendiente |
| Minijuegos | — | Pendiente |
| Códice | — | Pendiente |
| Detalle de nodo | — | Pendiente |
| Gameplay ZumaBrain | — | Pendiente |
| Resultado de partida | — | Pendiente |
| Leaderboard | — | Pendiente |
| Perfil Alumno | — | Pendiente |
| Dashboard Profesor | — | Pendiente |
| Gestión de grupos (Profesor) | — | Pendiente |
| Seguimiento de alumnos (Profesor) | — | Pendiente |

---

## 7. Estilo visual (design tokens)

Tema **códice maya retro** de baja paleta:

| Token | Valor | Uso |
|---|---|---|
| `fondo` | `#1A1A1A` | Fondo de app |
| `rojoCinabrio` | `#A62B2B` | Superficies, NavBar, marcos |
| `oro` | `#D48925` | Acento principal, pestaña activa |
| `oroClaro` | `#D99B26` / `#F4B238` | Dorados de acento/botones |
| `miel` | `#F9C852` | Labels claros |
| `hueso` | `#FDF8EE` / `#F5EBD2` | Texto principal |
| `tinta` | `#0E0A0B` | Sombras, inputs |
| `verdeJade` | `#1E6B4B` | Nodos superados |
| `verdeLuz` | `#8BD6AC` | Acentos de completado |
| `rojoSangre` | `#8F1D18` | Bordes de nodo activo |
| `rojoVivo` | `#D83A30` | Acentos de combate |
| `grisLosa` | `#544347` | Nodos bloqueados |

**Tipografías:**
- `Press Start 2P` — títulos, labels, botones (retro pixel).
- `Silkscreen` — subtítulos, descripciones, recompensas.

**Framework visual:** grecas mayas decorativas (patrón SVG), formularios tipo
códice/tabilla de arcilla, botones con sombra dura pixel (`box-shadow`), bordes
duplicados estilo arcade.

---

## 8. Monetización (a definir)
- (No definida aún) — propuestas: compra única, IAP de "Petates de Jade" cosméticos, o edición Profesor (gestión de grupos).

---

## 9. Roadmap de diseño
1. ✅ Concepto y plataformas (este documento)
2. ✅ Pantallas: Login, NavBar, Sendero Sagrado
3. ⏳ Gameplay ZumaBrain + retos educativos (Prototipo)
4. ⏳ Backend (openapi.yaml) + sincronización de progreso
5. ⏳ Roles Profesor/Alumno completos
6. ⏳ Alpha (Android + Web), Beta, Release (iOS + Android + Itch.io)