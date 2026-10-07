// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Loaded in `main` before the first frame and overridden there.

@ProviderFor(sharedPreferences)
final sharedPreferencesProvider = SharedPreferencesProvider._();

/// Loaded in `main` before the first frame and overridden there.

final class SharedPreferencesProvider
    extends $FunctionalProvider<SharedPreferences, SharedPreferences, SharedPreferences>
    with $Provider<SharedPreferences> {
  /// Loaded in `main` before the first frame and overridden there.
  SharedPreferencesProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'sharedPreferencesProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$sharedPreferencesHash();

  @$internal
  @override
  $ProviderElement<SharedPreferences> $createElement($ProviderPointer pointer) => $ProviderElement(pointer);

  @override
  SharedPreferences create(Ref ref) {
    return sharedPreferences(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(SharedPreferences value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<SharedPreferences>(value));
  }
}

String _$sharedPreferencesHash() => r'd572029fb3fdac2187dc05132ca049077335dc60';

/// The website's copy, from assets/content/content.json. Overridden in `main`.

@ProviderFor(content)
final contentProvider = ContentProvider._();

/// The website's copy, from assets/content/content.json. Overridden in `main`.

final class ContentProvider extends $FunctionalProvider<AppContent, AppContent, AppContent> with $Provider<AppContent> {
  /// The website's copy, from assets/content/content.json. Overridden in `main`.
  ContentProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'contentProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$contentHash();

  @$internal
  @override
  $ProviderElement<AppContent> $createElement($ProviderPointer pointer) => $ProviderElement(pointer);

  @override
  AppContent create(Ref ref) {
    return content(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(AppContent value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<AppContent>(value));
  }
}

String _$contentHash() => r'286a57415c81b25f3a585a7bc826dc831eae01e7';

@ProviderFor(apiClient)
final apiClientProvider = ApiClientProvider._();

final class ApiClientProvider extends $FunctionalProvider<ApiClient, ApiClient, ApiClient> with $Provider<ApiClient> {
  ApiClientProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'apiClientProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$apiClientHash();

  @$internal
  @override
  $ProviderElement<ApiClient> $createElement($ProviderPointer pointer) => $ProviderElement(pointer);

  @override
  ApiClient create(Ref ref) {
    return apiClient(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(ApiClient value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<ApiClient>(value));
  }
}

String _$apiClientHash() => r'f63aa5f5c63f5e26d8e303402eab3203b795148a';

@ProviderFor(catalogRepository)
final catalogRepositoryProvider = CatalogRepositoryProvider._();

final class CatalogRepositoryProvider
    extends $FunctionalProvider<CatalogRepository, CatalogRepository, CatalogRepository>
    with $Provider<CatalogRepository> {
  CatalogRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'catalogRepositoryProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$catalogRepositoryHash();

  @$internal
  @override
  $ProviderElement<CatalogRepository> $createElement($ProviderPointer pointer) => $ProviderElement(pointer);

  @override
  CatalogRepository create(Ref ref) {
    return catalogRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(CatalogRepository value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<CatalogRepository>(value));
  }
}

String _$catalogRepositoryHash() => r'f965cb52a34f0da57d641a903dedd2fd88a72ffc';

@ProviderFor(requestRepository)
final requestRepositoryProvider = RequestRepositoryProvider._();

final class RequestRepositoryProvider
    extends $FunctionalProvider<RequestRepository, RequestRepository, RequestRepository>
    with $Provider<RequestRepository> {
  RequestRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'requestRepositoryProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$requestRepositoryHash();

  @$internal
  @override
  $ProviderElement<RequestRepository> $createElement($ProviderPointer pointer) => $ProviderElement(pointer);

  @override
  RequestRepository create(Ref ref) {
    return requestRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(RequestRepository value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<RequestRepository>(value));
  }
}

String _$requestRepositoryHash() => r'd4d0625ccfc9657a251412b21589b554f26be34e';

/// Private or Business. Null until chosen on onboarding; remembered across launches.

@ProviderFor(AudienceChoice)
final audienceChoiceProvider = AudienceChoiceProvider._();

/// Private or Business. Null until chosen on onboarding; remembered across launches.
final class AudienceChoiceProvider extends $NotifierProvider<AudienceChoice, Audience?> {
  /// Private or Business. Null until chosen on onboarding; remembered across launches.
  AudienceChoiceProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'audienceChoiceProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$audienceChoiceHash();

  @$internal
  @override
  AudienceChoice create() => AudienceChoice();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(Audience? value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<Audience?>(value));
  }
}

String _$audienceChoiceHash() => r'55ab94a64652541f10804a266483d21d7968753e';

/// Private or Business. Null until chosen on onboarding; remembered across launches.

abstract class _$AudienceChoice extends $Notifier<Audience?> {
  Audience? build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<Audience?, Audience?>;
    final element =
        ref.element as $ClassProviderElement<AnyNotifier<Audience?, Audience?>, Audience?, Object?, Object?>;
    return element.handleCreate(ref, build);
  }
}

/// The copy for the current audience; Private until someone chooses.

@ProviderFor(audiencePage)
final audiencePageProvider = AudiencePageProvider._();

/// The copy for the current audience; Private until someone chooses.

final class AudiencePageProvider extends $FunctionalProvider<AudiencePage, AudiencePage, AudiencePage>
    with $Provider<AudiencePage> {
  /// The copy for the current audience; Private until someone chooses.
  AudiencePageProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'audiencePageProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$audiencePageHash();

  @$internal
  @override
  $ProviderElement<AudiencePage> $createElement($ProviderPointer pointer) => $ProviderElement(pointer);

  @override
  AudiencePage create(Ref ref) {
    return audiencePage(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(AudiencePage value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<AudiencePage>(value));
  }
}

String _$audiencePageHash() => r'd7709092c53f920e6e240aa3739d896d22088cac';

@ProviderFor(specialServicesCatalog)
final specialServicesCatalogProvider = SpecialServicesCatalogProvider._();

final class SpecialServicesCatalogProvider
    extends
        $FunctionalProvider<
          AsyncValue<Loaded<SpecialServicesCatalog>>,
          Loaded<SpecialServicesCatalog>,
          FutureOr<Loaded<SpecialServicesCatalog>>
        >
    with $FutureModifier<Loaded<SpecialServicesCatalog>>, $FutureProvider<Loaded<SpecialServicesCatalog>> {
  SpecialServicesCatalogProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'specialServicesCatalogProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$specialServicesCatalogHash();

  @$internal
  @override
  $FutureProviderElement<Loaded<SpecialServicesCatalog>> $createElement($ProviderPointer pointer) =>
      $FutureProviderElement(pointer);

  @override
  FutureOr<Loaded<SpecialServicesCatalog>> create(Ref ref) {
    return specialServicesCatalog(ref);
  }
}

String _$specialServicesCatalogHash() => r'33080ea3415706ec50cfaba95990f987dc7e09af';

@ProviderFor(relocationCatalog)
final relocationCatalogProvider = RelocationCatalogProvider._();

final class RelocationCatalogProvider
    extends
        $FunctionalProvider<
          AsyncValue<Loaded<RelocationCatalog>>,
          Loaded<RelocationCatalog>,
          FutureOr<Loaded<RelocationCatalog>>
        >
    with $FutureModifier<Loaded<RelocationCatalog>>, $FutureProvider<Loaded<RelocationCatalog>> {
  RelocationCatalogProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'relocationCatalogProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$relocationCatalogHash();

  @$internal
  @override
  $FutureProviderElement<Loaded<RelocationCatalog>> $createElement($ProviderPointer pointer) =>
      $FutureProviderElement(pointer);

  @override
  FutureOr<Loaded<RelocationCatalog>> create(Ref ref) {
    return relocationCatalog(ref);
  }
}

String _$relocationCatalogHash() => r'0b6598506d42185c3831ad72bdc0ff0863e4b7e6';
