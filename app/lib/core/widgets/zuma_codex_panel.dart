import 'package:flutter/material.dart';
import '../theme/zuma_colors.dart';

/// Panel tipo *códice / tablilla de arcilla* (`#A62B2B`) usado como contenedor
/// de formularios (login, etc.). Ver `design/login-screen.html`.
class ZumaCodexPanel extends StatelessWidget {
  const ZumaCodexPanel({
    super.key,
    required this.child,
    this.width = 358,
    this.padding = const EdgeInsets.all(12),
  });

  final Widget child;
  final double width;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      padding: padding,
      decoration: const BoxDecoration(color: ZumaColors.rojoCinabrio),
      child: child,
    );
  }
}
