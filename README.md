# ZumaBrain

Juego/app híbrido de aprendizaje (**edutainment**) con temática mesoamericana
(Maya + pixel-art retro). Combina mecánica de disparo tipo *Zuma* con retos
educativos, en un recorrido ritual por el **Sendero Sagrado**.

- **Cliente:** Flutter + Flame (iOS, Android, Web/Itch.io).
- **Backend:** API REST definida en [`docs/openapi.yaml`](docs/openapi.yaml).

## Documentación

| Documento | Contenido |
|---|---|
| [`docs/GDD.md`](docs/GDD.md) | Diseño del juego (concepto, mecánicas, progresión) |
| [`docs/SDD.md`](docs/SDD.md) | Arquitectura de software (stack, hydration progresiva) |
| [`docs/openapi.yaml`](docs/openapi.yaml) | Contrato del backend |
| [`docs/SANDBOX.md`](docs/SANDBOX.md) | **Cómo levantar el sandbox local** |

## Estructura del repositorio

```
ZumaBrain/
├─ docs/        # GDD, SDD, openapi.yaml, SANDBOX.md
├─ design/      # pantallas fuente (HTML/Pencil) + assets
├─ server/      # Backend sandbox (Node + Fastify) — implementa openapi.yaml
└─ app/         # Cliente Flutter (design system + Login con hidratación L0–L4)
```

## Sandbox local — arranque rápido

```powershell
# 1) Backend
cd server
npm install
npm start
# → API en http://localhost:8090/v1  ·  Swagger UI en http://localhost:8090/docs
```

> El puerto por defecto del sandbox es **8090** para no chocar con otros
> dev-servers (Vite, etc.) que suelen ocupar el 8080. Se puede cambiar con
> la variable de entorno `PORT`.

### Cuentas demo

| Rol | Correo | Contraseña |
|---|---|---|
| Alumno | `balam@zuma.dev` | `zuma1234` |
| Profesor | `profe@zuma.dev` | `zuma1234` |

Código de aula maya: **`KUKUL-04`**

## Sandbox local — cliente Flutter

```powershell
cd app
flutter pub get
flutter run -d chrome        # o: flutter run -d web-server --web-port 5000
```

La app apunta al backend en `http://127.0.0.1:8090/v1` (configurable con
`--dart-define=API_BASE=...`). El login trae precargadas las credenciales demo.

## Estado

| Módulo | Estado |
|---|---|
| Backend sandbox (openapi.yaml) | ✅ Implementado y probado (20/20 smoke) |
| Design system Flutter (tokens + widgets) | ✅ Greca, panel códice, input, botón arcade, skeleton |
| Login con hidratación L0–L4 | ✅ Implementado (tema, autenticación real contra el API) |
| Shell + NavBar 4 pestañas | ⏳ Andamiaje; diseño definitivo pendiente (pantalla 2) |
| Sendero Sagrado | ⏳ Pendiente (pantalla 3) |
| Gameplay Flame | ⏳ Pendiente (fase posterior) |
