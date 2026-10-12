import 'package:dio/dio.dart';

/// Error de dominio normalizado a partir de la respuesta `Error` del API
/// (`{ code, message }`).
class ApiException implements Exception {
  ApiException({required this.code, required this.message, this.statusCode});

  final String code;
  final String message;
  final int? statusCode;

  factory ApiException.fromDio(DioException e) {
    final data = e.response?.data;
    if (data is Map && data['code'] is String) {
      return ApiException(
        code: data['code'] as String,
        message: (data['message'] as String?) ?? 'Error desconocido',
        statusCode: e.response?.statusCode,
      );
    }
    final status = e.response?.statusCode;
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.connectionError) {
      return ApiException(
        code: 'NETWORK',
        message: 'No se pudo conectar con el servidor (¿está corriendo en :8090?).',
        statusCode: status,
      );
    }
    return ApiException(
      code: 'HTTP_${status ?? 'UNKNOWN'}',
      message: 'Error de red (${status ?? e.type.name}).',
      statusCode: status,
    );
  }

  @override
  String toString() => 'ApiException($code): $message';
}
