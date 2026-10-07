import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../data/models/catalog.dart';

part 'relocation_planner.g.dart';

class RelocationSelection {
  const RelocationSelection({this.stages = const {}, this.options = const {}, this.destination, this.arrival});

  final Set<String> stages;
  final Set<String> options;

  /// One of the website's destination strings.
  final String? destination;

  /// The month the family arrives, if known.
  final DateTime? arrival;

  int get count => stages.length + options.length;

  /// "YYYY-MM", or empty — the API's `arrival` format.
  String get arrivalValue => arrival == null ? '' : '${arrival!.year}-${arrival!.month.toString().padLeft(2, '0')}';

  /// Stage ids in the order of the move, whatever order they were picked in.
  List<String> stagesInOrder(RelocationCatalog catalog) => [
    for (final s in catalog.stages)
      if (stages.contains(s.id)) s.id,
  ];

  RelocationSelection copyWith({
    Set<String>? stages,
    Set<String>? options,
    String? destination,
    DateTime? Function()? arrival,
  }) => RelocationSelection(
    stages: stages ?? this.stages,
    options: options ?? this.options,
    destination: destination ?? this.destination,
    arrival: arrival == null ? this.arrival : arrival(),
  );
}

/// What the visitor has picked on the Corporate Relocation planner. Resets when the
/// planner closes.
@riverpod
class RelocationPlanner extends _$RelocationPlanner {
  @override
  RelocationSelection build() => const RelocationSelection();

  void toggleStage(String id) => state = state.copyWith(stages: _toggle(state.stages, id));

  void toggleOption(String id) => state = state.copyWith(options: _toggle(state.options, id));

  void setDestination(String destination) => state = state.copyWith(destination: destination);

  void setArrival(DateTime? month) => state = state.copyWith(arrival: () => month);

  void reset() => state = const RelocationSelection();

  static Set<String> _toggle(Set<String> set, String id) => set.contains(id) ? ({...set}..remove(id)) : {...set, id};
}
