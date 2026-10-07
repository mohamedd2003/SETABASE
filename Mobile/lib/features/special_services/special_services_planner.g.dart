// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'special_services_planner.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// What the visitor has picked on the Special Services planner. Resets when it closes.

@ProviderFor(SpecialServicesPlanner)
final specialServicesPlannerProvider = SpecialServicesPlannerProvider._();

/// What the visitor has picked on the Special Services planner. Resets when it closes.
final class SpecialServicesPlannerProvider extends $NotifierProvider<SpecialServicesPlanner, OfficeSelection> {
  /// What the visitor has picked on the Special Services planner. Resets when it closes.
  SpecialServicesPlannerProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'specialServicesPlannerProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$specialServicesPlannerHash();

  @$internal
  @override
  SpecialServicesPlanner create() => SpecialServicesPlanner();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(OfficeSelection value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<OfficeSelection>(value));
  }
}

String _$specialServicesPlannerHash() => r'b9e92f16dd8bf3830699523a234e2ebb3ccbec71';

/// What the visitor has picked on the Special Services planner. Resets when it closes.

abstract class _$SpecialServicesPlanner extends $Notifier<OfficeSelection> {
  OfficeSelection build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<OfficeSelection, OfficeSelection>;
    final element =
        ref.element
            as $ClassProviderElement<AnyNotifier<OfficeSelection, OfficeSelection>, OfficeSelection, Object?, Object?>;
    return element.handleCreate(ref, build);
  }
}
