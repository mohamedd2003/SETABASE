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
import '../../design_system/widgets/backdrops.dart';
import '../../design_system/widgets/bars.dart';
import '../../design_system/widgets/cards.dart';
import '../../design_system/widgets/gold_pill_button.dart';
import '../../design_system/widgets/gold_text.dart';
import '../../design_system/widgets/rows.dart';

/// 08 · One department in depth. Every department uses this screen; it shows only the
/// parts its content has (intro, what's included, steps, pricing, closing line).
class ServiceDetailScreen extends ConsumerWidget {
  const ServiceDetailScreen({super.key, required this.id});

  final ServiceId id;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final page = ref.watch(audiencePageProvider);
    final site = ref.watch(contentProvider).site;
    final department = page.department(id) ?? ref.watch(contentProvider).page(page.audience.other).department(id);
    if (department == null) return const SizedBox.shrink();

    final detail = department.detail;
    final floors = [for (final d in page.departments) d.id.key];
    final material = context.isMaterial;
    final ask = AppCopy.askAbout(department.title);
    final bottomInset = MediaQuery.paddingOf(context).bottom;

    return Scaffold(
      body: BackdropView(
        backdrop: Backdrop.raised,
        child: Stack(
          children: [
            CustomScrollView(
              slivers: [
                SliverSafeArea(
                  bottom: false,
                  sliver: SliverToBoxAdapter(child: SetaAppBar.back(title: material ? department.title : null)),
                ),
                SliverToBoxAdapter(
                  child: IsoModelView(
                    scene: towerScene(floors.contains(id.key) ? floors : [...floors, id.key]),
                    height: 198,
                    fill: const Size(.8, .94),
                    lit: {id.key},
                    semanticLabel: AppCopy.towerLabel(floors.length),
                  ),
                ),
                SliverPadding(
                  padding: EdgeInsets.fromLTRB(SetaSpace.gutter, 8, SetaSpace.gutter, 140 + bottomInset),
                  sliver: SliverList.list(
                    children: [
                      EyebrowLabel(department.eyebrow),
                      const SizedBox(height: 10),
                      Semantics(header: true, child: Text(department.title, style: SetaType.h1)),
                      const SizedBox(height: 10),
                      Text(department.description, style: SetaType.body),
                      if (department.note != null) ...[const SizedBox(height: 16), NoteBox(department.note!)],
                      if (detail?.intro != null) ...[
                        const SizedBox(height: 16),
                        Text(
                          detail!.intro!,
                          style: SetaType.body.copyWith(color: context.colors.white.withValues(alpha: .9)),
                        ),
                      ],
                      for (final group in detail?.groups ?? const <ServiceGroup>[]) ...[
                        const SizedBox(height: 20),
                        InfoList(title: group.title, lead: group.lead, items: group.items),
                      ],
                      if (detail != null && detail.steps.isNotEmpty) ...[
                        const SizedBox(height: 20),
                        StepList(
                          eyebrow: AppCopy.howItWorks,
                          steps: [for (final s in detail.steps) (title: s.title, text: s.text)],
                        ),
                      ],
                      if (detail?.pricing != null) ...[
                        const SizedBox(height: 20),
                        CalloutCard(eyebrow: AppCopy.whatItCosts, text: detail!.pricing),
                      ],
                      if (detail?.closing != null) ...[
                        const SizedBox(height: 24),
                        Text(
                          detail!.closing!,
                          style: SetaType.serifItalic.copyWith(color: context.colors.gold, fontSize: 20),
                          textAlign: TextAlign.center,
                        ),
                      ],
                      if (department.hasPackages) ...[
                        const SizedBox(height: 24),
                        GoldPillButton.outline(
                          label: AppCopy.seePackages,
                          expand: true,
                          onPressed: () => context.push(
                            id == ServiceId.specialServices ? Routes.specialServices : Routes.relocation,
                          ),
                        ),
                      ],
                      const SizedBox(height: 16),
                      Text(site.reassurance, style: SetaType.small, textAlign: TextAlign.center),
                    ],
                  ),
                ),
              ],
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: material
                  ? Padding(
                      padding: EdgeInsets.fromLTRB(SetaSpace.gutter, 0, SetaSpace.gutter, 28 + bottomInset),
                      child: Align(
                        alignment: Alignment.centerRight,
                        child: GoldPillButton(
                          label: ask,
                          icon: SetaIcons.message,
                          onPressed: () => context.go(Routes.contactAbout(id)),
                        ),
                      ),
                    )
                  : CtaDock(
                      child: GoldPillButton(
                        label: ask,
                        expand: true,
                        onPressed: () => context.go(Routes.contactAbout(id)),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
