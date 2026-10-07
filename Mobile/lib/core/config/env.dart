import 'package:flutter/foundation.dart';

/// Where the website (and its `/api` routes) lives.
///
///   flutter run --dart-define=API_BASE_URL=https://setabase.com
///
/// Without a define, release builds use the production site and debug builds talk to
/// `next dev` on this computer — through 10.0.2.2 from the Android emulator.
abstract final class Env {
  static const production = 'https://setabase.com';
  static const _defined = String.fromEnvironment('API_BASE_URL');

  static String get apiBaseUrl {
    if (_defined.isNotEmpty) return _defined;
    if (kReleaseMode) return production;
    return defaultTargetPlatform == TargetPlatform.android ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
  }
}
