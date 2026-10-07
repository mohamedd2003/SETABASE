import 'dart:convert';

import 'package:material_ui/material_ui.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'app/app.dart';
import 'data/models/content.dart';
import 'data/providers.dart';
import 'design_system/tokens.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      statusBarBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.transparent,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  final (prefs, raw) = await (
    SharedPreferences.getInstance(),
    rootBundle.loadString('assets/content/content.json'),
  ).wait;
  final content = AppContent.fromJson(jsonDecode(raw) as Json);

  // Newsreader and IBM Plex Sans ship in assets/google_fonts, so the brand type shows on the
  // first launch even offline. Any other weight is fetched once and cached.
  GoogleFonts.config.allowRuntimeFetching = true;
  LicenseRegistry.addLicense(() async* {
    for (final family in ['Newsreader', 'IBMPlexSans']) {
      final text = await rootBundle.loadString('assets/google_fonts/OFL-$family.txt');
      yield LicenseEntryWithLineBreaks([family], text);
    }
  });

  // Fonts load from assets in milliseconds; waiting avoids a first frame in a fallback font.
  SetaType.preload();
  await GoogleFonts.pendingFonts().timeout(const Duration(seconds: 2), onTimeout: () => const []);

  runApp(
    ProviderScope(
      overrides: [sharedPreferencesProvider.overrideWithValue(prefs), contentProvider.overrideWithValue(content)],
      child: const SetabaseApp(),
    ),
  );
}
