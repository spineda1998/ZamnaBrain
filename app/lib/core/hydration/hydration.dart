import 'package:flutter/foundation.dart';

/// Niveles de hidratación progresiva (SDD §8.1).
///
/// Regla de oro: *estructura primero, contenido después, media al final —
/// el shell nunca espera al dato*.
enum HydrationLevel {
  /// L0 — Fondo, grecas, NavBar estático. Sin datos.
  l0Shell,

  /// L1 — Estructura: paneles, listas vacías, placeholders.
  l1Layout,

  /// L2 — Crítico: formularios/inputs, nodos según estado.
  l2Critical,

  /// L3 — Pesado: imágenes, SVGs, animaciones.
  l3Heavy,

  /// L4 — Remoto: sesión, progreso, leaderboard.
  l4Remote,
}

/// Controlador de hidratación por pantalla. Avanza solo hacia adelante
/// (nunca retrocede) y notifica a los widgets que dependen del nivel.
class HydrationController extends ChangeNotifier {
  HydrationController({HydrationLevel initial = HydrationLevel.l0Shell})
    : _level = initial;

  HydrationLevel _level;

  HydrationLevel get level => _level;

  bool reached(HydrationLevel level) => _level.index >= level.index;

  void advanceTo(HydrationLevel level) {
    if (level.index <= _level.index) return;
    _level = level;
    notifyListeners();
  }

  /// Secuencia típica: avanza por niveles con pequeños retardos para que el
  /// efecto de hidratación sea perceptible (y reemplazable por tiempos reales).
  void runSequential({
    Duration step = const Duration(milliseconds: 70),
    HydrationLevel until = HydrationLevel.l3Heavy,
    void Function()? onDone,
  }) {
    var target = HydrationLevel.l1Layout;
    while (target.index <= until.index) {
      final current = target;
      Future.delayed(step * target.index, () => advanceTo(current));
      target = HydrationLevel.values[target.index + 1];
    }
    Future.delayed(step * (until.index + 1), () => onDone?.call());
  }
}
