// Every screen, for both audiences, built and scrolled end to end — layout errors only show
// up when a screen is actually laid out. Network calls fail in tests, so the planners run on
// the bundled catalog; requests go to a fake.

import 'dart:convert';
import 'dart:io';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:material_ui/material_ui.dart';
import 'package:setabase/app/app.dart';
import 'package:setabase/app/router.dart';
import 'package:setabase/core/api/api_client.dart';
import 'package:setabase/data/models/content.dart';
import 'package:setabase/data/models/requests.dart';
import 'package:setabase/data/providers.dart';
import 'package:setabase/data/repositories/request_repository.dart';
import 'package:shared_preferences/shared_preferences.dart';

class FakeRequests extends RequestRepository {
  FakeRequests() : super(ApiClient.create('http://localhost'));

  final sent = <Object>[];

  @override
  Future<void> sendContact(ContactRequest request) async => sent.add(request);

  @override
  Future<String?> sendSpecialServices(SpecialServicesRequest request) async {
    sent.add(request);
    return '652f1c0e9b1e8a0012ab34cd';
  }

  @override
  Future<String?> sendRelocation(RelocationRequest request) async {
    sent.add(request);
    return '652f1c0e9b1e8a0012ab34cd';
  }
}

void main() {
  late AppContent content;

  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
    content = AppContent.fromJson(jsonDecode(File('assets/content/content.json').readAsStringSync()) as Json);
  });

  Future<void> advance(WidgetTester tester, [Duration duration = const Duration(milliseconds: 800)]) async {
    for (var t = Duration.zero; t < duration; t += const Duration(milliseconds: 50)) {
      await tester.pump(const Duration(milliseconds: 50));
    }
  }

  Future<(ProviderContainer, FakeRequests)> start(WidgetTester tester, Audience audience) async {
    SharedPreferences.setMockInitialValues({'audience': audience.key});
    final requests = FakeRequests();
    final container = ProviderContainer(
      overrides: [
        sharedPreferencesProvider.overrideWithValue(await SharedPreferences.getInstance()),
        contentProvider.overrideWithValue(content),
        requestRepositoryProvider.overrideWithValue(requests),
      ],
    );
    addTearDown(container.dispose);
    tester.view.physicalSize = const Size(390 * 3, 844 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(UncontrolledProviderScope(container: container, child: const SetabaseApp()));
    await advance(tester, const Duration(seconds: 2));
    return (container, requests);
  }

  Future<void> reveal(WidgetTester tester, Finder target, {double step = 300}) async {
    if (target.evaluate().isEmpty) {
      // Lazily built lists: look below first, then above.
      for (var i = 0; i < 12 && target.evaluate().isEmpty; i++) {
        await tester.drag(find.byType(Scrollable).first, Offset(0, -step));
        await advance(tester, const Duration(milliseconds: 150));
      }
      for (var i = 0; i < 24 && target.evaluate().isEmpty; i++) {
        await tester.drag(find.byType(Scrollable).first, Offset(0, step));
        await advance(tester, const Duration(milliseconds: 150));
      }
    }
    await tester.ensureVisible(target);
    await advance(tester, const Duration(milliseconds: 300));
  }

  /// Scrolls the screen's main list to the end, building every part of it.
  Future<void> scrollThrough(WidgetTester tester) async {
    final scrollables = find.byType(Scrollable);
    if (scrollables.evaluate().isEmpty) return;
    for (var i = 0; i < 14; i++) {
      await tester.drag(scrollables.first, const Offset(0, -600), warnIfMissed: false);
      await advance(tester, const Duration(milliseconds: 200));
    }
  }

  for (final audience in Audience.values) {
    testWidgets('every screen lays out for ${audience.key}', (tester) async {
      final (container, _) = await start(tester, audience);
      final router = container.read(routerProvider);
      final routes = [
        Routes.home,
        Routes.services,
        Routes.guide,
        Routes.contact,
        for (final d in content.page(audience).departments) Routes.service(d.id),
        Routes.relocation,
        Routes.specialServices,
      ];
      for (final route in routes) {
        router.go(route);
        await advance(tester);
        expect(tester.takeException(), isNull, reason: 'opening $route');
        await scrollThrough(tester);
        expect(tester.takeException(), isNull, reason: 'scrolling $route');
      }
    });
  }

  testWidgets('Special Services: a package shows its estimate', (tester) async {
    final (container, _) = await start(tester, Audience.business);
    container.read(routerProvider).go(Routes.specialServices);
    await advance(tester);

    for (var i = 0; i < 20 && find.text('ADD').evaluate().isEmpty; i++) {
      await tester.drag(find.byType(Scrollable).first, const Offset(0, -300));
      await advance(tester, const Duration(milliseconds: 200));
    }
    await tester.ensureVisible(find.text('ADD').first);
    await advance(tester, const Duration(milliseconds: 300));
    await tester.tap(find.text('ADD').first);
    await advance(tester);

    // Essential Delivery (first package) for the default 20 employees: 1,110 × 20.
    expect(find.text('1 chosen'), findsOneWidget);
    expect(find.text('About 22,200 EGP a month'), findsOneWidget);
  });

  testWidgets('Request a quote sends to the API and thanks by first name', (tester) async {
    final (container, requests) = await start(tester, Audience.private);
    container.read(routerProvider).go('${Routes.contact}?interest=property-management');
    await advance(tester);

    Finder field(String hint) => find.widgetWithText(TextField, hint);
    await tester.enterText(field('Your full name'), 'Sara Ahmed');
    await tester.enterText(field('you@email.com'), 'sara@example.com');
    await reveal(tester, field('Tell us a little about what you need'));
    await tester.enterText(
      field('Tell us a little about what you need'),
      'A 3-bedroom apartment in Fifth Settlement — I need a tenant.',
    );
    final send = find.text('SEND REQUEST');
    await reveal(tester, send);
    await tester.tap(send);
    await advance(tester, const Duration(seconds: 1));

    expect(
      requests.sent.single,
      isA<ContactRequest>().having((r) => r.interest, 'interest', ServiceId.propertyManagement),
    );
    expect(find.text('Thank you, Sara.'), findsOneWidget);
    expect(container.read(routerProvider).routerDelegate.currentConfiguration.uri.path, Routes.sent);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Request a quote explains what is missing before sending', (tester) async {
    final (container, requests) = await start(tester, Audience.private);
    container.read(routerProvider).go(Routes.contact);
    await advance(tester);

    final send = find.text('SEND REQUEST');
    await reveal(tester, send);
    await tester.tap(send);
    await advance(tester);

    expect(requests.sent, isEmpty);
    expect(find.text('Some fields need a second look.'), findsOneWidget);
    await reveal(tester, find.text('Enter your full name.'));
    expect(find.text('Enter your full name.'), findsOneWidget);
    expect(find.text("Choose what you're interested in."), findsOneWidget);
  });
}
