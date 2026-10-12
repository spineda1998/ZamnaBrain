import 'package:dio/dio.dart';
import 'api_config.dart';

/// Cliente HTTP delgado sobre Dio. Adjunta el Bearer token si está presente.
class ApiClient {
  ApiClient({Dio? dio})
    : dio =
          dio ??
          Dio(
            BaseOptions(
              baseUrl: ApiConfig.baseUrl,
              connectTimeout: const Duration(seconds: 8),
              receiveTimeout: const Duration(seconds: 12),
              contentType: Headers.jsonContentType,
              responseType: ResponseType.json,
            ),
          ) {
    this.dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final token = accessToken;
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
      ),
    );
  }

  final Dio dio;

  /// Token de acceso en memoria (lo gestiona el repositorio de auth).
  String? accessToken;
}
