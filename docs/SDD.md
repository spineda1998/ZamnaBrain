# SDD — ZumaBrain

**Versión:** 0.1
**Fecha:** 2026-10-09
**Estado:** En diseño

---

## 1. Propósito y alcance

Este documento describe la arquitectura de **ZumaBrain** — aplicación híbrida
videojuego/app de aprendizaje con temática maya, roles **Profesor/Alumno**,
progresión por nodos (Sendero Sagrado), minijuegos estilo Zuma y leaderboard.

Alcance v0.1:
- Cáscaron visual (shell + pantallas) en **Flutter** con fidelidad a los diseños Pencil/HTML.
- Gameplay núcleo en **Flame** (prototipo de mecánica Zuma).
- Contrato backend en `openapi.yaml` (progreso, cuentas, leaderboard).
- **Hydration progresiva** de componentes (ver §8).

Fuera de alcance v0.1: monetización, analítica, versiones iOS/Play distribuidas.

---

## 2. Stack tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Cliente | **Flutter** | Una sola base de código → iOS, Android, Web (Itch.io). UI rica para dashboards/roles |
| Gameplay | **Flame** (sobre Flutter) | Motor 2D ligero, ideal para mecánica Zuma y componentes/partículas |
| Estado | **Riverpod** | Gestión de estado reactiva, fácil de testear, hydration por estado |
| Rutas | **go_router** | Deep links, rutas por rol, guards de autenticación |
| Red | **Dio + Retrofit (o codegen OpenAPI)** | Cliente generado desde `openapi.yaml` |
| Persistencia local | **Hive / shared_preferences** | Cache offline de progreso y sesión |
| Backend | API REST (definido en `openapi.yaml`) | Implementación posterior (p.ej. Node/Fastify o Firebase) |

---

## 3. Arquitectura general

```
┌─────────────────────────────┐
│        Flutter App          │
│  ┌───────────────────────┐  │
│  │  UI Layer (widgets)   │  │   pantallas por feature, tema, componentes
│  ├───────────────────────┤  │
│  │ Application Layer     │  │   providers/controllers, casos de uso
│  ├───────────────────────┤  │
│  │ Domain Layer          │  │   entidades, enums (NodeStatus, roles), reglas
│  ├───────────────────────┤  │
│  │ Data Layer            │  │   repositorios → API (Dio) + cache (Hive)
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  Flame (game engine)  │  │   gameplay ZumaBrain (Component/Game)
│  └───────────────────────┘  │
└────────────┬────────────────┘
             │ HTTP (REST) — contrato openapi.yaml
┌────────────▼────────────────┐
│        Backend API          │
│  Auth · Users · Groups ·    │
│  Sendero · Progress ·       │
│  Leaderboard · Content       │
└─────────────────────────────┘
```

### 3.1 Principios
- **Feature-first**: cada módulo (`auth`, `student`, `teacher`, `game`, `sendero`, `codex`, `leaderboard`, `feed`) autocontiene pantalla + providers + modelos.
- **Dependencias hacia adentro**: UI → Application → Domain ← Data.
- **Hydration por estado**: cada componente expone su etapa de carga (cáscara → datos) y se puebla de forma secuencial y progresiva (ver §8).

---

## 4. Estructura del repositorio

