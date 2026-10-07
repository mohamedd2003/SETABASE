import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../app/router.dart';
import '../../core/api/api_client.dart';
import '../../data/models/catalog.dart';
import '../../data/models/content.dart';
import '../../data/models/requests.dart';
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
import '../../design_system/widgets/section_header.dart';
import '../contact/request_quote_screen.dart' show SubmitErrorBanner;
import '../contact/requester_form.dart';
import '../contact/submission.dart';
import '../shared/planner_parts.dart';
import 'relocation_planner.dart';

/// Corporate Relocation: it starts with a conversation, then the stages of the move and
/// any extras, then a request. Stages and extras come from the live catalog.
class RelocationPlannerScreen extends ConsumerStatefulWidget {
  const RelocationPlannerScreen({super.key});

  @override
  ConsumerState<RelocationPlannerScreen> createState() => _RelocationPlannerScreenState();
}

class _RelocationPlannerScreenState extends ConsumerState<RelocationPlannerScreen> {
  final _requestKey = GlobalKey();
  final _people = TextEditingController(text: '1');
  final _movingFrom = TextEditingController();
  final _requester = RequesterFields();

  Map<String, String> _errors = {};
  String? _banner;
  bool _sending = false;

  @override
  void dispose() {
    _people.dispose();
    _movingFrom.dispose();
    _requester.dispose();
    super.dispose();
  }

  Future<void> _submit(RelocationCatalog catalog) async {
    FocusScope.of(context).unfocus();
    final selection = ref.read(relocationPlannerProvider);
    final people = int.tryParse(_people.text.trim());
    final errors = <String, String>{
      if (selection.count == 0) 'packages': AppCopy.relocationPickOne,
      if (people == null || people < 1 || people > 5000) 'employees': AppCopy.errorPeople,
      if (_movingFrom.text.trim().length < 2) 'movingFrom': AppCopy.errorMovingFrom,
      if (selection.destination == null) 'destination': AppCopy.errorMovingTo,
      ..._requester.validate(),
    };
    setState(() {
      _errors = errors;
      _banner = errors.isEmpty ? null : (errors['packages'] ?? AppCopy.errorFields);
    });
    if (errors.isNotEmpty) return;

    setState(() => _sending = true);
    try {
      final id = await ref
          .read(requestRepositoryProvider)
          .sendRelocation(
            RelocationRequest(
              stages: selection.stagesInOrder(catalog),
              options: [
                for (final o in catalog.options)
                  if (selection.options.contains(o.id)) o.id,
              ],
              employees: people!,
              movingFrom: _movingFrom.text,
              destination: selection.destination!,
              arrival: selection.arrivalValue,
              requester: _requester.toRequester(),
            ),
          );
      if (!mounted) return;
      final details = SentDetails(
        name: _requester.name.text,
        service: ref.read(audiencePageProvider).department(ServiceId.relocation)?.title ?? AppCopy.relocationAudience,
        email: _requester.email.text.trim(),
        reference: referenceFor(id),
      );
      ref.read(relocationPlannerProvider.notifier).reset();
      context.go(Routes.sent, extra: details);
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _sending = false;
        _errors = e is ApiValidation ? e.fields : {};
        _banner = describeSubmitError(e, fallback: AppCopy.errorGeneric);
      });
      // A package removed by an admin since the catalog loaded: fetch it again.
      if (e is ApiValidation && e.fields.isEmpty) ref.invalidate(relocationCatalogProvider);
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
    final catalog = ref.watch(relocationCatalogProvider);
    final content = ref.watch(contentProvider);
    final selection = ref.watch(relocationPlannerProvider);

