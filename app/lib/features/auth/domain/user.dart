/// Roles del sistema (GDD §3, openapi Role).
enum Role {
  student,
  teacher;

  static Role fromWire(String value) =>
      value == 'teacher' ? Role.teacher : Role.student;

  String get wire => name;

  String get label => switch (this) {
    Role.student => 'Alumno',
    Role.teacher => 'Profesor',
  };
}

/// Usuario (openapi User).
class User {
  const User({
    required this.id,
    required this.email,
    required this.nickname,
    required this.role,
  });

  final String id;
  final String email;
  final String nickname;
  final Role role;

  factory User.fromJson(Map<String, dynamic> json) => User(
    id: json['id'] as String,
    email: json['email'] as String,
    nickname: json['nickname'] as String,
    role: Role.fromWire(json['role'] as String? ?? 'student'),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'email': email,
    'nickname': nickname,
    'role': role.wire,
  };
}
