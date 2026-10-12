import 'package:flutter/material.dart';
import '../theme/zuma_colors.dart';

/// Greca maya decorativa — barra `#A62B2B` con el motivo escalonado dorado
/// replicado con las coordenadas exactas del SVG de `design/login-screen.html`.
class ZumaGreca extends StatelessWidget {
  const ZumaGreca({super.key, this.height = 16});

  final double height;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      width: double.infinity,
      child: ColoredBox(
        color: ZumaColors.rojoCinabrio,
        child: CustomPaint(painter: _GrecaPainter()),
      ),
    );
  }
}

class _GrecaPainter extends CustomPainter {
  // Geometría del motivo (del viewBox 0 0 377.225 12, 16 unidades).
  static const double _unitWidth = 19.1;
  static const double _step = 23.875; // 377.225 / 16
  static const double _motifHeight = 12;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = ZumaColors.oroClaro.withValues(alpha: 0.85)
      ..style = PaintingStyle.fill;

    final yOffset = (size.height - _motifHeight) / 2;
    final path = Path();
    for (double x = 0; x < size.width; x += _step) {
      final u = x + _unitWidth;
      path
        ..moveTo(x, yOffset)
        ..lineTo(u, yOffset)
        ..lineTo(u, yOffset + 4)
        ..lineTo(x + _unitWidth / 2, yOffset + 4)
        ..lineTo(x + _unitWidth / 2, yOffset + 8)
        ..lineTo(u, yOffset + 8)
        ..lineTo(u, yOffset + _motifHeight)
        ..lineTo(x, yOffset + _motifHeight)
        ..close();
    }
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _GrecaPainter oldDelegate) => false;
}
