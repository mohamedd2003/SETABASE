import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/models/content.dart';
import '../../data/providers.dart';
import '../../data/static/app_copy.dart';
import '../../design_system/icons.dart';
import '../../design_system/tokens.dart';
import '../../design_system/widgets/cards.dart';
import '../../design_system/widgets/choices.dart';
import '../../design_system/widgets/gold_text.dart';
import '../../design_system/widgets/section_header.dart';

/// 09 · Property vs Facility Management, told through one leaking pipe.
class GuideScreen extends ConsumerStatefulWidget {
  const GuideScreen({super.key});

  @override
  ConsumerState<GuideScreen> createState() => _GuideScreenState();
}

class _GuideScreenState extends ConsumerState<GuideScreen> {
  int _focus = 0;

  static const _icons = [ServiceId.propertyManagement, ServiceId.facilityManagement];

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final explainer = ref.watch(contentProvider).explainer;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverSafeArea(
            bottom: false,
            sliver: SliverPadding(
              padding: EdgeInsets.fromLTRB(
                SetaSpace.gutter,
                12,
                SetaSpace.gutter,
                MediaQuery.paddingOf(context).bottom + 32,
              ),
              sliver: SliverList.list(
                children: [
                  SectionHeader(eyebrow: AppCopy.guideEyebrow, title: explainer.title, subtitle: explainer.intro),
                  const SizedBox(height: 16),
                  _Scene(label: AppCopy.explainerLabel),
                  const SizedBox(height: 16),
                  SegmentedSwitch<int>(
                    options: [
                      for (final (i, col) in explainer.columns.indexed) (value: i, label: col.title, icon: null),
                    ],
                    selected: _focus,
                    onChanged: (i) => setState(() => _focus = i),
                  ),
                  for (final (i, col) in explainer.columns.indexed) ...[
                    const SizedBox(height: 16),
                    GestureDetector(
                      onTap: () => setState(() => _focus = i),
                      child: SetaCard(
                        highlighted: i == _focus,
                        color: i == _focus ? c.navyDeep : null,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                DeptIcon.service(_icons[i % _icons.length], size: 32),
                                const SizedBox(width: 12),
                                Expanded(child: Text(col.title, style: SetaType.h3)),
                              ],
                            ),
                            const SizedBox(height: 14),
                            Text(col.summary, style: SetaType.body),
                            const SizedBox(height: 14),
                            Container(
                              padding: const EdgeInsets.fromLTRB(14, 4, 0, 4),
                              decoration: BoxDecoration(
                                border: Border(left: BorderSide(color: c.gold, width: 2)),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const EyebrowLabel(AppCopy.inTheLeak),
                                  const SizedBox(height: 4),
                                  Text(col.example, style: SetaType.serifItalic.copyWith(fontSize: 18, height: 1.45)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(height: 22),
                  Text(
                    explainer.closing,
                    style: SetaType.serifItalic.copyWith(fontSize: 24, color: c.gold),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// The cut-open block with the leak, on a faint grid.
class _Scene extends StatelessWidget {
  const _Scene({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Semantics(
      image: true,
      label: label,
      excludeSemantics: true,
      child: Container(
        height: 240,
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(SetaRadii.panel),
          border: Border.all(color: c.lineGoldSoft),
          gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [c.raised, c.navy]),
        ),
        child: Stack(
          fit: StackFit.expand,
          children: [
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: const Alignment(0, .12),
                  radius: .7,
                  colors: [c.gold.withValues(alpha: .14), c.gold.withValues(alpha: 0)],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 40),
              child: Image.asset('assets/images/renders/explainer.png', fit: BoxFit.contain),
            ),
            Positioned(
              left: 16,
              bottom: 14,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: c.gold.withValues(alpha: .16),
                  borderRadius: BorderRadius.circular(SetaRadii.pill),
                  border: Border.all(color: c.gold),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const DeptIcon('leak', size: 16),
                    const SizedBox(width: 6),
                    Text(AppCopy.leakChip, style: SetaType.label.copyWith(fontSize: 12, color: c.gold)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
