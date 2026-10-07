// Ports of `toSpecialServicesCatalog`, `toRelocationCatalog` and `splitFeature`
// (src/lib/catalog.ts). `/api/requests` checks every id against the same derivation,
// so these must stay in step with the website.

import '../../core/utils/slugify.dart';
import '../models/catalog.dart';

const flexMinItems = 5;

List<T> _activeSorted<T>(Iterable<T> all, bool Function(T) isActive, num Function(T) order) {
  final active = all.where(isActive).toList();
  // Dart's sort isn't stable; keep the server's order for equal sortOrder values.
  final indexed = active.indexed.toList()
    ..sort((a, b) {
      final byOrder = order(a.$2).compareTo(order(b.$2));
      return byOrder != 0 ? byOrder : a.$1.compareTo(b.$1);
    });
  return [for (final e in indexed) e.$2];
}

SpecialServicesCatalog toSpecialServicesCatalog(List<SpecialOffer> offers) {
  final active = _activeSorted(offers, (o) => o.isActive, (o) => o.sortOrder);

  final flexItems = [
    for (final o in active.where((o) => o.category == OfferCategory.flexible))
      for (final item in o.items)
        if (item.price != null && item.unit != null)
          FlexItem(
            id: slugify(item.name),
            label: item.name,
            frequency: item.frequency ?? '',
            price: item.price!,
            unit: item.unit!,
          ),
  ];
  final flexIds = {for (final f in flexItems) f.id};

  final fixedPackages = [
    for (final o in active)
      if ((o.category == OfferCategory.delivery || o.category == OfferCategory.services) && !o.priceOnRequest)
        FixedPackage(
          id: o.slug,
          title: o.title,
          kicker: '${o.category.label} package',
          summary: o.shortDescription,
          perEmployee: o.pricePerEmployee ?? 0,
          items: [
            for (final item in o.items)
              FixedPackageItem(
                name: item.name,
                frequency: item.frequency,
                flexId: flexIds.contains(slugify(item.name)) ? slugify(item.name) : null,
              ),
          ],
        ),
  ];

  final groups = <String, ({String id, String title, List<EventIdea> ideas})>{};
  for (final o in active.where((o) => o.category == OfferCategory.event)) {
    for (final item in o.items) {
      final trimmed = item.group?.trim() ?? '';
      final title = trimmed.isEmpty ? 'Events' : trimmed;
      final group = groups.putIfAbsent(title, () => (id: slugify(title), title: title, ideas: []));
      group.ideas.add(EventIdea(id: slugify(item.name), label: item.name, price: item.price ?? 0));
    }
  }

  return SpecialServicesCatalog(
    fixedPackages: fixedPackages,
    flexItems: flexItems,
    eventGroups: [for (final g in groups.values) EventGroup(id: g.id, title: g.title, ideas: g.ideas)],
    flexMinItems: flexMinItems,
  );
}

/// "Label — detail" → label and optional detail, split on the spaced em dash.
RelocationItem splitFeature(String feature) {
  final parts = feature.split(' — ');
  return RelocationItem(label: parts.first.trim(), detail: parts.length > 1 ? parts.skip(1).join(' — ').trim() : null);
}

RelocationCatalog toRelocationCatalog(List<RelocationPackage> packages) {
  final active = _activeSorted(packages, (p) => p.isActive, (p) => p.sortOrder);
  return RelocationCatalog(
    stages: [
      for (final p in active)
        if (p.stage != RelocationStageKey.options)
          RelocationStage(
            id: p.slug,
            key: p.stage,
            title: p.title,
            when: p.when ?? '',
            summary: p.shortDescription,
            items: [for (final f in p.features) splitFeature(f)],
          ),
    ],
    options: [
      for (final p in active)
        if (p.stage == RelocationStageKey.options)
          for (final f in p.features)
            RelocationOption(id: slugify(splitFeature(f).label), label: splitFeature(f).label),
    ],
  );
}
