import 'package:flutter/material.dart';
import 'zuma_colors.dart';
import 'zuma_typography.dart';

/// Tema global de ZumaBrain (códice maya retro, fondo oscuro).
abstract final class ZumaTheme {
  static ThemeData get dark {
    final base = ThemeData.dark(useMaterial3: true);
    return base.copyWith(
      scaffoldBackgroundColor: ZumaColors.fondo,
      canvasColor: ZumaColors.fondo,
      colorScheme: const ColorScheme.dark(
        primary: ZumaColors.oro,
        onPrimary: ZumaColors.tinta,
        secondary: ZumaColors.oroClaro,
        onSecondary: ZumaColors.tinta,
        surface: ZumaColors.fondo,
        onSurface: ZumaColors.hueso,
        error: ZumaColors.rojoVivo,
        onError: ZumaColors.hueso,
      ),
      textTheme: base.textTheme.apply(
        fontFamily: ZumaTypography.pixel,
        bodyColor: ZumaColors.hueso,
        displayColor: ZumaColors.miel,
      ),
      inputDecorationTheme: const InputDecorationTheme(
        filled: true,
        fillColor: ZumaColors.tinta,
        isCollapsed: true,
        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        border: InputBorder.none,
        enabledBorder: InputBorder.none,
        focusedBorder: InputBorder.none,
        hintStyle: TextStyle(
          fontFamily: ZumaTypography.pixel,
          fontSize: 10,
          color: ZumaColors.grisLosa,
        ),
      ),
      splashFactory: NoSplash.splashFactory,
      highlightColor: Colors.transparent,
    );
  }
}
