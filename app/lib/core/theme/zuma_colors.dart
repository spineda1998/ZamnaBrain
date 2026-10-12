import 'package:flutter/material.dart';

/// Design tokens de ZumaBrain (GDD §7) + extras extraídos de
/// `design/login-screen.html`. Los valores marcados como `Placeholder`
/// provienen del diseño HTML y se reemplazarán con el Kit de Diseño oficial.
abstract final class ZumaColors {
  // ── Paleta base (GDD §7) ─────────────────────────────────────
  static const fondo = Color(0xFF1A1A1A);
  static const rojoCinabrio = Color(0xFFA62B2B);
  static const oro = Color(0xFFD48925);
  static const oroClaro = Color(0xFFD99B26);
  static const oroBrillante = Color(0xFFF4B238);
  static const miel = Color(0xFFF9C852);
  static const hueso = Color(0xFFFDF8EE);
  static const huesoAlt = Color(0xFFF5EBD2);
  static const tinta = Color(0xFF0E0A0B);
  static const verdeJade = Color(0xFF1E6B4B);
  static const verdeLuz = Color(0xFF8BD6AC);
  static const rojoSangre = Color(0xFF8F1D18);
  static const rojoVivo = Color(0xFFD83A30);
  static const grisLosa = Color(0xFF544347);

  // ── Placeholders (del HTML; pendiente Kit de Diseño) ─────────
  static const oroLabelPlaceholder = Color(0xFFD4AF37); // label "Correo electronico"
  static const rojoBordePlaceholder = Color(0xFFB8261E); // borde input correo
  static const rojoBrilloPlaceholder = Color(0xFFE44A3E); // inset highlight botón
  static const rojoSombraPlaceholder = Color(0xFF530E0B); // inset shadow botón
  static const glowAxolotlPlaceholder = Color(0xFFFDBA45); // glow mascota
}
