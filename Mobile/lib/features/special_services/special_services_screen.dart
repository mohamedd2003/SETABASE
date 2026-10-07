import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/router.dart';
import '../../core/api/api_client.dart';
import '../../core/utils/format.dart';
import '../../data/models/catalog.dart';
import '../../data/models/content.dart';
import '../../data/models/requests.dart';
import '../../data/pricing/special_services_pricing.dart';
import '../../data/providers.dart';
import '../../data/repositories/request_repository.dart';
import '../../data/static/app_copy.dart';
import '../../design_system/icons.dart';
import '../../design_system/tokens.dart';
import '../../design_system/widgets/bars.dart';
import '../../design_system/widgets/cards.dart';
import '../../design_system/widgets/choices.dart';
import '../../design_system/widgets/form_fields.dart';
import '../../design_system/widgets/gold_pill_button.dart';
import '../../design_system/widgets/gold_text.dart';
import '../../design_system/widgets/rows.dart';
import '../../design_system/widgets/section_header.dart';
import '../contact/request_quote_screen.dart' show SubmitErrorBanner;
import '../contact/requester_form.dart';
import '../contact/submission.dart';
import '../shared/planner_parts.dart';
import 'special_services_planner.dart';

enum _Tab { packages, build, events }

/// Special Services: monthly packages for the office, priced per employee as you pick.
class SpecialServicesScreen extends ConsumerStatefulWidget {
  const SpecialServicesScreen({super.key});

  @override
  ConsumerState<SpecialServicesScreen> createState() => _SpecialServicesScreenState();
}

class _SpecialServicesScreenState extends ConsumerState<SpecialServicesScreen> {
  final _requestKey = GlobalKey();
  final _requester = RequesterFields();
  late final _employees = TextEditingController(text: '${ref.read(specialServicesPlannerProvider).employees}');
  _Tab _tab = _Tab.packages;

  Map<String, String> _errors = {};
  String? _banner;
  bool _sending = false;

  @override
  void dispose() {
    _employees.dispose();
    _requester.dispose();
    super.dispose();
  }

