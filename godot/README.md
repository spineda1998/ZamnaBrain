# Itzamna Academia — Godot Engine 4 Port (Fase 1)

Este directorio contiene el andamiaje oficial y el código fuente nativo de **Itzamna Academia** para **Godot Engine 4 (GDScript)**, diseñado para distribución en tiendas móviles (**Google Play Store** y **Apple App Store**).

---

## Estructura del Proyecto

* **`project.godot`**: Configuración optimizada para Pixel Art SNES de 32 bits:
  * Resolución base: `360 × 640` (modo vertical móvil).
  * Stretch Mode: `viewport` con filtro `Nearest` (píxeles 100% nítidos sin interpolación bilineal).
  * Renderizador móvil: Vulkan Mobile con fallback de compatibilidad OpenGL ES 3.0.
* **`shaders/cosmic_bg.gdshader`**: Shader del fondo espacial Maya con:
  * Matriz ordenada de semitono Bayer 4x4.
  * Cuantización de hardware DAC SNES RGB555 a 15 bits reales.
  * Paleta indexada de 256 colores ceremoniales Modo 3/4.
  * Elementos celestiales procedurales (galaxia espiral, pirámides y máscaras de jade flotantes).
* **`shaders/dither_text.gdshader`**: Shader de semitono Bayer 4x4 para el título `ItzamnaTitle` en oro/ámbar/cinabrio y azul maya.
* **`autoload/game_state.gd`**: Singleton con persistencia cifrada (`user://game_state.dat`), gestión de los 10 puntos de Energía de Jade y reinicio ritual diario de 24 horas.
* **`autoload/api_client.gd`**: Singleton con cliente REST asíncrono (`HTTPRequest`), almacenamiento seguro de JWT (`user://token.dat`) y sincronización con el backend Express.
* **`autoload/audio_manager.gd`**: Mezclador de audio retro con sintetizador de tonos 8-bit procedurales.
* **`scenes/core/boot_splash.tscn`**: Escena inicial de arranque con título animado por pulso ritmico y verificación de credenciales.

---

## Cómo abrir y ejecutar en Godot 4

1. Descarga **Godot Engine 4.3** o superior (versión estándar con soporte GDScript) desde [godotengine.org](https://godotengine.org).
2. Abre Godot y pulsa en **Importar** (`Import`).
3. Selecciona el archivo `godot/project.godot` y pulsa **Importar y Editar**.
4. Pulsa **F5** (o el botón de reproducir proyecto en la esquina superior derecha) para ejecutar la escena `boot_splash.tscn`.

---

## Exportación a Tiendas Móviles

### Google Play Store (Android)
1. Instala Android SDK y OpenJDK 17.
2. En Godot: `Proyecto -> Exportar -> Añadir Android`.
3. Activa la opción **Exportar AAB** (`Export Format: Export AAB`).
4. Configura el Keystore de firmado de producción.
5. Genera el paquete `.aab` listo para subir a Google Play Console.

### Apple App Store (iOS)
1. Requiere macOS y Xcode.
2. En Godot: `Proyecto -> Exportar -> Añadir iOS`.
3. Configura tu Team ID y Bundle Identifier (`com.itzamna.academia`).
4. Pulsa **Exportar Proyecto** para generar el proyecto `.xcodeproj` y ábrelo en Xcode para compilar a TestFlight o la App Store.
