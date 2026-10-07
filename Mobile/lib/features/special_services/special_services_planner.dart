import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../data/models/catalog.dart';
import '../../data/pricing/special_services_pricing.dart';

part 'special_services_planner.g.dart';

class OfficeSelection {
  const OfficeSelection({
    this.employees = 20,
    this.packages = const {},
    this.flexItems = const {},
    this.events = const {},
    this.contractLength,
  });

  final int employees;
  final Set<String> packages;
  final Set<String> flexItems;
  final Set<String> events;
  final String? contractLength;

  /// Flexible items already inside a chosen package don't count — they're in the package.
  int count(SpecialServicesCatalog catalog) {
    final included = includedItems(catalog, packages);
    return packages.length + flexItems.where((id) => !included.contains(id)).length + events.length;
  }

  SpecialServicesEstimate estimate(SpecialServicesCatalog catalog) => estimateSpecialServices(
    SpecialServicesSelection(employees: employees, packages: packages, flexItems: flexItems),
    catalog,
  );

  OfficeSelection copyWith({
    int? employees,
    Set<String>? packages,
    Set<String>? flexItems,
    Set<String>? events,
    String? Function()? contractLength,
  }) => OfficeSelection(
    employees: employees ?? this.employees,
    packages: packages ?? this.packages,
    flexItems: flexItems ?? this.flexItems,
    events: events ?? this.events,
    contractLength: contractLength == null ? this.contractLength : contractLength(),
  );
}

/// What the visitor has picked on the Special Services planner. Resets when it closes.
@riverpod
class SpecialServicesPlanner extends _$SpecialServicesPlanner {
  static const maxEmployees = 100000;

  @override
  OfficeSelection build() => const OfficeSelection();

  void setEmployees(int value) => state = state.copyWith(employees: value.clamp(0, maxEmployees));

  void togglePackage(String id) => state = state.copyWith(packages: _toggle(state.packages, id));

  void toggleFlex(String id) => state = state.copyWith(flexItems: _toggle(state.flexItems, id));

  void toggleEvent(String id) => state = state.copyWith(events: _toggle(state.events, id));

  /// Picking the chosen length again clears it — the field is optional.
  void setContract(String value) =>
      state = state.copyWith(contractLength: () => state.contractLength == value ? null : value);

  void reset() => state = const OfficeSelection();

  static Set<String> _toggle(Set<String> set, String id) => set.contains(id) ? ({...set}..remove(id)) : {...set, id};
}
