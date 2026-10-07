import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../core/api/api_client.dart';
import '../core/config/env.dart';
import 'models/catalog.dart';
import 'models/content.dart';
import 'repositories/catalog_repository.dart';
import 'repositories/request_repository.dart';

part 'providers.g.dart';

/// Loaded in `main` before the first frame and overridden there.
@Riverpod(keepAlive: true)
SharedPreferences sharedPreferences(Ref ref) => throw UnimplementedError('Overridden in main');

/// The website's copy, from assets/content/content.json. Overridden in `main`.
@Riverpod(keepAlive: true)
AppContent content(Ref ref) => throw UnimplementedError('Overridden in main');

@Riverpod(keepAlive: true)
ApiClient apiClient(Ref ref) => ApiClient.create(Env.apiBaseUrl);

@Riverpod(keepAlive: true)
CatalogRepository catalogRepository(Ref ref) =>
    CatalogRepository(ref.watch(apiClientProvider), ref.watch(contentProvider));

@Riverpod(keepAlive: true)
RequestRepository requestRepository(Ref ref) => RequestRepository(ref.watch(apiClientProvider));

/// Private or Business. Null until chosen on onboarding; remembered across launches.
@Riverpod(keepAlive: true)
class AudienceChoice extends _$AudienceChoice {
  static const _key = 'audience';

  @override
  Audience? build() => Audience.fromKey(ref.watch(sharedPreferencesProvider).getString(_key));

  /// [remember] false shows an audience for this session only — "Explore services" from the
  /// splash browses without answering the question.
  Future<void> choose(Audience audience, {bool remember = true}) async {
    state = audience;
    if (remember) await ref.read(sharedPreferencesProvider).setString(_key, audience.key);
  }
}

/// The copy for the current audience; Private until someone chooses.
@riverpod
AudiencePage audiencePage(Ref ref) {
  final audience = ref.watch(audienceChoiceProvider) ?? Audience.private;
  return ref.watch(contentProvider).page(audience);
}

@riverpod
Future<Loaded<SpecialServicesCatalog>> specialServicesCatalog(Ref ref) =>
    ref.watch(catalogRepositoryProvider).specialServices();

@riverpod
Future<Loaded<RelocationCatalog>> relocationCatalog(Ref ref) => ref.watch(catalogRepositoryProvider).relocation();
