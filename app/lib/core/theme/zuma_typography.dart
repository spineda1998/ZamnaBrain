import 'package:flutter/material.dart';
import 'zuma_colors.dart';

/// Tipografías de ZumaBrain (GDD §7).
/// Press Start 2P → títulos/labels/botones. Silkscreen → subtítulos/descripciones.
abstract final class ZumaTypography {
  static const pixel = 'PressStart2P';
  static const silk = 'Silkscreen';

  // Press Start 2P es pixel; un tamaño base de 8–11px mantiene legibilidad.
  static const TextStyle label = TextStyle(
    fontFamily: pixel,
    fontSize: 8,
    height: 1.5,
    letterSpacing: 0.4,
    color: ZumaColors.miel,
  );

  static const TextStyle input = TextStyle(
    fontFamily: pixel,
    fontSize: 10,
    height: 2.4,
    color: ZumaColors.hueso,
  );

  static const TextStyle button = TextStyle(
    fontFamily: pixel,
    fontSize: 11,
    height: 1.55,
    letterSpacing: 0.55,
    color: ZumaColors.hueso,
  );

  static const TextStyle title = TextStyle(
    fontFamily: pixel,
    fontSize: 16,
    height: 1.4,
    color: ZumaColors.miel,
  );

  static const TextStyle body = TextStyle(
    fontFamily: silk,
    fontSize: 14,
    height: 1.4,
    color: ZumaColors.huesoAlt,
  );

  static const TextStyle caption = TextStyle(
    fontFamily: silk,
    fontSize: 12,
    height: 1.35,
    color: ZumaColors.huesoAlt,
  );
}
