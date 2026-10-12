import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/hydration/hydration.dart';
import '../../../core/theme/zuma_colors.dart';
import '../../../core/theme/zuma_typography.dart';
import '../../../core/widgets/zuma_arcade_button.dart';
import '../../../core/widgets/zuma_codex_panel.dart';
import '../../../core/widgets/zuma_greca.dart';
import '../../../core/widgets/zuma_rune_icon.dart';
import '../../../core/widgets/zuma_skeleton.dart';
import '../../../core/widgets/zuma_text_field.dart';
import '../application/auth_controller.dart';

/// Pantalla 1 — Login (códice de acceso), con hidratación progresiva (SDD §8):
/// L0 shell → L1 layout → L2 crítico → L3 media → L4 remoto.
class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _hydration = HydrationController();
  final _email = TextEditingController(text: 'balam@zuma.dev'); // demo sandbox
  final _password = TextEditingController(text: 'zuma1234'); // demo sandbox
  final _passwordFocus = FocusNode();

  @override
  void initState() {
    super.initState();
    // L1→L3 se encadenan con pequeños retardos para hacer visible el proceso.
    _hydration.runSequential(step: const Duration(milliseconds: 90));
    _restoreSession(); // L4 (remoto)
  }

  Future<void> _restoreSession() async {
    await Future.delayed(const Duration(milliseconds: 360));
    if (!mounted) return;
    final auth = ref.read(authControllerProvider);
    if (auth.status == AuthStatus.unknown) {
      await ref.read(authControllerProvider.notifier).bootstrap();
    }
    if (!mounted) return;
    _hydration.advanceTo(HydrationLevel.l4Remote);
  }

  @override
  void dispose() {
    _hydration.dispose();
    _email.dispose();
    _password.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final email = _email.text.trim();
    final password = _password.text;
    if (email.isEmpty || password.isEmpty) return;
    await ref.read(authControllerProvider.notifier).login(email, password);
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authControllerProvider);

    // Si la sesión cambia (p.ej. login falla), completamos la hidratación remota.
    ref.listen(authControllerProvider, (_, next) {
      if (next.status == AuthStatus.unauthenticated) {
        _hydration.advanceTo(HydrationLevel.l4Remote);
      }
    });

    return Scaffold(
      backgroundColor: ZumaColors.fondo,
      body: Stack(
        children: [
          Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 440),
              child: AnimatedBuilder(
                animation: _hydration,
                builder: (context, _) => _buildCanvas(auth),
              ),
            ),
          ),
          const Positioned(top: 0, left: 0, right: 0, child: ZumaGreca()),
          const Positioned(bottom: 0, left: 0, right: 0, child: ZumaGreca()),
        ],
      ),
    );
  }

  Widget _buildCanvas(AuthState auth) {
    final h = _hydration;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 41),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _mascot(h),
          const SizedBox(height: 18),
          if (h.reached(HydrationLevel.l1Layout))
            ZumaCodexPanel(
              width: double.infinity,
              child: h.reached(HydrationLevel.l2Critical)
                  ? _form(auth)
                  : _formSkeleton(),
            ),
        ],
      ),
    );
  }

  /// Mascota "Deity Axolotl": placeholder vacío con glow (imagen oficial pendiente).
  Widget _mascot(HydrationController h) {
    return Center(
      child: h.reached(HydrationLevel.l3Heavy)
          ? Container(
              width: 168,
              height: 168,
              decoration: BoxDecoration(
                boxShadow: [
                  BoxShadow(
                    color: ZumaColors.glowAxolotlPlaceholder.withValues(alpha: 0.35),
                    blurRadius: 7,
                  ),
                ],
              ),
            )
          : const ZumaSkeleton(width: 168, height: 168),
    );
  }

  Widget _formSkeleton() {
    return Column(
      children: const [
        ZumaSkeleton(height: 60),
        SizedBox(height: 12),
        ZumaSkeleton(height: 60),
        SizedBox(height: 12),
        ZumaSkeleton(height: 41),
      ],
    );
  }

  Widget _form(AuthState auth) {
    final submitting = auth.submitting;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ZumaTextField(
          label: 'Correo electronico',
          controller: _email,
          labelColor: ZumaColors.oroLabelPlaceholder,
          borderColor: ZumaColors.rojoBordePlaceholder,
          leading: const ZumaRuneIcon(),
          hint: 'BALAM@gmail.com',
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.next,
          onSubmitted: (_) => _passwordFocus.requestFocus(),
        ),
        const SizedBox(height: 12),
        ZumaTextField(
          label: 'contraseña',
          controller: _password,
          labelColor: ZumaColors.miel,
          borderColor: ZumaColors.oroClaro,
          leading: const Icon(Icons.lock, size: 11, color: ZumaColors.oroClaro),
          hint: '••••••••••',
          obscure: true,
          focusNode: _passwordFocus,
          textInputAction: TextInputAction.done,
          onSubmitted: (_) => _submit(),
        ),
        const SizedBox(height: 12),
        ZumaArcadeButton(
          label: 'INICIAR SESIÓN',
          isLoading: submitting,
          onPressed: submitting ? null : _submit,
        ),
        if (auth.error != null) ...[
          const SizedBox(height: 12),
          Text(
            auth.error!,
            style: ZumaTypography.caption.copyWith(color: ZumaColors.rojoVivo),
            textAlign: TextAlign.center,
          ),
        ],
        const SizedBox(height: 8),
        _hydrationBadge(),
      ],
    );
  }

  Widget _hydrationBadge() {
    final level = _hydration.level;
    final name = switch (level) {
      HydrationLevel.l0Shell => 'L0 shell',
      HydrationLevel.l1Layout => 'L1 layout',
      HydrationLevel.l2Critical => 'L2 crítico',
      HydrationLevel.l3Heavy => 'L3 media',
      HydrationLevel.l4Remote => 'L4 remoto',
    };
    return Text(
      'hidratación: $name',
      style: ZumaTypography.caption.copyWith(
        fontFamily: ZumaTypography.silk,
        fontSize: 10,
        color: ZumaColors.grisLosa,
      ),
      textAlign: TextAlign.center,
    );
  }
}