```
ZumaBrain/
├─ docs/
│  ├─ GDD.md            # diseño del juego (ver documento)
│  ├─ SDD.md            # este documento
│  └─ openapi.yaml      # contrato del backend (anexo al SDD)
├─ design/              # pantallas fuente (HTML/Pencil) + assets
│  ├─ login-screen.html
│  ├─ navbar.html
│  └─ sendero-sagrado.html
└─ app/
   ├─ pubspec.yaml
   ├─ lib/
   │  ├─ main.dart                     # bootstrap + hydration del shell
   │  ├─ app.dart                      # ZumaApp (MaterialApp.router + tema)
   │  ├─ core/
   │  │  ├─ theme/
   │  │  │  ├─ zuma_colors.dart        # design tokens (paleta)
   │  │  │  ├─ zuma_typography.dart    # Press Start 2P + Silkscreen
   │  │  │  └─ zuma_theme.dart         # ThemeData
   │  │  ├─ widgets/                   # componentes base del design system
   │  │  ├─ navigation/                # go_router + ZumaNavBar
   │  │  └─ hydration/                 # HydratableState, HydrationController
   │  ├─ features/
   │  │  ├─ auth/        (login, registro, roles)
   │  │  ├─ feed/
   │  │  ├─ sendero/     (mapa de nodos, nodo, estado de progreso)
   │  │  ├─ minigames/   (menú de minijuegos + gameplay Flame)
   │  │  ├─ codex/
   │  │  ├─ leaderboard/
   │  │  ├─ student/     (perfil alumno)
   │  │  └─ teacher/     (dashboard profe, grupos, seguimiento)
   │  └─ game/                        # Flame: juego núcleo ZumaBrain
   │     ├─ zuma_game.dart
   │     ├─ components/ (shooter, ball, chain, reto)
   │     └─ levels/
   └─ assets/
      ├─ fonts/           # PressStart2P, Silkscreen (licencias incluidas)
      ├─ images/          # axolotl placeholder, glifos, texturas
      └─ icons/           # SVGs fieles a diseño (nav, grecas, nodos)
```

---

## 5. Modelo de datos (dominio)

### 5.1 Entidades clave

```
enum Role { student, teacher }
enum NodeStatus { locked, active, completed }

class User {
  final String id;
  final String email;
  final String nickname;      // el "códice de acceso" / apodo (BALAM)
  final Role role;
}

class Classroom {
  final String id;
  final String code;          // código de aula maya (para unirse)
  final String name;
  final String teacherId;
}

class Node {
  final String id;
  final String sectionId;     // sección del sendero
  final int order;            // posición en el camino
  final String title;         // "TEMPLO DE LOS GLIFOS"
  final String subtitle;      // descripción
  final String rewardLabel;   // "Glifo Dorado..."
  final NodeStatus status;
  final int stars;            // 0..3 sellos solares
}

class StudentProgress {
  final String userId;
  final String nodeId;
  final int stars;
  final int jadeCoins;        // cuentas jade
  final DateTime completedAt;
}

class LeaderboardEntry {
  final String userId;
  final String nickname;
  final int jadeCoins;
  final int totalStars;
  final int rank;
}
```

### 5.2 Relaciones
- `User 1─n Classroom` (member/teacher)
- `Classroom 1─n Student`
- `Section 1─n Node`
- `Student n─m Node` vía `StudentProgress`

---

## 6. Backend (ver `docs/openapi.yaml`)

