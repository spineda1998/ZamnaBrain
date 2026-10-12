import 'user.dart';

/// Sesión autenticada (openapi AuthResponse).
class Session {
  const Session({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
  });

  final String accessToken;
  final String refreshToken;
  final User user;

  factory Session.fromJson(Map<String, dynamic> json) => Session(
    accessToken: json['accessToken'] as String,
    refreshToken: json['refreshToken'] as String,
    user: User.fromJson(json['user'] as Map<String, dynamic>),
  );

  Map<String, dynamic> toJson() => {
    'accessToken': accessToken,
    'refreshToken': refreshToken,
    'user': user.toJson(),
  };

  Session copyWith({User? user, String? accessToken}) => Session(
    accessToken: accessToken ?? this.accessToken,
    refreshToken: refreshToken,
    user: user ?? this.user,
  );
}