    return Scaffold(
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              SliverSafeArea(
                bottom: false,
                sliver: SliverToBoxAdapter(
                  child: SetaAppBar.back(
                    title: context.isMaterial ? AppCopy.relocationAudience.split(',').first : null,
                  ),
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
                  children: [
                    PlannerHero(
                      eyebrow: AppCopy.relocationAudience,
                      title: content.relocation.openingTitle,
                      paragraph: content.relocation.openingParagraph,
                      facts: content.relocation.openingFacts,
                    ),
                    const SizedBox(height: 34),
                    SectionHeader(
                      title: AppCopy.relocationStepsTitle,
                      subtitle: AppCopy.relocationStepsIntro,
                      titleStyle: SetaType.h2,
                    ),
                    const SizedBox(height: 20),
                    _ConversationCard(conversation: content.relocation.conversation),
                    ...catalog.when(
                      loading: () => const [CatalogLoading()],
                      error: (_, _) => [CatalogUnavailable(onRetry: () => ref.invalidate(relocationCatalogProvider))],
                      data: (loaded) => _planner(context, loaded.value, loaded.isFallback, content, selection),
                    ),
                  ],
                ),
              ),
            ],
          ),
          if (selection.count > 0)
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: SelectionDock(
                count: selection.count,
                detail: AppCopy.quotedOnRequest,
                actionLabel: AppCopy.continueToRequest,
                onAction: _scrollToRequest,
              ),
            ),
        ],
      ),
    );
  }

  List<Widget> _planner(
    BuildContext context,
    RelocationCatalog catalog,
    bool isFallback,
    AppContent content,
    RelocationSelection selection,
  ) {
    final c = context.colors;
    final planner = ref.read(relocationPlannerProvider.notifier);
    final relocation = content.relocation;
    final chosenStages = [
      for (final s in catalog.stages)
        if (selection.stages.contains(s.id)) s,
    ];
    final chosenOptions = [
      for (final o in catalog.options)
        if (selection.options.contains(o.id)) o.label,
    ];

    return [
      if (isFallback) ...[
        const SizedBox(height: 16),
        FallbackNote(onRetry: () => ref.invalidate(relocationCatalogProvider)),
      ],
      for (final (i, stage) in catalog.stages.indexed) ...[
        const SizedBox(height: 16),
        _StageCard(
          stage: stage,
          number: i + 2,
          selected: selection.stages.contains(stage.id),
          onTap: () => planner.toggleStage(stage.id),
        ),
      ],
      const SizedBox(height: 16),
      Text(relocation.exclusions, style: SetaType.small),
      const SizedBox(height: 24),
      SetaCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            EyebrowLabel(relocation.nextTitle),
            const SizedBox(height: 10),
            Text(relocation.nextText, style: SetaType.body),
          ],
        ),
      ),
      if (catalog.options.isNotEmpty) ...[
        const SizedBox(height: 34),
        SectionHeader(title: AppCopy.extras, subtitle: AppCopy.extrasText, titleStyle: SetaType.h2),
        const SizedBox(height: 16),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final o in catalog.options)
              SelectionChip(
                label: o.label,
                selected: selection.options.contains(o.id),
                onTap: () => planner.toggleOption(o.id),
              ),
          ],
        ),
      ],
      const SizedBox(height: 40),
      SectionHeader(
        key: _requestKey,
        title: AppCopy.relocationRequestTitle,
        subtitle: '${AppCopy.relocationRequestText} ${content.site.reassurance}',
        titleStyle: SetaType.h2,
      ),
      const SizedBox(height: 20),
      SelectionSummary(
        emptyText: AppCopy.relocationNothing,
        lines: [
          for (final s in chosenStages) (label: s.title, detail: s.when),
          if (chosenOptions.isNotEmpty) (label: AppCopy.extrasSummary(chosenOptions), detail: null),
        ],
      ),
      const SizedBox(height: 24),
      SetaTextField(
        label: AppCopy.fieldPeople,
        controller: _people,
        errorText: _errors['employees'],
        keyboardType: TextInputType.number,
        maxLength: 4,
        textInputAction: TextInputAction.next,
      ),
      const SizedBox(height: 18),
      SetaTextField(
        label: AppCopy.fieldMovingFrom,
        hint: AppCopy.fieldMovingFromHint,
        controller: _movingFrom,
        errorText: _errors['movingFrom'],
        maxLength: 80,
        autofillHints: const [AutofillHints.countryName],
        textCapitalization: TextCapitalization.words,
        textInputAction: TextInputAction.next,
      ),
      const SizedBox(height: 18),
      FieldGroup(
        label: AppCopy.fieldMovingTo,
        errorText: _errors['destination'],
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final d in relocation.destinations)
              SelectionChip(label: d, selected: selection.destination == d, onTap: () => planner.setDestination(d)),
          ],
        ),
      ),
      const SizedBox(height: 18),
      FieldGroup(
        label: AppCopy.fieldArrival,
        errorText: _errors['arrival'],
        child: _MonthField(value: selection.arrival, onChanged: planner.setArrival),
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
      Text(
        content.page(Audience.business).contact.helper,
        style: SetaType.small.copyWith(color: c.inkMute),
        textAlign: TextAlign.center,
      ),
    ];
  }
}

class _ConversationCard extends StatelessWidget {
  const _ConversationCard({required this.conversation});