### 6.1 Dominios del API
- **Auth**: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`
- **Users**: `GET /users/me`, `PATCH /users/me`
- **Classrooms (Profesor)**: `POST /classrooms`, `GET /classrooms/{id}`,
  `POST /classrooms/{id}/join` (alumno), `GET /classrooms/{id}/students`
- **Sendero**: `GET /sections`, `GET /sections/{id}/nodes`
- **Progress**: `GET /me/progress`, `PUT /me/progress/{nodeId}`, `GET /me/leaderboard`
- **Content (Códice)**: `GET /codex/entries`, `GET /codex/entries/{id}`

### 6.2 Autenticación
- Bearer token (JWT) en `Authorization`; refresh token en cookie/body.
- Los endpoints de profesor validan `role=teacher`.

---

## 7. Mecánica de gameplay (Flame) — resumen

- `ZumaGame extends FlameGame`: bucle de juego, cámara, coordenadas del rastro.
- Componentes: `ShooterComponent` (puntería/giro), `BallComponent` (proyectil y
  cadena), `ChainTrack` (rastro de bolas + "cráneo" final), `ChallengePanel` (reto educativo).
- Eventos: `onMatch3`, `onChallengeAnswered(correct)`, `onGameOver`.
- El reto educativo (pregunta) se resuelve en Flutter (widget overlay) y devuelve
  el resultado al juego para potenciar/penalizar.

---

## 8. Hydration secuencial progresiva (especificación)

Especificación del proceso pedido por el producto: cada pantalla se hidrata por
**niveles**, nunca bloqueando el shell ni esperando datos pesados.

### 8.1 Niveles de hydration
| Nivel | Qué se hidrata | Técnica |
|---|---|---|
| `L0 shell` | Fondo, grecas, NavBar (estático) | Pinta inmediato, sin datos |
| `L1 layout` | Estructura (panel, listas vacías, placeholders) | Widgets skeleton |
| `L2 critico` | Formularios/inputs, nodos según estado | Providers locales |
| `L3 pesado` | Imágenes, SVGs, animaciones | `FutureBuilder`, precarga laz |
| `L4 remoto` | Sesión, progreso, leaderboard | Providers remotos (Riverpod `AsyncValue`) |

### 8.2 Contrato de componente
Todo componente del design system implementa:

```dart
abstract class HydratableWidget extends StatelessWidget {
  final HydrationLevel level; // nivel mínimo requerido
  final Widget? skeleton;     // placeholder mientras no hidratado
}
```

El `HydrationController` (por pantalla) secuencia: *"estructura primero, contenido
después, media al final — el shell nunca espera al dato"*.

### 8.3 Ejemplo de orden (pantalla Sendero Sagrado)
1. `L0`: marco del mapa + conectores (estáticos por sección).
2. `L1`: tarjetas nodo en estado skeleton.
3. `L2`: nodos según estado (lockeados → completados → activo).
4. `L3`: íconos de glifo (SVG), estrellas, texturas de greca.
5. `L4`: relleno real vía `GET /sections/{id}/nodes` + `GET /me/progress`.

---

## 9. Componentes del design system (widgets base)

| Widget | Descripción | Screen(s) |
|---|---|---|
| `ZumaNavBar` | NavBar 4 pestañas (Feed, Sendero, Minijuegos, Códice) | Todas (shell) |
| `ZumaGreca` | Patrón maya decorativo (SVG fiel) | Login, Sendero |
| `ZumaCodexPanel` | Tarjeta tipo códice/tabilla `#A62B2B` | Login |
| `ZumaTextField` | Input con ícono (᚛ candado) + borde dorado | Login |
| `ZumaArcadeButton` | Botón degradado con sombra dura pixel | Login, Sendero |
| `NodeCard` | Tarjeta de nodo; variantes `locked/active/completed/boss` | Sendero |
| `StatusTag` | Badge SUPERADO / MEJORABLE / BLOQUEADO / MINI-BOSS | Sendero |
| `StarRating` | Sellos solares 0-3 (estrella completa / intermedia / vacía) | Sendero |
| `PathConnector` | Escalón de progresión; variantes (verde/oro-flama/gris) | Sendero |
| `PointerBadge` | "¡ESTÁS AQUÍ!" flotante | Sendero |
| `GlifoIcon` | Caja 56/36 con ícono SVG | Sendero |

---

## 10. Calidad

- **Tests** por feature: modelos, providers, widgets de hydration.
- **Golden tests** para los SVG fieles (evita regresión visual del design system).
- Análisis estático: `flutter analyze` sin warnings.

---

## 11. Flujo de despliegue (builds objetivo)
1. **Dev loop:** `flutter run -d chrome` / `flutter run -d windows`.
2. **Itch.io:** `flutter build web` → subir `build/web`.
3. **Android:** `flutter build appbundle` (Play) / `flutter build apk`.
4. **iOS:** `flutter build ipa` (requiere macOS + certificados).

---

## 12. Decisiones registradas (ADR resumidos)
1. **Flutter+Flame sobre Unity/Godot** → rápida iteración UI (roles/dashboards) + 3 plataformas con una base de código.
2. **Riverpod sobre Bloc/Provider** → hydration asíncrona escalable y menor boilerplate.
3. **Backend REST propio (openapi.yaml)** → control total del dominio educativo y leaderboard; permite implementar Node/Go/Firebase después sin tocar el cliente.
4. **SVGs como assets fieles**, no redibujados → fidelidad exacta requerida por producto.