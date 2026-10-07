// Port of src/lib/special-services-pricing.ts — the live estimate beside the picker.
// The API recomputes it on submit, so this only has to agree with the website, not be trusted.

import '../../core/utils/format.dart';
import '../models/catalog.dart';

/// Two or more packages together take this off.
const bundleDiscountRate = 0.1;

/// Bigger teams pay less. Checked from the top.
const volumeDiscounts = [
  (from: 500, rate: 0.2),
  (from: 200, rate: 0.15),
  (from: 100, rate: 0.125),
  (from: 50, rate: 0.1),
];

class SpecialServicesSelection {
  const SpecialServicesSelection({required this.employees, required this.packages, required this.flexItems});

  final num employees;
  final Set<String> packages;
  final Set<String> flexItems;
}

class SpecialServicesEstimate {
  const SpecialServicesEstimate({
    required this.subtotal,
    required this.bundleDiscount,
    required this.volumeDiscount,
    required this.volumeRate,
    required this.monthly,
    required this.perHire,
    required this.packageCount,
    required this.flexShortBy,
  });

  /// Fixed packages plus Flexible Pack items, before discounts, per month.
  final int subtotal;
  final int bundleDiscount;
  final int volumeDiscount;
  final double volumeRate;

  /// What the client pays per month, in EGP.
  final int monthly;

  /// Welcome kits are billed per new hire, outside the monthly total.
  final num perHire;

  /// How many packages count towards the bundle discount.
  final int packageCount;

  /// Flexible items chosen without any fixed package, below the minimum.
  final int flexShortBy;
}

/// Monthly price of one Flexible Pack item for a team of this size.
num flexItemMonthly(FlexItem item, int employees) => switch (item.unit) {
  FlexUnit.employee => item.price * employees,
  FlexUnit.office => item.price,
  // Twice a year, spread over six months.
  FlexUnit.workshop || FlexUnit.session => item.price / 6,
  FlexUnit.kit => 0,
};

/// Flexible items already inside the chosen packages — they can't be added again on top.
Set<String> includedItems(SpecialServicesCatalog catalog, Set<String> packages) => {
  for (final p in catalog.fixedPackages)
    if (packages.contains(p.id))
      for (final item in p.items)
        if (item.flexId != null) item.flexId!,
};

/// Clamps the team size the way the website does: whole people, at least one.
int teamSize(num employees) {
  if (employees.isNaN || employees.isInfinite) return 1;
  final whole = employees.floor();
  return whole < 1 ? 1 : whole;
}

SpecialServicesEstimate estimateSpecialServices(SpecialServicesSelection selection, SpecialServicesCatalog catalog) {
  final employees = teamSize(selection.employees);
  final included = includedItems(catalog, selection.packages);
  final chosenFlex = [
    for (final item in catalog.flexItems)
      if (selection.flexItems.contains(item.id) && !included.contains(item.id)) item,
  ];

  final num packageTotal = catalog.fixedPackages
      .where((p) => selection.packages.contains(p.id))
      .fold<num>(0, (sum, p) => sum + p.perEmployee * employees);
  final num flexTotal = chosenFlex.fold<num>(0, (sum, i) => sum + flexItemMonthly(i, employees));
  final num perHire = chosenFlex.where((i) => i.unit == FlexUnit.kit).fold<num>(0, (sum, i) => sum + i.price);

  // On its own, the Flexible Pack counts as a package once it reaches the minimum.
  final flexStandalone = selection.packages.isEmpty && chosenFlex.length >= catalog.flexMinItems;
  final packageCount = selection.packages.length + (flexStandalone ? 1 : 0);
  final flexShortBy = selection.packages.isEmpty && chosenFlex.isNotEmpty
      ? (catalog.flexMinItems - chosenFlex.length).clamp(0, catalog.flexMinItems)
      : 0;

  final subtotal = packageTotal + flexTotal;
  final bundleDiscount = packageCount >= 2 ? subtotal * bundleDiscountRate : 0;
  var volumeRate = 0.0;
  for (final tier in volumeDiscounts) {
    if (employees >= tier.from) {
      volumeRate = tier.rate;
      break;
    }
  }
  final volumeDiscount = (subtotal - bundleDiscount) * volumeRate;

  return SpecialServicesEstimate(
    subtotal: roundHalfUp(subtotal),
    bundleDiscount: roundHalfUp(bundleDiscount),
    volumeDiscount: roundHalfUp(volumeDiscount),
    volumeRate: volumeRate,
    monthly: roundHalfUp(subtotal - bundleDiscount - volumeDiscount),
    perHire: perHire,
    packageCount: packageCount,
    flexShortBy: flexShortBy,
  );
}
