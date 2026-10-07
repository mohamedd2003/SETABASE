import '../../core/api/api_client.dart';
import '../catalog/catalog_mapper.dart';
import '../models/catalog.dart';
import '../models/content.dart';

/// A catalog plus whether it came from the bundled copy because the live one was unreachable.
typedef Loaded<T> = ({T value, bool isFallback});

/// The packages admins manage in the website's dashboard. Fetched live, so prices and
/// items stay current; falls back to the catalog bundled with the app.
class CatalogRepository {
  CatalogRepository(this._api, this._content);

  final ApiClient _api;
  final AppContent _content;

  Future<Loaded<SpecialServicesCatalog>> specialServices() async {
    final live = await _fetch('/api/special-offers', SpecialOffer.tryParse);
    if (live != null) return (value: toSpecialServicesCatalog(live), isFallback: false);
    final bundled = [for (final o in _content.fallbackOffers) ?SpecialOffer.tryParse(o)];
    return (value: toSpecialServicesCatalog(bundled), isFallback: true);
  }

  Future<Loaded<RelocationCatalog>> relocation() async {
    final live = await _fetch('/api/corporate-relocation', RelocationPackage.tryParse);
    if (live != null) return (value: toRelocationCatalog(live), isFallback: false);
    final bundled = [for (final p in _content.fallbackRelocationPackages) ?RelocationPackage.tryParse(p)];
    return (value: toRelocationCatalog(bundled), isFallback: true);
  }

  /// `{ data: [...] }` → parsed items, or null when the route can't be used.
  Future<List<T>?> _fetch<T>(String path, T? Function(Json) parse) async {
    try {
      final r = await _api.get(path);
      final body = r.body;
      if (r.status != 200 || body is! Map || body['data'] is! List) return null;
      return [
        for (final item in body['data'] as List)
          if (item is Map) ?parse(item.cast<String, dynamic>()),
      ];
    } on ApiException {
      return null;
    }
  }
}