  Future<void> _submit(SpecialServicesCatalog catalog) async {
    FocusScope.of(context).unfocus();
    final selection = ref.read(specialServicesPlannerProvider);
    final estimate = selection.estimate(catalog);
    final selectionError = selection.count(catalog) == 0
        ? AppCopy.ssPickOne
        : estimate.flexShortBy > 0
        ? AppCopy.ssFlexShort(estimate.flexShortBy)
        : null;
    final errors = <String, String>{
      'packages': ?selectionError,
      if (selection.employees < 1) 'employees': AppCopy.errorPeople,
      ..._requester.validate(),
    };
    setState(() {
      _errors = errors;
      _banner = errors.isEmpty ? null : (selectionError ?? AppCopy.errorFields);
    });
    if (errors.isNotEmpty) return;

    setState(() => _sending = true);
    final included = includedItems(catalog, selection.packages);
    try {
      final id = await ref
          .read(requestRepositoryProvider)
          .sendSpecialServices(
            SpecialServicesRequest(
              employees: selection.employees,
              packages: [
                for (final p in catalog.fixedPackages)
                  if (selection.packages.contains(p.id)) p.id,
              ],
              flexItems: [
                for (final f in catalog.flexItems)
                  if (selection.flexItems.contains(f.id) && !included.contains(f.id)) f.id,
              ],
              eventIdeas: [
                for (final g in catalog.eventGroups)
                  for (final e in g.ideas)
                    if (selection.events.contains(e.id)) e.id,
              ],
              contractLength: selection.contractLength,
              requester: _requester.toRequester(),
            ),
          );
      if (!mounted) return;
      final details = SentDetails(
        name: _requester.name.text,
        service:
            ref.read(contentProvider).page(Audience.business).department(ServiceId.specialServices)?.title ??
            AppCopy.ssAudience,
        email: _requester.email.text.trim(),
        reference: referenceFor(id),
      );
      ref.read(specialServicesPlannerProvider.notifier).reset();
      context.go(Routes.sent, extra: details);
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _sending = false;
        _errors = e is ApiValidation ? e.fields : {};
        _banner = describeSubmitError(e, fallback: AppCopy.errorGeneric);
      });
      if (e is ApiValidation && e.fields.isEmpty) ref.invalidate(specialServicesCatalogProvider);
    }
  }

  void _scrollToRequest() {
    final target = _requestKey.currentContext;
    if (target != null) {
      Scrollable.ensureVisible(target, duration: const Duration(milliseconds: 450), curve: Curves.easeInOutCubic);
    }
  }

  @override
  Widget build(BuildContext context) {
    final catalog = ref.watch(specialServicesCatalogProvider);
    final selection = ref.watch(specialServicesPlannerProvider);
    final loaded = catalog.when(data: (l) => l.value, loading: () => null, error: (_, _) => null);
    final count = loaded == null ? 0 : selection.count(loaded);

    return Scaffold(
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              SliverSafeArea(
                bottom: false,
                sliver: SliverToBoxAdapter(
                  child: SetaAppBar.back(title: context.isMaterial ? AppCopy.ssAudience.split(',').first : null),
                ),
              ),
              SliverPadding(
                padding: EdgeInsets.fromLTRB(
                  SetaSpace.gutter,
                  8,
                  SetaSpace.gutter,
                  140 + MediaQuery.paddingOf(context).bottom,
                ),
                sliver: SliverList.list(
                  children: catalog.when(
                    loading: () => [_hero(null), const CatalogLoading()],
                    error: (_, _) => [
                      _hero(null),
                      CatalogUnavailable(onRetry: () => ref.invalidate(specialServicesCatalogProvider)),
                    ],
                    data: (l) => [_hero(l.value), ..._planner(context, l.value, l.isFallback, selection)],
                  ),
                ),
              ),
            ],
          ),
          if (loaded != null && count > 0)
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: SelectionDock(
                count: count,
                detail: AppCopy.aboutMonthly(formatEgp(selection.estimate(loaded).monthly)),
                actionLabel: AppCopy.continueToRequest,
                onAction: _scrollToRequest,
              ),
            ),
        ],
      ),
    );
  }

  Widget _hero(SpecialServicesCatalog? catalog) {
    final prices = [for (final p in catalog?.fixedPackages ?? const <FixedPackage>[]) p.perEmployee];
    final cheapest = prices.isEmpty ? 615 : prices.reduce((a, b) => a < b ? a : b);
    return PlannerHero(
      eyebrow: AppCopy.ssAudience,
      title: AppCopy.ssTitle,
      paragraph: AppCopy.ssParagraph,
      facts: [AppCopy.ssFromPrice(formatEgp(cheapest).replaceAll(' EGP', '')), AppCopy.ssTrial, AppCopy.ssBundle],
    );
  }

  List<Widget> _planner(
    BuildContext context,
    SpecialServicesCatalog catalog,
    bool isFallback,
    OfficeSelection selection,
  ) {
    final content = ref.read(contentProvider);
    final planner = ref.read(specialServicesPlannerProvider.notifier);
    final included = includedItems(catalog, selection.packages);
    final employees = teamSize(selection.employees);
    final estimate = selection.estimate(catalog);
    final eventCount = selection.events.length;
    final flexCount = selection.flexItems.where((id) => !included.contains(id)).length;

    return [
      if (isFallback) ...[
        const SizedBox(height: 16),
        FallbackNote(onRetry: () => ref.invalidate(specialServicesCatalogProvider)),
      ],
      const SizedBox(height: 34),
      SectionHeader(title: AppCopy.ssChoose, subtitle: AppCopy.ssIntro, titleStyle: SetaType.h2),
      const SizedBox(height: 20),
      _EmployeesField(controller: _employees, errorText: _errors['employees'], onChanged: planner.setEmployees),
      const SizedBox(height: 20),
      SegmentedSwitch<_Tab>(
        options: [
          (value: _Tab.packages, label: _tabLabel(AppCopy.tabPackages, selection.packages.length), icon: null),
          (value: _Tab.build, label: _tabLabel(AppCopy.tabBuild, flexCount), icon: null),
          (value: _Tab.events, label: _tabLabel(AppCopy.tabEvents, eventCount), icon: null),
        ],
        selected: _tab,
        onChanged: (t) => setState(() => _tab = t),
      ),
      const SizedBox(height: 16),
      AnimatedSwitcher(
        duration: const Duration(milliseconds: 220),
        child: KeyedSubtree(
          key: ValueKey(_tab),
          child: switch (_tab) {
            _Tab.packages => Column(
              children: [
                for (final p in catalog.fixedPackages) ...[
                  _PackageCard(
                    package: p,
                    flexItems: catalog.flexItems,
                    added: selection.packages.contains(p.id),
                    onToggle: () => planner.togglePackage(p.id),
                  ),
                  const SizedBox(height: 14),
                ],
              ],
            ),
            _Tab.build => Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(AppCopy.buildIntro(employees), style: SetaType.body),
                const SizedBox(height: 14),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    for (final f in catalog.flexItems)
                      SelectionChip(
                        label: f.label,
                        selected: selection.flexItems.contains(f.id) || included.contains(f.id),
                        enabled: !included.contains(f.id),
                        detail: included.contains(f.id)
                            ? AppCopy.included
                            : f.unit == FlexUnit.kit
                            ? AppCopy.perHirePrice(formatEgp(f.price))
                            : AppCopy.perMonthPrice(formatEgp(flexItemMonthly(f, employees))),
                        onTap: () => planner.toggleFlex(f.id),
                      ),
                  ],
                ),
              ],
            ),
            _Tab.events => Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(AppCopy.eventsIntro, style: SetaType.body),
                for (final g in catalog.eventGroups) ...[
                  const SizedBox(height: 18),
                  Text(g.title, style: SetaType.h3),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      for (final e in g.ideas)
                        SelectionChip(
                          label: e.label,
                          detail: formatEgp(e.price),
                          selected: selection.events.contains(e.id),
                          onTap: () => planner.toggleEvent(e.id),
                        ),
                    ],
                  ),
                ],
              ],
            ),
          },
        ),
      ),
      const SizedBox(height: 24),
      _EstimateCard(estimate: estimate, eventCount: eventCount, empty: selection.count(catalog) == 0),
      const SizedBox(height: 16),
      _ContractTerms(terms: content.specialServices.terms),
      const SizedBox(height: 40),
      SectionHeader(
        key: _requestKey,
        title: AppCopy.ssRequestTitle,
        subtitle: '${AppCopy.ssRequestText} ${content.site.reassurance}',
        titleStyle: SetaType.h2,
      ),
      const SizedBox(height: 20),
      SelectionSummary(emptyText: AppCopy.ssNothing, lines: _summary(catalog, selection, employees, included)),
      const SizedBox(height: 16),
      StepList(
        eyebrow: AppCopy.whatHappensNext,
        steps: [for (final s in content.specialServices.steps) (title: s.title, text: s.text)],
      ),
      const SizedBox(height: 24),
      FieldGroup(
        label: AppCopy.fieldContract,
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final c in content.specialServices.contractLengths)
              SelectionChip(
                label: c.label,
                selected: selection.contractLength == c.value,
                onTap: () => planner.setContract(c.value),
              ),
          ],
        ),
      ),
      const SizedBox(height: 18),
      RequesterForm(fields: _requester, errors: _errors),
      if (_banner != null) ...[const SizedBox(height: 18), SubmitErrorBanner(_banner!)],
      const SizedBox(height: 20),
      GoldPillButton(
        label: _sending ? AppCopy.sending : content.page(Audience.business).contact.submit,
        expand: true,
        loading: _sending,
        onPressed: () => _submit(catalog),
      ),
      const SizedBox(height: 10),
      Text(content.page(Audience.business).contact.helper, style: SetaType.small, textAlign: TextAlign.center),
    ];
  }

  static String _tabLabel(String label, int n) => n == 0 ? label : '$label ($n)';

  List<({String label, String? detail})> _summary(
    SpecialServicesCatalog catalog,
    OfficeSelection selection,
    int employees,
    Set<String> included,
  ) => [
    for (final p in catalog.fixedPackages)
      if (selection.packages.contains(p.id))
        (label: p.title, detail: AppCopy.perMonthPrice(formatEgp(p.perEmployee * employees))),
    for (final f in catalog.flexItems)
      if (selection.flexItems.contains(f.id) && !included.contains(f.id))
        (
          label: f.label,
          detail: f.unit == FlexUnit.kit
              ? AppCopy.perHirePrice(formatEgp(f.price))
              : AppCopy.perMonthPrice(formatEgp(flexItemMonthly(f, employees))),
        ),
    for (final g in catalog.eventGroups)
      for (final e in g.ideas)
        if (selection.events.contains(e.id)) (label: e.label, detail: AppCopy.eventPricedDetail),
  ];
}

