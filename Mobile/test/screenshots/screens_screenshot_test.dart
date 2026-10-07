// Renders the main screens at iPhone 15 size with the real fonts and images, for checking
// against the Figma frames. Off by default; to write design/screenshots/*.png:
//
//   flutter test --dart-define=SCREENSHOTS=true --update-goldens test/screenshots

import 'dart:convert';
import 'dart:io';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:material_ui/material_ui.dart';
import 'package:setabase/app/app.dart';
import 'package:setabase/app/router.dart';
import 'package:setabase/data/models/content.dart';
import 'package:setabase/data/providers.dart';
import 'package:setabase/features/contact/submission.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _enabled = bool.fromEnvironment('SCREENSHOTS');

void main() {
  late AppContent content;

  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
    content = AppContent.fromJson(jsonDecode(File('assets/content/content.json').readAsStringSync()) as Json);
  });

  Future<void> advance(WidgetTester tester, [Duration duration = const Duration(seconds: 3)]) async {
    for (var t = Duration.zero; t < duration; t += const Duration(milliseconds: 50)) {
      await tester.pump(const Duration(milliseconds: 50));
    }
  }

  Future<void> loadImages(WidgetTester tester) async {
    await tester.runAsync(() async {
      for (final element in find.byType(Image).evaluate()) {
        await precacheImage((element.widget as Image).image, element);
      }
      await GoogleFonts.pendingFonts();
    });
    await advance(tester, const Duration(milliseconds: 300));
  }

  Future<ProviderContainer> start(WidgetTester tester, Audience? audience) async {
    SharedPreferences.setMockInitialValues({'audience': ?audience?.key});
    final container = ProviderContainer(
      overrides: [
        sharedPreferencesProvider.overrideWithValue(await SharedPreferences.getInstance()),
        contentProvider.overrideWithValue(content),
      ],
    );
    addTearDown(container.dispose);
    tester.view.physicalSize = const Size(390 * 2, 844 * 2);
    tester.view.devicePixelRatio = 2;
    tester.view.padding = const FakeViewPadding(top: 54 * 2, bottom: 34 * 2);
    addTearDown(tester.view.reset);
    await tester.pumpWidget(UncontrolledProviderScope(container: container, child: const SetabaseApp()));
    await advance(tester);
    return container;
  }

  Future<void> shoot(WidgetTester tester, String name) async {
    await loadImages(tester);
    await expectLater(find.byType(SetabaseApp), matchesGoldenFile('../../design/screenshots/$name.png'));
  }

  final shots = <String, Future<void> Function(WidgetTester)>{
    '01-welcome': (t) async {
      await start(t, null);
      await shoot(t, '01-welcome');
    },
    '02-audience': (t) async {
      final c = await start(t, null);
      c.read(routerProvider).go(Routes.audience);
      await advance(t);
      await shoot(t, '02-audience');
    },
    '04-home-private': (t) async {
      await start(t, Audience.private);
      await shoot(t, '04-home-private');
    },
    '05-home-business': (t) async {
      await start(t, Audience.business);
      await shoot(t, '05-home-business');
    },
    '06-services-private': (t) async {
      final c = await start(t, Audience.private);
      c.read(routerProvider).go(Routes.services);
      await advance(t);
      await shoot(t, '06-services-private');
    },
    '07-services-business': (t) async {
      final c = await start(t, Audience.business);
      c.read(routerProvider).go(Routes.services);
      await advance(t);
      await shoot(t, '07-services-business');
    },
    '08-detail-property-management': (t) async {
      final c = await start(t, Audience.private);
      c.read(routerProvider).go(Routes.service(ServiceId.propertyManagement));
      await advance(t);
      await shoot(t, '08-detail-property-management');
    },
    '09-guide': (t) async {
      final c = await start(t, Audience.private);
      c.read(routerProvider).go(Routes.guide);
      await advance(t);
      await shoot(t, '09-guide');
    },
    '10-request-quote': (t) async {
      final c = await start(t, Audience.private);
      c.read(routerProvider).go(Routes.contactAbout(ServiceId.propertyManagement));
      await advance(t);
      await shoot(t, '10-request-quote');
    },
    '11-request-sent': (t) async {
      final c = await start(t, Audience.business);
      c
          .read(routerProvider)
          .go(
            Routes.sent,
            extra: const SentDetails(
              name: 'Sara Ahmed',
              service: 'Special Services',
              email: 'sara@example.com',
              reference: '12AB34CD',
            ),
          );
      await advance(t);
      await shoot(t, '11-request-sent');
    },
    '12-relocation-planner': (t) async {
      final c = await start(t, Audience.business);
      c.read(routerProvider).go(Routes.relocation);
      await advance(t);
      await shoot(t, '12-relocation-planner');
    },
    '13-special-services': (t) async {
      final c = await start(t, Audience.business);
      c.read(routerProvider).go(Routes.specialServices);
      await advance(t);
      await shoot(t, '13-special-services');
    },
  };

  for (final MapEntry(key: name, value: run) in shots.entries) {
    testWidgets(name, run, skip: !_enabled, variant: TargetPlatformVariant.only(TargetPlatform.iOS));
  }
}
