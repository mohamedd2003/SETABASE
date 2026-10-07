import 'dart:convert';
import 'dart:io';

import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:setabase/app/app.dart';
import 'package:setabase/data/models/content.dart';
import 'package:setabase/data/providers.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  late AppContent content;

  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
    content = AppContent.fromJson(jsonDecode(File('assets/content/content.json').readAsStringSync()) as Json);
  });

  /// Runs frames for [duration] — routing resolves a frame later and transitions animate.
  Future<void> advance(WidgetTester tester, [Duration duration = const Duration(seconds: 1)]) async {
    for (var t = Duration.zero; t < duration; t += const Duration(milliseconds: 50)) {
      await tester.pump(const Duration(milliseconds: 50));
    }
  }

  Future<ProviderContainer> pumpApp(WidgetTester tester, {Map<String, Object> prefs = const {}}) async {
    SharedPreferences.setMockInitialValues(prefs);
    final sharedPrefs = await SharedPreferences.getInstance();
    final container = ProviderContainer(
      overrides: [sharedPreferencesProvider.overrideWithValue(sharedPrefs), contentProvider.overrideWithValue(content)],
    );
    addTearDown(container.dispose);
    tester.view.physicalSize = const Size(390 * 3, 844 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(UncontrolledProviderScope(container: container, child: const SetabaseApp()));
    await advance(tester, const Duration(seconds: 3));
    return container;
  }

  testWidgets('first launch asks who we are looking after, then remembers it', (tester) async {
    final container = await pumpApp(tester);

    expect(find.text('Get started'.toUpperCase()), findsOneWidget);
    await tester.ensureVisible(find.text('Get started'.toUpperCase()));
    await tester.tap(find.text('Get started'.toUpperCase()));
    await advance(tester);

    expect(find.text(content.landing.title), findsOneWidget);
    expect(find.textContaining('Step'), findsNothing, reason: 'No questionnaire feeling (feedback round 1)');

    await tester.tap(find.text('Business'));
    await advance(tester);
    await tester.ensureVisible(find.text('Continue'.toUpperCase()));
    await advance(tester, const Duration(milliseconds: 300));
    await tester.tap(find.text('Continue'.toUpperCase()));
    await advance(tester, const Duration(seconds: 2));

    expect(container.read(audienceChoiceProvider), Audience.business);
    expect(find.text(content.page(Audience.business).hero.title), findsOneWidget);
    expect(find.text('Guide'), findsWidgets);
  });

  testWidgets('a remembered audience opens straight on Home', (tester) async {
    await pumpApp(tester, prefs: {'audience': 'private'});
    expect(find.text(content.page(Audience.private).hero.title), findsOneWidget);
  });
}
