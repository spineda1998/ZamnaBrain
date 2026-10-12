import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/application/auth_controller.dart';
import '../../features/auth/presentation/login_page.dart';
import '../../features/shell/presentation/home_shell.dart';

/// Router con guard de autenticación (SDD §2: rutas por rol).
final routerProvider = Provider<GoRouter>((ref) {
  final refresh = ValueNotifier<int>(0);
  ref.listen(authControllerProvider, (_, _) => refresh.value++);
  ref.onDispose(refresh.dispose);

  return GoRouter(
    initialLocation: '/login',
    refreshListenable: refresh,
    redirect: (context, state) {
      final authenticated = ref.read(authControllerProvider).isAuthenticated;
      final atLogin = state.matchedLocation == '/login';
      if (authenticated) return atLogin ? '/sendero' : null;
      return atLogin ? null : '/login';
    },
    routes: [
      GoRoute(path: '/login', builder: (_, _) => const LoginPage()),
      GoRoute(path: '/sendero', builder: (_, _) => const HomeShell()),
    ],
  );
});
