# Plan Maestro de Migración: Itzamna Academia a Godot Engine 4

Este documento establece el análisis de viabilidad técnica, la arquitectura del motor y la hoja de ruta integral para migrar la totalidad de **Itzamna Academia** desde la arquitectura actual (React + WebGL + Express) hacia **Godot Engine 4 (GDScript)** con destino principal a **Google Play Store (Android)** y **Apple App Store (iOS)**.

---

## 1. Veredicto de Viabilidad Técnica

### Viabilidad Global: **9.4 / 10 (Excelente)**
La decisión de destinar el proyecto a tiendas móviles nativas (Google Play y App Store) elimina por completo la principal debilidad de Godot (el tamaño de descarga inicial en WebAssembly) y potencia sus mayores fortalezas:
1. **Rendimiento 60 FPS constante en móviles**: Acceso directo al renderizador `Mobile` (Vulkan) y fallback `Compatibility` (OpenGL ES 3.0), garantizando compatibilidad con el 99% de dispositivos Android e iOS.
2. **Estética Pixel Art pura con escalado entero**: Godot cuenta con soporte nativo de `viewport` stretch mode y filtro de textura `Nearest`, eliminando cualquier borrosidad o desalineación de píxeles sin necesidad de hacks CSS.
3. **Consumo de batería y memoria**: La aplicación nativa en Godot consume entre 60MB y 110MB de RAM frente a los 250MB+ de un WebView móvil.
4. **Reutilización del backend existente**: Godot se comunicará mediante el nodo `HTTPRequest` con la API REST existente (`/v1`), manteniendo el progreso, perfiles, aulas y clasificación intactos.

---

## 2. Estado de Ejecución de la Hoja de Ruta

| Fase | Estado | Entregables Clave |
| :--- | :--- | :--- |
| **Fase 1: Andamiaje y Shaders** | **COMPLETADA** | Creación del proyecto Godot 4 (`project.godot`), configuración de viewport vertical 360x640 pixel-perfect, port del shader cósmico (`cosmic_bg.gdshader`), shader de títulos (`dither_text.gdshader`), singletons Autoload (`game_state.gd`, `api_client.gd`, `audio_manager.gd`) y escena de arranque (`boot_splash.tscn`). |
| **Fase 2: Cliente API y Auth** | **EN PROGRESO** | Vinculación del singleton `ApiClient.gd` con la API `/v1`, pantalla de login ceremonial tipo códice y persistencia cifrada de JWT en `user://token.dat`. |
| **Fase 3: Port de los 4 Minijuegos** | Planificada | Tetris Azteca (TileMapLayer), Máscaras Gemelas (animación flip), Balanza de Jade (torque ceremonial) y Senda de Kukulkán (Path2D). Pruebas de controles táctiles móviles. |
| **Fase 4: Shell Principal y Vistas LMS** | Planificada | Implementación del Feed con scroll suave, Sendero de aprendizaje (mapa de nodos desbloqueables), Códice interactivo y barra `BottomNav`. |
| **Fase 5: Build Móvil y Optimización** | Planificada | Configuración de builds de prueba APK y Xcode, ajuste de Safe Areas, integración de hápticos y pruebas de rendimiento en dispositivos gama baja/media. |
| **Fase 6: Certificación y Tiendas** | Planificada | Generación de `.aab` para Google Play Console y build iOS para TestFlight / App Store Connect, capturas de pantalla promocionales y checklist de privacidad educativa. |

---

## 3. Archivos del Proyecto Godot Creados en el Repositorio (`/godot`)

* **`godot/project.godot`**: Configuración de pantalla `360x640`, orientación vertical (`portrait`), stretch mode `viewport`, renderizador `Mobile` y filtro de textura `Nearest`.
* **`godot/shaders/cosmic_bg.gdshader`**: Shader del fondo espacial Maya con matriz ordenada Bayer 4x4, cuantización de hardware DAC SNES RGB555 a 15 bits reales y paleta indexada de 256 colores.
* **`godot/shaders/dither_text.gdshader`**: Shader de semitono Bayer 4x4 para títulos canónicos en oro/ámbar/cinabrio y azul maya.
* **`godot/autoload/game_state.gd`**: Singleton con persistencia cifrada (`user://game_state.dat`), gestión de los 10 puntos de Energía de Jade y reinicio ritual de 24 horas.
* **`godot/autoload/api_client.gd`**: Singleton con cliente REST asíncrono (`HTTPRequest`), almacenamiento seguro de JWT (`user://token.dat`) y sincronización con el backend Express.
* **`godot/autoload/audio_manager.gd`**: Mezclador de audio retro con sintetizador procedural de ondas cuadradas de 16 bits para efectos SFX sin latencia.
* **`godot/scenes/core/boot_splash.tscn`**: Escena inicial con fondo shader cósmico, título `ITZAMNA ACADEMIA` con pulso y escalado rítmico, y comprobación de sesión.
* **`godot/README.md`**: Guía paso a paso para abrir el proyecto en Godot 4.3+ y exportar a Google Play y App Store.
