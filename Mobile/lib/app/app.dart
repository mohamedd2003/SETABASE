import 'package:flutter/foundation.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/static/app_copy.dart';
import 'router.dart';
import 'theme.dart';

class SetabaseApp extends ConsumerWidget {
  const SetabaseApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) => MaterialApp.router(
    title: AppCopy.appName,
    debugShowCheckedModeBanner: false,
    theme: buildTheme(defaultTargetPlatform),
    routerConfig: ref.watch(routerProvider),
  );
}
