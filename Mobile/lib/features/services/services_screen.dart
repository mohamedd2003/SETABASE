import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/router.dart';
import '../../data/models/content.dart';
import '../../data/providers.dart';
import '../../data/static/app_copy.dart';
import '../../design_system/icons.dart';
import '../../design_system/iso/iso_model_view.dart';
import '../../design_system/iso/iso_scene.dart';
import '../../design_system/tokens.dart';
import '../../design_system/widgets/cards.dart';
import '../../design_system/widgets/choices.dart';
import '../../design_system/widgets/department_tile.dart';
import '../../design_system/widgets/gold_pill_button.dart';
import '../../design_system/widgets/gold_text.dart';
import '../../design_system/widgets/section_header.dart';

/// 06 / 07 · "What do you need?" — every department as a floor of one building.
/// The floor whose card is in view lights up on the model.
class ServicesScreen extends ConsumerStatefulWidget {
  const ServicesScreen({super.key});

  @override
  ConsumerState<ServicesScreen> createState() => _ServicesScreenState();
}

class _ServicesScreenState extends ConsumerState<ServicesScreen> {
  final _scroll = ScrollController();
  final _floorKeys = <ServiceId, GlobalKey>{};
  ServiceId? _inView;

  @override
  void initState() {
    super.initState();
    _scroll.addListener(_updateInView);
  }

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  /// The card nearest the upper third of the screen is the one being read.
  void _updateInView() {
    final focus = MediaQuery.sizeOf(context).height * .35;
    ServiceId? best;
    var bestDistance = double.infinity;
    for (final MapEntry(key: id, value: key) in _floorKeys.entries) {
      final box = key.currentContext?.findRenderObject() as RenderBox?;
      if (box == null || !box.attached) continue;
      final top = box.localToGlobal(Offset.zero).dy;
      final distance = (top - focus).abs();
      if (distance < bestDistance) {
        bestDistance = distance;
        best = id;
      }
    }
    if (best != _inView) setState(() => _inView = best);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final page = ref.watch(audiencePageProvider);
    final departments = page.departments;
    final lit = _inView != null && departments.any((d) => d.id == _inView) ? _inView! : departments.first.id;
    for (final d in departments) {
      _floorKeys.putIfAbsent(d.id, GlobalKey.new);
    }
    _floorKeys.removeWhere((id, _) => !departments.any((d) => d.id == id));

    return Scaffold(
      body: CustomScrollView(
        controller: _scroll,
        slivers: [
          SliverSafeArea(
            bottom: false,
            sliver: SliverPadding(
              padding: const EdgeInsets.fromLTRB(SetaSpace.gutter, 12, SetaSpace.gutter, 0),
              sliver: SliverList.list(
                children: [
                  SectionHeader(eyebrow: page.servicesTitle, title: AppCopy.tabServices),
                  const SizedBox(height: 14),
                  SegmentedSwitch<Audience>(
                    options: [
                      for (final a in ref.watch(contentProvider).landing.audiences)
                        (
                          value: a.audience,
                          label: a.answer,
                          icon: a.audience == Audience.private ? SetaIcons.house : SetaIcons.building,
                        ),
                    ],
                    selected: page.audience,
                    onChanged: (a) {
                      setState(() => _inView = null);
                      ref.read(audienceChoiceProvider.notifier).choose(a);
                    },
                  ),
                  const SizedBox(height: 14),
                  Text(page.servicesSubtitle, style: SetaType.body),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: const Alignment(0, .24),
                  radius: .6,
                  colors: [c.gold.withValues(alpha: .14), c.gold.withValues(alpha: 0)],
                ),
              ),
              child: IsoModelView(
                key: ValueKey(page.audience),
                scene: towerScene([for (final d in departments) d.id.key]),
                height: 240,
                lit: {lit.key},
                semanticLabel: AppCopy.towerLabel(departments.length),
              ),
            ),
          ),
          SliverPadding(
            padding: EdgeInsets.fromLTRB(
              SetaSpace.gutter,
              0,
              SetaSpace.gutter,
              MediaQuery.paddingOf(context).bottom + 32,
            ),
            sliver: SliverList.list(
              children: [
                for (final (i, d) in departments.indexed) ...[
                  _Floor(
                    key: _floorKeys[d.id],
                    number: i + 1,
                    active: d.id == lit,
                    child: DepartmentTile(
                      department: d,
                      linkLabel: AppCopy.takeMeThere,
                      onTap: () => context.push(Routes.service(d.id)),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
                SetaCard(
                  glass: true,
                  child: Column(
                    children: [
                      const EyebrowLabel(AppCopy.roofEyebrow),
                      const SizedBox(height: 10),
                      Text(AppCopy.roofTitle, style: SetaType.h3, textAlign: TextAlign.center),
                      const SizedBox(height: 6),
                      Text(AppCopy.notSureText, style: SetaType.body, textAlign: TextAlign.center),
                      const SizedBox(height: 16),
                      GoldPillButton(label: page.hero.cta, expand: true, onPressed: () => context.go(Routes.contact)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// A gold rail beside the card marks the floor being read.
class _Floor extends StatelessWidget {
  const _Floor({super.key, required this.number, required this.active, required this.child});

  final int number;
  final bool active;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            width: 2,
            decoration: BoxDecoration(color: active ? c.gold : c.hair, borderRadius: BorderRadius.circular(2)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  AppCopy.floorTag(number).toUpperCase(),
                  style: SetaType.tag.copyWith(color: active ? c.gold : c.inkMute),
                ),
                const SizedBox(height: 10),
                child,
              ],
            ),
          ),
        ],
      ),
    );
  }
}
