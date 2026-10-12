import 'package:flutter/material.dart';
import '../theme/zuma_colors.dart';

/// Glifo rúnico (`᚛`) del diseño original, dibujado como trazo angular en vez de
/// depender de una fuente con soporte Ogham. Reemplazable por el SVG del Kit.
class ZumaRuneIcon extends StatelessWidget {
  const ZumaRuneIcon({super.key, this.size = 12, this.color = ZumaColors.oroClaro});

  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(painter: _RunePainter(color)),
    );
  }
}

class _RunePainter extends CustomPainter {
  _RunePainter(this.color);
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 0.12
      ..strokeCap = StrokeCap.square;
    final w = size.width;
    final h = size.height;
    final path = Path()
      ..moveTo(w * 0.15, h * 0.05)
      ..lineTo(w * 0.55, h * 0.5)
      ..lineTo(w * 0.15, h * 0.95)
      ..moveTo(w * 0.55, h * 0.5)
      ..lineTo(w * 0.85, h * 0.5);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _RunePainter oldDelegate) => oldDelegate.color != color;
}
