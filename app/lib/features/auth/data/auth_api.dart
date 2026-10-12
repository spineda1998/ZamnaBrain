import 'package:dio/dio.dart';
import '../../../core/network/api_exception.dart';
import '../domain/session.dart';
import '../domain/user.dart';

/// Llamadas HTTP crudas al dominio Auth/Users (openapi.yaml).
class AuthApi {
  AuthApi(this._dio);
  final Dio _dio;

  Future<Session> login(String email, String password) => _guard(() async {
    final res = await _dio.post<Map<String, dynamic>>(
      '/auth/login',
      data: {'email': email, 'password': password},
    );
    return Session.fromJson(res.data!);
  });

  Future<Session> register({
    required String email,
    required String password,
    required String nickname,
    required Role role,
  }) => _guard(() async {
    final res = await _dio.post<Map<String, dynamic>>(
      '/auth/register',
      data: {
        'email': email,
        'password': password,
        'nickname': nickname,
        'role': role.wire,
      },
    );
    return Session.fromJson(res.data!);
  });

  Future<User> me() => _guard(() async {
    final res = await _dio.get<Map<String, dynamic>>('/users/me');
    return User.fromJson(res.data!);
  });

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }
}
