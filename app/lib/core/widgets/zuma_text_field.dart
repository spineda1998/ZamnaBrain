import 'package:flutter/material.dart';
import '../theme/zuma_colors.dart';
import '../theme/zuma_typography.dart';

/// Input tipo códice: label pixel + caja `#0E0A0B` con borde de acento,
/// sombra dura pixel y glifo líder (runa / candado).
class ZumaTextField extends StatelessWidget {
  const ZumaTextField({
    super.key,
    required this.label,
    required this.controller,
    required this.labelColor,
    required this.borderColor,
    this.leading,
    this.hint,
    this.obscure = false,
    this.keyboardType,
    this.textInputAction,
    this.focusNode,
    this.onSubmitted,
  });

  final String label;
  final TextEditingController controller;
  final Color labelColor;
  final Color borderColor;
  final Widget? leading;
  final String? hint;
  final bool obscure;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final FocusNode? focusNode;
  final ValueChanged<String>? onSubmitted;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: ZumaTypography.label.copyWith(color: labelColor)),
        const SizedBox(height: 4),
        Container(
          decoration: BoxDecoration(
            color: ZumaColors.tinta,
            border: Border.all(color: borderColor),
            boxShadow: const [
              BoxShadow(color: ZumaColors.tinta, offset: Offset(2, 2), blurRadius: 0),
            ],
          ),
          child: Row(
            children: [
              if (leading != null)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  child: leading,
                ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(12, 10, 8, 10),
                  child: TextField(
                    controller: controller,
                    focusNode: focusNode,
                    obscureText: obscure,
                    keyboardType: keyboardType,
                    textInputAction: textInputAction,
                    onSubmitted: onSubmitted,
                    cursorColor: ZumaColors.oroClaro,
                    style: ZumaTypography.input,
                    decoration: InputDecoration(
                      isCollapsed: true,
                      border: InputBorder.none,
                      hintText: hint,
                      hintStyle: ZumaTypography.input.copyWith(
                        color: ZumaColors.grisLosa,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
