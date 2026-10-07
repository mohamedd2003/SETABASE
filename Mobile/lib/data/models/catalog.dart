// The live catalog served by `GET /api/special-offers` and `GET /api/corporate-relocation`
// (src/lib/catalog.ts), and the planner shapes derived from it.

import 'content.dart' show Json;

enum OfferCategory {
  delivery('delivery', 'Delivery'),
  services('services', 'Services'),
  flexible('flexible', 'Flexible Pack'),
  event('event', 'Event Pack');

  const OfferCategory(this.key, this.label);
  final String key;
  final String label;

  static OfferCategory? fromKey(String? key) {
    for (final c in values) {
      if (c.key == key) return c;
    }
    return null;
  }
}

enum FlexUnit {
  employee('employee', 'per employee'),
  office('office', 'per office'),
  kit('kit', 'per new hire'),
  workshop('workshop', 'per workshop'),
  session('session', 'per session');

  const FlexUnit(this.key, this.label);
  final String key;
  final String label;

  static FlexUnit? fromKey(String? key) {
    for (final u in values) {
      if (u.key == key) return u;
    }
    return null;
  }
}

class OfferItem {
  const OfferItem({required this.name, this.frequency, this.group, this.price, this.unit});

  factory OfferItem.fromJson(Json json) => OfferItem(
    name: json['name'] as String,
    frequency: json['frequency'] as String?,
    group: json['group'] as String?,
    price: json['price'] as num?,
    unit: FlexUnit.fromKey(json['unit'] as String?),
  );

  final String name;
  final String? frequency;
  final String? group;
  final num? price;
  final FlexUnit? unit;
}

class SpecialOffer {
  const SpecialOffer({
    required this.title,
    required this.slug,
    required this.category,
    required this.shortDescription,
    required this.items,
    required this.pricePerEmployee,
    required this.priceOnRequest,
    required this.isActive,
    required this.sortOrder,
  });

  /// Returns null for an offer whose category this app doesn't know, so a new admin
  /// category can't break the planner.
  static SpecialOffer? tryParse(Json json) {
    final category = OfferCategory.fromKey(json['category'] as String?);
    if (category == null) return null;
    return SpecialOffer(
      title: json['title'] as String,
      slug: json['slug'] as String,
      category: category,
      shortDescription: json['shortDescription'] as String? ?? '',
      items: [for (final i in json['items'] as List? ?? const []) OfferItem.fromJson(i as Json)],
      pricePerEmployee: json['pricePerEmployee'] as num?,
      priceOnRequest: json['priceOnRequest'] as bool? ?? false,
      isActive: json['isActive'] as bool? ?? true,
      sortOrder: json['sortOrder'] as num? ?? 0,
    );
  }

  final String title;
  final String slug;
  final OfferCategory category;
  final String shortDescription;
  final List<OfferItem> items;
  final num? pricePerEmployee;
  final bool priceOnRequest;
  final bool isActive;
  final num sortOrder;
}

enum RelocationStageKey {
  beforeMoving('before-moving'),
  moving('moving'),
  finalStep('final-step'),
  options('options');

  const RelocationStageKey(this.key);
  final String key;

  static RelocationStageKey? fromKey(String? key) {
    for (final s in values) {
      if (s.key == key) return s;
    }
    return null;
  }
}

class RelocationPackage {
  const RelocationPackage({
    required this.title,
    required this.slug,
    required this.stage,
    required this.when,
    required this.shortDescription,
    required this.features,
    required this.isActive,
    required this.sortOrder,
  });

  static RelocationPackage? tryParse(Json json) {
    final stage = RelocationStageKey.fromKey(json['stage'] as String?);
    if (stage == null) return null;
    return RelocationPackage(
      title: json['title'] as String,
      slug: json['slug'] as String,
      stage: stage,
      when: json['when'] as String?,
      shortDescription: json['shortDescription'] as String? ?? '',
      features: [for (final f in json['features'] as List? ?? const []) f as String],
      isActive: json['isActive'] as bool? ?? true,
      sortOrder: json['sortOrder'] as num? ?? 0,
    );
  }

  final String title;
  final String slug;
  final RelocationStageKey stage;
  final String? when;
  final String shortDescription;
  final List<String> features;
  final bool isActive;
  final num sortOrder;
}

/* ----------------------------------------------------------- planner shapes */

class FlexItem {
  const FlexItem({
    required this.id,
    required this.label,
    required this.frequency,
    required this.price,
    required this.unit,
  });

  final String id;
  final String label;
  final String frequency;
  final num price;
  final FlexUnit unit;
}

class FixedPackageItem {
  const FixedPackageItem({required this.name, this.frequency, this.flexId});

  final String name;
  final String? frequency;

  /// Set when this item is also sold on its own in the Flexible Pack.
  final String? flexId;
}

class FixedPackage {
  const FixedPackage({
    required this.id,
    required this.title,
    required this.kicker,
    required this.summary,
    required this.perEmployee,
    required this.items,
  });

  final String id;
  final String title;
  final String kicker;
  final String summary;
  final num perEmployee;
  final List<FixedPackageItem> items;
}

class EventIdea {
  const EventIdea({required this.id, required this.label, required this.price});

  final String id;
  final String label;
  final num price;
}

class EventGroup {
  const EventGroup({required this.id, required this.title, required this.ideas});

  final String id;
  final String title;
  final List<EventIdea> ideas;
}

class SpecialServicesCatalog {
  const SpecialServicesCatalog({
    required this.fixedPackages,
    required this.flexItems,
    required this.eventGroups,
    required this.flexMinItems,
  });

  final List<FixedPackage> fixedPackages;
  final List<FlexItem> flexItems;
  final List<EventGroup> eventGroups;

  /// The Flexible Pack on its own needs at least this many items.
  final int flexMinItems;

  bool get isEmpty => fixedPackages.isEmpty && flexItems.isEmpty && eventGroups.isEmpty;
}

class RelocationItem {
  const RelocationItem({required this.label, this.detail});

  final String label;
  final String? detail;
}

class RelocationStage {
  const RelocationStage({
    required this.id,
    required this.key,
    required this.title,
    required this.when,
    required this.summary,
    required this.items,
  });

  final String id;
  final RelocationStageKey key;
  final String title;
  final String when;
  final String summary;
  final List<RelocationItem> items;
}

class RelocationOption {
  const RelocationOption({required this.id, required this.label});

  final String id;
  final String label;
}

class RelocationCatalog {
  const RelocationCatalog({required this.stages, required this.options});

  final List<RelocationStage> stages;
  final List<RelocationOption> options;

  bool get isEmpty => stages.isEmpty && options.isEmpty;
}