  final Conversation conversation;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return SetaCard(
      color: c.raised,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(AppCopy.stageKicker(1, conversation.when).toUpperCase(), style: SetaType.tag.copyWith(color: c.gold)),
          const SizedBox(height: 10),
          Text(conversation.title, style: SetaType.h2),
          const SizedBox(height: 10),
          Text(conversation.summary, style: SetaType.body),
          const SizedBox(height: 16),
          Text(conversation.questionsLead, style: SetaType.label),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final q in conversation.questions)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(context.isMaterial ? SetaRadii.chipAndroid : 16),
                    border: Border.all(color: c.lineGoldSoft),
                  ),
                  child: Text(q, style: SetaType.small.copyWith(color: c.inkSoft)),
                ),
            ],
          ),
          const SizedBox(height: 16),
          CalloutCard(text: conversation.noObligation),
        ],
      ),
    );
  }
}

class _StageCard extends StatelessWidget {
  const _StageCard({required this.stage, required this.number, required this.selected, required this.onTap});

  final RelocationStage stage;
  final int number;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Semantics(
      button: true,
      selected: selected,
      label: '${stage.title}. ${stage.summary}',
      child: GestureDetector(
        onTap: onTap,
        child: SetaCard(
          highlighted: selected,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      AppCopy.stageKicker(number, stage.when).toUpperCase(),
                      style: SetaType.tag.copyWith(color: c.gold),
                    ),
                  ),
                  SelectedMark(selected: selected),
                ],
              ),
              const SizedBox(height: 10),
              Text(stage.title, style: SetaType.h2),
              const SizedBox(height: 8),
              Text(stage.summary, style: SetaType.body),
              const SizedBox(height: 10),
              for (final item in stage.items)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Container(
                          width: 5,
                          height: 5,
                          decoration: BoxDecoration(color: c.gold, shape: BoxShape.circle),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(item.label, style: SetaType.body.copyWith(color: c.white.withValues(alpha: .9))),
                            if (item.detail != null) Text(item.detail!, style: SetaType.small),
                          ],
                        ),
                      ),
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

/// Picks a month from the next two years, or clears it.
class _MonthField extends StatelessWidget {
  const _MonthField({required this.value, required this.onChanged});

  final DateTime? value;
  final ValueChanged<DateTime?> onChanged;

  static final _format = DateFormat('MMMM yyyy', 'en');

  Future<void> _pick(BuildContext context) async {
    final now = DateTime.now();
    final months = [for (var i = 0; i < 24; i++) DateTime(now.year, now.month + i)];
    final picked = await showModalBottomSheet<DateTime?>(
      context: context,
      useRootNavigator: true,
      isScrollControlled: true,
      builder: (sheet) => SafeArea(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxHeight: MediaQuery.sizeOf(sheet).height * .6),
          child: ListView(
            shrinkWrap: true,
            padding: const EdgeInsets.fromLTRB(SetaSpace.gutter, 0, SetaSpace.gutter, 12),
            children: [
              for (final m in months)
                ListTile(
                  title: Text(_format.format(m), style: SetaType.rowTitle),
                  trailing: value != null && value!.year == m.year && value!.month == m.month
                      ? const SetaIcon(SetaIcons.check, size: 18)
                      : null,
                  onTap: () => Navigator.of(sheet).pop(m),
                ),
            ],
          ),
        ),
      ),
    );
    if (picked != null) onChanged(picked);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Row(
      children: [
        Expanded(
          child: Semantics(
            button: true,
            label: value == null ? AppCopy.fieldArrivalHint : _format.format(value!),
            excludeSemantics: true,
            child: InkWell(
              borderRadius: BorderRadius.circular(SetaRadii.input),
              onTap: () => _pick(context),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: c.navyDeep.withValues(alpha: .6),
                  borderRadius: BorderRadius.circular(SetaRadii.input),
                  border: Border.all(color: c.gold.withValues(alpha: .35)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        value == null ? AppCopy.fieldArrivalHint : _format.format(value!),
                        style: SetaType.input.copyWith(color: value == null ? c.inkMute : c.white),
                      ),
                    ),
                    SetaIcon(SetaIcons.chevronDown, size: 18, color: c.gold),
                  ],
                ),
              ),
            ),
          ),
        ),
        if (value != null) ...[
          const SizedBox(width: 8),
          CircleIconButton(icon: SetaIcons.close, tooltip: 'Clear', onPressed: () => onChanged(null)),
        ],
      ],
    );
  }
}
