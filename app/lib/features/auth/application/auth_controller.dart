import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_exception.dart';
import '../data/auth_repository.dart';
import '../domain/session.dart';
import '../domain/user.dart';

/// Providers base del módulo auth.
final apiClientProvider = Provider<ApiClient>((ref) => ApiClient());
final authRepositoryProvider = Provider<AuthRepository>(
  (ref) => AuthRepository(ref.watch(apiClientProvider)),
);

enum AuthStatus { unknown, restoring, unauthenticated, authenticated }

class AuthState {
  const AuthState({
    required this.status,
    this.session,
    this.error,
    this.submitting = false,
  });

  final AuthStatus status;
  final Session? session;
  final String? error;
  final bool submitting;

  bool get isAuthenticated => status == AuthStatus.authenticated;
  User? get user => session?.user;

  AuthState withStatus(AuthStatus status) =>
      AuthState(status: status, session: session, error: error, submitting: submitting);
}

/// Controlador de sesión. Orquesta restauración (L4), login y logout.
class AuthController extends Notifier<AuthState> {
  @override
  AuthState build() => const AuthState(status: AuthStatus.unknown);

  AuthRepository get _repo => ref.read(authRepositoryProvider);

  /// Restaura la sesión persistida al arrancar (fase L4 remota).
  Future<void> bootstrap() async {
    state = state.withStatus(AuthStatus.restoring);
    final session = await _repo.restore();
    if (session == null) {
      state = const AuthState(status: AuthStatus.unauthenticated);
      return;
    }
    try {
      final me = await _repo.refreshProfile();
      state = AuthState(
        status: AuthStatus.authenticated,
        session: session.copyWith(user: me),
      );
    } on ApiException {
      await _repo.clear();
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
  }

  Future<bool> login(String email, String password) async {
    state = AuthState(status: state.status, session: state.session, submitting: true);
    try {
      final session = await _repo.login(email, password);
      state = AuthState(status: AuthStatus.authenticated, session: session);
      return true;
    } on ApiException catch (e) {
      state = AuthState(
        status: AuthStatus.unauthenticated,
        error: e.message,
        submitting: false,
      );
      return false;
    }
  }

  Future<void> register({
    required String email,
    required String password,
    required String nickname,
    Role role = Role.student,
  }) async {
    state = AuthState(status: state.status, session: state.session, submitting: true);
    try {
      final session = await _repo.register(
        email: email,
        password: password,
        nickname: nickname,
        role: role,
      );
      state = AuthState(status: AuthStatus.authenticated, session: session);
    } on ApiException catch (e) {
      state = AuthState(
        status: AuthStatus.unauthenticated,
        error: e.message,
        submitting: false,
      );
    }
  }

  Future<void> logout() async {
    await _repo.clear();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }

  void clearError() {
    state = AuthState(status: state.status, session: state.session);
  }
}

final authControllerProvider = NotifierProvider<AuthController, AuthState>(
  AuthController.new,
);
