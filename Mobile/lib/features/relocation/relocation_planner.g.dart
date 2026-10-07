// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'relocation_planner.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// What the visitor has picked on the Corporate Relocation planner. Resets when the
/// planner closes.

@ProviderFor(RelocationPlanner)
final relocationPlannerProvider = RelocationPlannerProvider._();

/// What the visitor has picked on the Corporate Relocation planner. Resets when the
/// planner closes.
final class RelocationPlannerProvider extends $NotifierProvider<RelocationPlanner, RelocationSelection> {
  /// What the visitor has picked on the Corporate Relocation planner. Resets when the
  /// planner closes.
  RelocationPlannerProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'relocationPlannerProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$relocationPlannerHash();

  @$internal
  @override
  RelocationPlanner create() => RelocationPlanner();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(RelocationSelection value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<RelocationSelection>(value));
  }
}

String _$relocationPlannerHash() => r'513e92db26d3da52661659b61bae16706a05ed59';

/// What the visitor has picked on the Corporate Relocation planner. Resets when the
/// planner closes.

abstract class _$RelocationPlanner extends $Notifier<RelocationSelection> {
  RelocationSelection build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<RelocationSelection, RelocationSelection>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<RelocationSelection, RelocationSelection>,
              RelocationSelection,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}
