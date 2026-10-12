# SANDBOX — ZumaBrain

Guía para levantar el entorno local (backend + cliente) desde cero en Windows.

---

## 0. Requisitos

| Herramienta | Estado esperado |
|---|---|
| Node.js ≥ 20 | ✅ ya instalado (v24) |
| Git | ✅ ya instalado |
| Flutter SDK | ⏳ **por instalar** (Fase A) |
| Chrome | Para el target web del sandbox |

---

## Fase A — Instalar Flutter (ya realizado ✅)

Flutter **3.47.7 stable** quedó instalado en `C:\src\flutter` y agregado al
`PATH`. Si necesitas rehacerlo en otra máquina:

```powershell
# 1) Clonar el SDK (rama stable) en C:\src\flutter
git clone -b stable --depth 1 https://github.com/flutter/flutter.git C:\src\flutter

# 2) Agregar flutter\bin al PATH del usuario
[Environment]::SetEnvironmentVariable(
  "Path",
  [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\src\flutter\bin",
  "User"
)
```

3. **Abrir una terminal NUEVA** (para que tome el PATH) y verificar:

```powershell
flutter --version
flutter doctor -v
flutter config --enable-web
```

> **Nota:** no necesitas Java ni Android SDK para el sandbox web.
> Solo si luego quieres correr en emulador Android (`winget install Google.AndroidStudio`).

---

## Fase B — Backend sandbox (Node + Fastify)

```powershell
cd server
npm install
npm start
```

Salida esperada:

```
Server listening at http://127.0.0.1:8090
Seed cargado: 5 usuarios, 6 nodos, 1 aulas.
Swagger UI: http://localhost:8090/docs
```

- API base: **http://localhost:8090/v1**
- Swagger UI: **http://localhost:8090/docs**
- Contrato servido en: `http://localhost:8090/openapi.yaml`

### Probar el API

```powershell
npm run smoke     # 20 asserts end-to-end (auth, sendero, progreso, leaderboard, códice, aulas)
```

### Restaurar datos demo

```powershell
# con el servidor DETENIDO:
npm run reset
```

### Cuentas demo

| Rol | Correo | Contraseña |
|---|---|---|
| Alumno | `balam@zuma.dev` | `zuma1234` |
| Profesor | `profe@zuma.dev` | `zuma1234` |

Código de aula: `KUKUL-04`

---

## Fase C — Cliente Flutter

El proyecto ya está creado en `app/` (Flutter + Riverpod + go_router + Dio) con
el design system y la pantalla de Login hidratada.

```powershell
cd app
flutter pub get
flutter run -d chrome                       # sandbox web (Chrome)
# o bien, sin abrir navegador:
flutter run -d web-server --web-port 5000
```

- La app apunta a `http://127.0.0.1:8090/v1` (modo sandbox).
  Se puede sobreescribir: `flutter run --dart-define=API_BASE=http://host:puerto/v1`.
- El login trae precargadas las credenciales demo (`balam@zuma.dev` / `zuma1234`).
- En pantalla verás el indicador de **hidratación progresiva**: `L0 shell → L1
  layout → L2 crítico → L3 media → L4 remoto`.

### Verificación de calidad

```powershell
flutter analyze     # sin warnings
flutter test        # tests de hidratación + widget
flutter build web   # build de producción web
```

---

## Solución de problemas

### El puerto 8080 ya está ocupado

En esta máquina otro proyecto (`ControlMaestro`, un dev-server de Vite) usa el
8080 en IPv4 **e** IPv6. Por eso ZumaBrain usa **8090** por defecto. Si quieres
otro puerto:

```powershell
$env:PORT = 9000; npm start
```

### `localhost` no conecta pero `127.0.0.1` sí

Windows puede resolver `localhost` primero a IPv6 (`::1`). El servidor del
sandbox escucha en IPv4. Usa `http://127.0.0.1:8090` si ves problemas de red.

### Ver qué proceso ocupa un puerto

```powershell
netstat -ano | findstr ":8090"
Get-Process -Id <PID>
```
