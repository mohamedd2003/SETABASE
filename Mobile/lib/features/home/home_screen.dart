import 'dart:async';

import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/header_menu.dart';
import '../../app/router.dart';
import '../../data/models/content.dart';
import '../../data/providers.dart';
import '../../data/static/app_copy.dart';
import '../../design_system/icons.dart';
import '../../design_system/iso/iso_model_view.dart';
import '../../design_system/iso/iso_scene.dart';
import '../../design_system/tokens.dart';
import '../../design_system/widgets/bars.dart';
import '../../design_system/widgets/cards.dart';
import '../../design_system/widgets/department_tile.dart';
import '../../design_system/widgets/gold_pill_button.dart';
import '../../design_system/widgets/gold_text.dart';
import '../../design_system/widgets/rows.dart';
import '../../design_system/widgets/section_header.dart';

/// 04 / 05 · Home for Private or Business — the same layout, the audience's copy.
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final page = ref.watch(audiencePageProvider);
    final content = ref.watch(contentProvider);
    final hero = page.hero;
    final ids = [for (final d in page.departments) d.id.key];

    return Scaffold(
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 450),
        child: CustomScrollView(
          key: ValueKey(page.audience),
          slivers: [
            SliverToBoxAdapter(
              child: _Hero(page: page, answer: _answer(content, page.audience)),
            ),
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(SetaSpace.gutter, 26, SetaSpace.gutter, 0),
              sliver: SliverList.list(
                children: [
                  EyebrowLabel(hero.summaryEyebrow),
                  if (hero.strapline != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 6, bottom: 4),
                      child: Text(hero.strapline!, style: SetaType.serifItalic),
                    ),
                  for (final (i, row) in hero.summaryRows.indexed)
                    ServiceRow(
                      number: i + 1,
                      leading: DeptIcon.service(row.id, size: 28),
                      title: row.label,
                      subtitle: row.audience,
                      divider: i < hero.summaryRows.length - 1,
                      onTap: () => context.push(Routes.service(row.id)),
                    ),
                ],
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(SetaSpace.gutter, 34, SetaSpace.gutter, 0),
                child: SectionHeader(
                  eyebrow: AppCopy.whatWeDo,
                  title: AppCopy.departmentsOneBuilding(page.departments.length),
                  titleStyle: SetaType.h2,
                  trailing: TextButton(
                    onPressed: () => context.go(Routes.services),
                    child: Text(AppCopy.seeAll, style: SetaType.label.copyWith(color: context.colors.gold)),
                  ),
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: IsoModelView(scene: towerScene(ids), height: 200, semanticLabel: AppCopy.towerLabel(ids.length)),
            ),
            SliverToBoxAdapter(
              // Cards share the tallest card's height, so the links line up.
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: SetaSpace.gutter),
                child: IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      for (final (i, d) in page.departments.indexed) ...[
                        if (i > 0) const SizedBox(width: 12),
                        SizedBox(
                          width: 300,
                          child: DepartmentTile(
                            department: d,
                            linkLabel: AppCopy.takeMeThere,
                            onTap: () => context.push(Routes.service(d.id)),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(SetaSpace.gutter, 28, SetaSpace.gutter, 28),
              sliver: SliverToBoxAdapter(child: _GuideTeaser(title: content.explainer.title)),
            ),
            SliverToBoxAdapter(child: _SkylineFooter(bottomInset: MediaQuery.paddingOf(context).bottom)),
          ],
        ),
      ),
    );
  }

  static LandingAudience _answer(AppContent content, Audience audience) =>
      content.landing.audiences.firstWhere((a) => a.audience == audience);
}

class _Hero extends ConsumerWidget {
  const _Hero({required this.page, required this.answer});

  final AudiencePage page;
  final LandingAudience answer;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final c = context.colors;
    final hero = page.hero;
    final height = (MediaQuery.sizeOf(context).height * .86).clamp(600.0, 820.0);
    final top = MediaQuery.paddingOf(context).top;

