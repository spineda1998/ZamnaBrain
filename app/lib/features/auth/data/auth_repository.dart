import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/network/api_client.dart';
import '../domain/session.dart';
import '../domain/user.dart';
import 'auth_api.dart';

/// Repositorio de autenticación: orquesta el API y la persistencia local
/// de la sesión (SDD §2: cache de sesión).
class AuthRepository {
  AuthRepository(this._client) : _api = AuthApi(_client.dio);

  final ApiClient _client;
  final AuthApi _api;

  static const _sessionKey = 'zuma.session';

  Future<Session> login(String email, String password) async {
    final session = await _api.login(email, password);
    await _store(session);
    return session;
  }

  Future<Session> register({
    required String email,
    required String password,
    required String nickname,
    required Role role,
  }) async {
    final session = await _api.register(
      email: email,
      password: password,
      nickname: nickname,
      role: role,
    );
    await _store(session);
    return session;
  }

  /// Recupera la sesión persistida (fase L4 de hidratación).
  Future<Session?> restore() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_sessionKey);
    if (raw == null) return null;
    try {
      final session = Session.fromJson(jsonDecode(raw) as Map<String, dynamic>);
      _client.accessToken = session.accessToken;
      return session;
    } catch (_) {
      await prefs.remove(_sessionKey);
      return null;
    }
  }

  Future<User> refreshProfile() => _api.me();

  Future<void> clear() async {
    _client.accessToken = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_sessionKey);
  }

  Future<void> _store(Session session) async {
    _client.accessToken = session.accessToken;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_sessionKey, jsonEncode(session.toJson()));
  }
}
