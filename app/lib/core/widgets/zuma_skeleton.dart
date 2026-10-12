import 'package:flutter/material.dart';
import '../theme/zuma_colors.dart';

/// Placeholder con pulso suave (fase L1 de hidratación).
class ZumaSkeleton extends StatefulWidget {
  const ZumaSkeleton({
    super.key,
    required this.height,
    this.width = double.infinity,
    this.color = ZumaColors.tinta,
  });

  final double height;
  final double width;
  final Color color;

  @override
  State<ZumaSkeleton> createState() => _ZumaSkeletonState();
}

class _ZumaSkeletonState extends State<ZumaSkeleton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 900),
  )..repeat(reverse: true);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: Tween<double>(begin: 0.35, end: 0.9).animate(_c),
      child: Container(
        width: widget.width,
        height: widget.height,
        decoration: BoxDecoration(
          color: widget.color,
          border: Border.all(color: ZumaColors.rojoBordePlaceholder.withValues(alpha: 0.4)),
        ),
      ),
    );
  }
}
