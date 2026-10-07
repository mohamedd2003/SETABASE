// The app's ports of the website's catalog and pricing code must give the website's exact
// answers — `/api/requests` rejects ids that don't match. Fixtures come from running the
// website's own functions: `node tool/export_parity_fixtures.mjs`.

import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:setabase/core/utils/format.dart';
import 'package:setabase/core/utils/slugify.dart';
import 'package:setabase/data/catalog/catalog_mapper.dart';
import 'package:setabase/data/models/catalog.dart';
import 'package:setabase/data/pricing/special_services_pricing.dart';

void main() {
  final fixtures = jsonDecode(File('test/fixtures/web_parity.json').readAsStringSync()) as Map<String, dynamic>;
  List<Map<String, dynamic>> list(String key) => (fixtures[key] as List).cast<Map<String, dynamic>>();

  final offers = [for (final o in list('offers')) SpecialOffer.tryParse(o)!];
  final catalog = toSpecialServicesCatalog(offers);

  test('slugify matches the website', () {
    for (final c in list('slugify')) {
      expect(slugify(c['input'] as String), c['output'], reason: c['input'] as String);
    }
  });

  test('splitFeature matches the website', () {
    for (final c in list('splitFeature')) {
      final out = c['output'] as Map<String, dynamic>;
      final item = splitFeature(c['input'] as String);
      expect(item.label, out['label']);
      expect(item.detail, out['detail']);
    }
  });

  test('formatEgp matches the website', () {
    for (final c in list('formatEgp')) {
      expect(formatEgp(c['input'] as num), c['output']);
    }
  });

  test('Special Services catalog derivation matches', () {
    final web = fixtures['specialServicesCatalog'] as Map<String, dynamic>;

    final flex = (web['flexItems'] as List).cast<Map<String, dynamic>>();
    expect(catalog.flexItems.map((f) => f.id), flex.map((f) => f['id']));
    for (final (i, f) in catalog.flexItems.indexed) {
      expect(f.label, flex[i]['label']);
      expect(f.frequency, flex[i]['frequency']);
      expect(f.price, flex[i]['price']);
      expect(f.unit.key, flex[i]['unit']);
    }

    final fixed = (web['fixedPackages'] as List).cast<Map<String, dynamic>>();
    expect(catalog.fixedPackages.map((p) => p.id), fixed.map((p) => p['id']));
    for (final (i, p) in catalog.fixedPackages.indexed) {
      expect(p.title, fixed[i]['title']);
      expect(p.kicker, fixed[i]['kicker']);
      expect(p.perEmployee, fixed[i]['perEmployee']);
      expect(p.items.map((x) => x.flexId), (fixed[i]['items'] as List).map((x) => (x as Map)['flexId']));
    }

    final groups = (web['eventGroups'] as List).cast<Map<String, dynamic>>();
    expect(catalog.eventGroups.map((g) => g.id), groups.map((g) => g['id']));
    for (final (i, g) in catalog.eventGroups.indexed) {
      expect(g.ideas.map((e) => e.id), (groups[i]['ideas'] as List).map((e) => (e as Map)['id']));
      expect(g.ideas.map((e) => e.price), (groups[i]['ideas'] as List).map((e) => (e as Map)['price']));
    }
    expect(catalog.flexMinItems, web['flexMinItems']);
  });

  test('Relocation catalog derivation matches', () {
    final packages = [for (final p in list('relocationPackages')) RelocationPackage.tryParse(p)!];
    final ours = toRelocationCatalog(packages);
    final web = fixtures['relocationCatalog'] as Map<String, dynamic>;

    final stages = (web['stages'] as List).cast<Map<String, dynamic>>();
    expect(ours.stages.map((s) => s.id), stages.map((s) => s['id']));
    for (final (i, s) in ours.stages.indexed) {
      expect(s.key.key, stages[i]['key']);
      expect(s.when, stages[i]['when']);
      expect(s.items.map((x) => x.label), (stages[i]['items'] as List).map((x) => (x as Map)['label']));
      expect(s.items.map((x) => x.detail), (stages[i]['items'] as List).map((x) => (x as Map)['detail']));
    }
    final options = (web['options'] as List).cast<Map<String, dynamic>>();
    expect(ours.options.map((o) => o.id), options.map((o) => o['id']));
    expect(ours.options.map((o) => o.label), options.map((o) => o['label']));
  });

  test('estimates match the website for every case', () {
    for (final c in list('estimates')) {
      final s = c['selection'] as Map<String, dynamic>;
      final want = c['estimate'] as Map<String, dynamic>;
      final got = estimateSpecialServices(
        SpecialServicesSelection(
          employees: s['employees'] as num,
          packages: {...(s['packages'] as List).cast<String>()},
          flexItems: {...(s['flexItems'] as List).cast<String>()},
        ),
        catalog,
      );
      final reason = jsonEncode(s);
      expect(got.subtotal, want['subtotal'], reason: reason);
      expect(got.bundleDiscount, want['bundleDiscount'], reason: reason);
      expect(got.volumeDiscount, want['volumeDiscount'], reason: reason);
      expect(got.volumeRate, want['volumeRate'], reason: reason);
      expect(got.monthly, want['monthly'], reason: reason);
      expect(got.perHire, want['perHire'], reason: reason);
      expect(got.packageCount, want['packageCount'], reason: reason);
      expect(got.flexShortBy, want['flexShortBy'], reason: reason);
    }
  });
}