class _EmployeesField extends StatelessWidget {
  const _EmployeesField({required this.controller, required this.onChanged, this.errorText});

  final TextEditingController controller;
  final ValueChanged<int> onChanged;
  final String? errorText;

  void _step(int delta) {
    final next = ((int.tryParse(controller.text) ?? 0) + delta).clamp(0, SpecialServicesPlanner.maxEmployees);
    controller.text = '$next';
    onChanged(next);
  }

  @override
  Widget build(BuildContext context) => Row(
    crossAxisAlignment: CrossAxisAlignment.end,
    children: [
      Expanded(
        child: SetaTextField(
          label: AppCopy.ssEmployees,
          controller: controller,
          errorText: errorText,
          keyboardType: TextInputType.number,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(6)],
          onChanged: (v) => onChanged(int.tryParse(v) ?? 0),
        ),
      ),
      const SizedBox(width: 10),
      Padding(
        padding: EdgeInsets.only(bottom: errorText == null ? 2 : 26),
        child: CircleIconButton(icon: SetaIcons.minus, tooltip: 'Fewer', onPressed: () => _step(-1)),
      ),
      const SizedBox(width: 8),
      Padding(
        padding: EdgeInsets.only(bottom: errorText == null ? 2 : 26),
        child: CircleIconButton(icon: SetaIcons.plus, tooltip: 'More', onPressed: () => _step(1)),
      ),
    ],
  );
}