    return SizedBox(
      height: height,
      child: _PhotoCarousel(
        photos: hero.photos,
        builder: (context, index) => Stack(
          children: [
            Positioned(
              top: top,
              left: 0,
              right: 0,
              child: SetaAppBar.logo(actions: headerActions(context, ref)),
            ),
            Positioned(
              left: SetaSpace.gutter,
              right: SetaSpace.gutter,
              bottom: 28,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _SwitchPill(
                    icon: page.audience == Audience.private ? SetaIcons.house : SetaIcons.building,
                    label: answer.answer,
                    onTap: () => switchAudience(ref),
                  ),
                  const SizedBox(height: 18),
                  Semantics(header: true, child: Text(hero.title, style: SetaType.display)),
                  const SizedBox(height: 18),
                  Text(hero.paragraph, style: SetaType.body.copyWith(color: c.white.withValues(alpha: .84))),
                  const SizedBox(height: 18),
                  Row(
                    children: [
                      Expanded(
                        child: GoldPillButton(
                          label: hero.cta,
                          expand: true,
                          onPressed: () => context.go(Routes.contact),
                        ),
                      ),
                      const SizedBox(width: 12),
                      GoldPillButton.outline(label: AppCopy.tabServices, onPressed: () => context.go(Routes.services)),
                    ],
                  ),
                  if (hero.photos.length > 1) ...[
                    const SizedBox(height: 18),
                    _SlideDots(count: hero.photos.length, active: index),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// The hero photos crossfading every seven seconds, as on the website, under a navy wash.
class _PhotoCarousel extends StatefulWidget {
  const _PhotoCarousel({required this.photos, required this.builder});

  final List<HeroPhoto> photos;
  final Widget Function(BuildContext context, int index) builder;

  @override
  State<_PhotoCarousel> createState() => _PhotoCarouselState();
}

class _PhotoCarouselState extends State<_PhotoCarousel> {
  int _index = 0;
  Timer? _timer;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _timer?.cancel();
    if (widget.photos.length > 1 && !MediaQuery.disableAnimationsOf(context)) {
      _timer = Timer.periodic(const Duration(seconds: 7), (_) {
        if (mounted) setState(() => _index = (_index + 1) % widget.photos.length);
      });
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final photo = widget.photos.isEmpty ? null : widget.photos[_index];
    return Stack(
      fit: StackFit.expand,
      children: [
        if (photo != null)
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 1200),
            child: Semantics(
              key: ValueKey(photo.file),
              image: true,
              label: photo.alt,
              child: Image.asset(
                photo.asset,
                fit: BoxFit.cover,
                alignment: Alignment(photo.alignmentX, 0),
                width: double.infinity,
                height: double.infinity,
                cacheHeight: 1600,
              ),
            ),
          ),
        DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                c.navyDeep.withValues(alpha: .55),
                c.navyDeep.withValues(alpha: .2),
                c.navyDeep.withValues(alpha: .78),
                c.navy,
              ],
              stops: const [0, .28, .62, 1],
            ),
          ),
        ),
        widget.builder(context, _index),
      ],
    );
  }
}

class _SwitchPill extends StatelessWidget {
  const _SwitchPill({required this.icon, required this.label, required this.onTap});

  final SetaIcons icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Semantics(
      button: true,
      label: '$label. ${AppCopy.switchAudience}',
      excludeSemantics: true,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: c.navyDeep.withValues(alpha: .55),
            borderRadius: BorderRadius.circular(SetaRadii.pill),
            border: Border.all(color: c.lineGoldSoft),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              SetaIcon(icon, size: 16),
              const SizedBox(width: 8),
              Text(label, style: SetaType.label.copyWith(color: c.white)),
              Text('  ·  ${AppCopy.switchAudience}', style: SetaType.label.copyWith(color: c.gold)),
            ],
          ),
        ),
      ),
    );
  }
}

class _SlideDots extends StatelessWidget {
  const _SlideDots({required this.count, required this.active});

  final int count;
  final int active;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return ExcludeSemantics(
      child: Row(
        children: [
          for (var i = 0; i < count; i++)
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.only(right: 6),
              width: i == active ? 30 : 14,
              height: 3,
              decoration: BoxDecoration(
                color: i == active ? c.gold : c.white.withValues(alpha: .35),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
        ],
      ),
    );
  }
}

class _GuideTeaser extends StatelessWidget {
  const _GuideTeaser({required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Semantics(
      button: true,
      label: title,
      excludeSemantics: true,
      child: GestureDetector(
        onTap: () => context.go(Routes.guide),
        child: SetaCard(
          padding: const EdgeInsets.fromLTRB(6, 6, 18, 6),
          color: c.raised,
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(context.cardRadius - 6),
                child: Image.asset('assets/images/renders/explainer.png', width: 110, height: 96, fit: BoxFit.cover),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const EyebrowLabel(AppCopy.guideEyebrow),
                    const SizedBox(height: 6),
                    Text(title, style: SetaType.h3.copyWith(fontSize: 18)),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              const SetaIcon(SetaIcons.chevronRight, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}

class _SkylineFooter extends StatelessWidget {
  const _SkylineFooter({required this.bottomInset});

  final double bottomInset;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return DecoratedBox(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [c.navy, c.night, c.navyDeep],
          stops: const [0, .45, 1],
        ),
      ),
      child: Padding(
        padding: EdgeInsets.only(top: 8, bottom: bottomInset + 24),
        child: Column(
          children: [
            ExcludeSemantics(child: Image.asset('assets/images/renders/skyline.png', height: 150, fit: BoxFit.contain)),
            const SizedBox(height: 8),
            Text(AppCopy.footerPlace, style: SetaType.small, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}
