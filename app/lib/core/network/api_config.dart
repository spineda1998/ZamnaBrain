import 'package:flutter/foundation.dart';

/// Configuración del API. En sandbox apunta al backend local en `:8090`.
/// Se puede sobreescribir con `--dart-define=API_BASE=...`.
abstract final class ApiConfig {
  static const _override = String.fromEnvironment('API_BASE');

  static String get baseUrl {
    if (_override.isNotEmpty) return _override;
    if (kIsWeb) return 'http://127.0.0.1:8090/v1';
    switch (defaultTargetPlatform) {
      // El emulador Android mapea el host a 10.0.2.2.
      case TargetPlatform.android:
        return 'http://10.0.2.2:8090/v1';
      default:
        return 'http://127.0.0.1:8090/v1';
    }
  }
}