class _PackageCard extends StatefulWidget {
  const _PackageCard({required this.package, required this.flexItems, required this.added, required this.onToggle});

  final FixedPackage package;
  final List<FlexItem> flexItems;
  final bool added;
  final VoidCallback onToggle;

  @override
  State<_PackageCard> createState() => _PackageCardState();
}

class _PackageCardState extends State<_PackageCard> {
  bool _open = false;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final p = widget.package;
    return SetaCard(
      highlighted: widget.added,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(p.kicker.toUpperCase(), style: SetaType.tag.copyWith(color: c.gold)),
          const SizedBox(height: 8),
          Text(p.title, style: SetaType.h2),
          const SizedBox(height: 8),
          Text(p.summary, style: SetaType.body),
          const SizedBox(height: 14),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              GoldGradientText(formatEgp(p.perEmployee), style: SetaType.h2),
              const SizedBox(width: 8),
              Flexible(child: Text(AppCopy.perEmployeeMonth, style: SetaType.small)),
            ],
          ),
          const SizedBox(height: 6),
          InkWell(
            onTap: () => setState(() => _open = !_open),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                children: [
                  Text('${p.items.length} items', style: SetaType.label.copyWith(color: c.gold)),
                  const SizedBox(width: 6),
                  AnimatedRotation(
                    turns: _open ? .5 : 0,
                    duration: const Duration(milliseconds: 200),
                    child: const SetaIcon(SetaIcons.chevronDown, size: 16),
                  ),
                ],
              ),
            ),
          ),
          AnimatedSize(
            duration: const Duration(milliseconds: 220),
            curve: Curves.easeOut,
            alignment: Alignment.topCenter,
            child: _open
                ? Column(
                    children: [
                      for (final item in p.items)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 6),
                          child: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  item.name,
                                  style: SetaType.body.copyWith(color: c.white.withValues(alpha: .9)),
                                ),
                              ),
                              if (item.frequency != null) Text(item.frequency!, style: SetaType.small),
                            ],
                          ),
                        ),
                    ],
                  )
                : const SizedBox(width: double.infinity),
          ),
          const SizedBox(height: 12),
          widget.added
              ? GoldPillButton(label: AppCopy.added, icon: SetaIcons.check, expand: true, onPressed: widget.onToggle)
              : GoldPillButton.outline(
                  label: AppCopy.add,
                  icon: SetaIcons.plus,
                  expand: true,
                  onPressed: widget.onToggle,
                ),
        ],
      ),
    );
  }
}

