import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../auth/application/auth_controller.dart';
import '../../../core/theme/zuma_colors.dart';
import '../../../core/theme/zuma_typography.dart';
import '../../../core/widgets/zuma_greca.dart';

/// Shell posterior al login con la NavBar de 4 pestañas.
/// NOTA: la NavBar definitiva llegará con la pantalla 2 (diseño pendiente);
/// por ahora, un andamiaje funcional para validar navegación + sesión.
class HomeShell extends ConsumerWidget {
  const HomeShell({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final user = auth.user;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          const SliverToBoxAdapter(child: ZumaGreca()),
          SliverFillRemaining(
            hasScrollBody: false,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('SENDERO SAGRADO', style: ZumaTypography.title),
                  const SizedBox(height: 16),
                  Text(
                    '¡Bienvenido, ${user?.nickname ?? 'cazador'}!',
                    style: ZumaTypography.body,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Rol: ${user?.role.label ?? '—'}  ·  ${user?.email ?? ''}',
                    style: ZumaTypography.caption,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 32),
                  Text(
                    'El mapa del Sendero y la NavBar llegarán con la siguiente '
                    'pantalla de diseño.',
                    style: ZumaTypography.caption.copyWith(color: ZumaColors.grisLosa),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 32),
                  TextButton(
                    onPressed: () => ref.read(authControllerProvider.notifier).logout(),
                    child: Text(
                      'CERRAR SESIÓN',
                      style: ZumaTypography.label.copyWith(color: ZumaColors.rojoVivo),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SliverToBoxAdapter(child: ZumaGreca()),
        ],
      ),
    );
  }
}
