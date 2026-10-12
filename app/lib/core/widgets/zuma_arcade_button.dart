import 'package:flutter/material.dart';
import '../theme/zuma_colors.dart';
import '../theme/zuma_typography.dart';

/// Botón arcade con sombra dura pixel y relieve tipo bisel (oro cinabrio).
class ZumaArcadeButton extends StatefulWidget {
  const ZumaArcadeButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;

  @override
  State<ZumaArcadeButton> createState() => _ZumaArcadeButtonState();
}

class _ZumaArcadeButtonState extends State<ZumaArcadeButton> {
  bool _down = false;

  @override
  Widget build(BuildContext context) {
    final enabled = widget.onPressed != null && !widget.isLoading;
    final shift = _down && enabled ? 2.0 : 0.0;
    final blur = _down && enabled ? 2.0 : 4.0;

    return GestureDetector(
      onTapDown: enabled ? (_) => setState(() => _down = true) : null,
      onTapUp: enabled
          ? (_) {
              setState(() => _down = false);
              widget.onPressed!.call();
            }
          : null,
      onTapCancel: enabled ? () => setState(() => _down = false) : null,
      child: Opacity(
        opacity: enabled ? 1 : 0.6,
        child: Transform.translate(
          offset: Offset(shift, shift),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [ZumaColors.oroBrillante, ZumaColors.oro],
              ),
              border: Border.all(color: ZumaColors.oroClaro.withValues(alpha: 0.4)),
              boxShadow: [
                BoxShadow(
                  color: ZumaColors.tinta,
                  offset: Offset(blur, blur),
                  blurRadius: 0,
                ),
              ],
            ),
            child: Center(
              child: widget.isLoading
                  ? const SizedBox(
                      width: 14,
                      height: 14,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: ZumaColors.hueso,
                      ),
                    )
                  : Text(
                      widget.label,
                      style: ZumaTypography.button,
                      textAlign: TextAlign.center,
                    ),
            ),
          ),
        ),
      ),
    );
  }
}