class _EstimateCard extends StatelessWidget {
  const _EstimateCard({required this.estimate, required this.eventCount, required this.empty});

  final SpecialServicesEstimate estimate;
  final int eventCount;
  final bool empty;

  @override
  Widget build(BuildContext context) {
    final rate = estimate.volumeRate * 100;
    final rateText = rate == rate.roundToDouble() ? rate.toStringAsFixed(0) : rate.toStringAsFixed(1);
    return Semantics(
      liveRegion: true,
      child: CalloutCard(
        eyebrow: AppCopy.estMonthly,
        child: empty
            ? Text(AppCopy.estEmpty, style: SetaType.body)
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  KeyValueRow(label: AppCopy.estPackages, value: formatEgp(estimate.subtotal)),
                  if (estimate.bundleDiscount > 0)
                    KeyValueRow(label: AppCopy.estBundle, value: '− ${formatEgp(estimate.bundleDiscount)}'),
                  if (estimate.volumeDiscount > 0)
                    KeyValueRow(label: AppCopy.estVolume(rateText), value: '− ${formatEgp(estimate.volumeDiscount)}'),
                  if (eventCount > 0) KeyValueRow(label: AppCopy.estEvents(eventCount), value: AppCopy.pricedOnRequest),
                  const SizedBox(height: 6),
                  const Hairline(),
                  const SizedBox(height: 6),
                  KeyValueRow(label: AppCopy.estMonthly, value: formatEgp(estimate.monthly), emphasis: true),
                  if (estimate.perHire > 0) ...[
                    const SizedBox(height: 6),
                    Text(AppCopy.estPerHire(formatEgp(estimate.perHire)), style: SetaType.small),
                  ],
                  if (estimate.flexShortBy > 0) ...[
                    const SizedBox(height: 6),
                    Text(
                      AppCopy.estFlexShort(estimate.flexShortBy),
                      style: SetaType.small.copyWith(color: context.colors.gold),
                    ),
                  ],
                  const SizedBox(height: 8),
                  Text(AppCopy.estNote, style: SetaType.small),
                ],
              ),
      ),
    );
  }
}

class _ContractTerms extends StatelessWidget {
  const _ContractTerms({required this.terms});

  final List<String> terms;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return SetaCard(
      padding: EdgeInsets.zero,
      // Its own transparent Material, so the tile's ripple shows on the card.
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: Material(
          type: MaterialType.transparency,
          child: ExpansionTile(
            tilePadding: const EdgeInsets.symmetric(horizontal: 22, vertical: 4),
            childrenPadding: const EdgeInsets.fromLTRB(22, 0, 22, 16),
            iconColor: c.gold,
            collapsedIconColor: c.gold,
            title: Text(AppCopy.contractsTitle, style: SetaType.rowTitle),
            children: [
              for (final t in terms)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 5),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Padding(padding: EdgeInsets.only(top: 3), child: SetaIcon(SetaIcons.check, size: 14)),
                      const SizedBox(width: 10),
                      Expanded(child: Text(t, style: SetaType.body)),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
