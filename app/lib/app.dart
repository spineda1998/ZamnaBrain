import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/navigation/router.dart';
import 'core/theme/zuma_theme.dart';

class ZumaApp extends ConsumerWidget {
  const ZumaApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    return MaterialApp.router(
      title: 'ZumaBrain',
      debugShowCheckedModeBanner: false,
      theme: ZumaTheme.dark,
      routerConfig: router,
    );
  }
}
