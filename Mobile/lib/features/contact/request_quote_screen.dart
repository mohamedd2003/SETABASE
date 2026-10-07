import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../app/router.dart';
import '../../core/api/api_client.dart';
import '../../data/models/content.dart';
import '../../data/models/requests.dart';
import '../../data/providers.dart';
import '../../data/static/app_copy.dart';
import '../../design_system/icons.dart';
import '../../design_system/tokens.dart';
import '../../design_system/widgets/cards.dart';
import '../../design_system/widgets/choices.dart';
import '../../design_system/widgets/form_fields.dart';
import '../../design_system/widgets/gold_pill_button.dart';
import '../../design_system/widgets/gold_text.dart';
import '../../design_system/widgets/rows.dart';
import '../../design_system/widgets/section_header.dart';
import 'submission.dart';

/// 10 · Request a quote — the website's contact form, posted to `/api/contact`.
class RequestQuoteScreen extends ConsumerStatefulWidget {
  const RequestQuoteScreen({super.key, this.initialInterest});

  final ServiceId? initialInterest;

  @override
  ConsumerState<RequestQuoteScreen> createState() => _RequestQuoteScreenState();
}

class _RequestQuoteScreenState extends ConsumerState<RequestQuoteScreen> {
  final _name = TextEditingController();
  final _company = TextEditingController();
  final _email = TextEditingController();
  final _message = TextEditingController();
  late ServiceId? _interest = widget.initialInterest;

  Map<String, String> _errors = {};
  String? _banner;
  bool _sending = false;

  @override
  void dispose() {
    for (final c in [_name, _company, _email, _message]) {
      c.dispose();
    }
    super.dispose();
  }

  Map<String, String> _validate() => {
    'name': ?Validate.name(_name.text),
    'email': ?Validate.email(_email.text),
    if (_interest == null) 'interest': AppCopy.errorInterest,
    'message': ?Validate.message(_message.text),
  };

  Future<void> _submit(AudiencePage page) async {
    FocusScope.of(context).unfocus();
    final errors = _validate();
    setState(() {
      _errors = errors;
      _banner = errors.isEmpty ? null : AppCopy.errorFields;
    });
    if (errors.isNotEmpty) return;

    setState(() => _sending = true);
    final site = ref.read(contentProvider).site;
    try {
      await ref
          .read(requestRepositoryProvider)
          .sendContact(
            ContactRequest(
              name: _name.text,
              company: _company.text,
              email: _email.text,
              interest: _interest!,
              message: _message.text,
            ),
          );
      if (!mounted) return;
      final details = SentDetails(
        name: _name.text,
        service: page.contact.interests.firstWhere((i) => i.value == _interest).label,
        email: _email.text.trim(),
      );
      for (final c in [_name, _company, _email, _message]) {
        c.clear();
      }
      setState(() {
        _sending = false;
        _interest = null;
      });
      context.go(Routes.sent, extra: details);
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _sending = false;
        _errors = e is ApiValidation ? e.fields : {};
        _banner = describeSubmitError(e, fallback: AppCopy.contactFailed(site.email));
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final page = ref.watch(audiencePageProvider);
    final site = ref.watch(contentProvider).site;
    final contact = page.contact;
    final interests = contact.interests;
    if (_interest != null && !interests.any((i) => i.value == _interest)) _interest = null;

    return Scaffold(
      body: DecoratedBox(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [c.navyDeep, c.night],
          ),
        ),
        child: CustomScrollView(
          slivers: [
            SliverSafeArea(
              bottom: false,
              sliver: SliverPadding(
                padding: const EdgeInsets.fromLTRB(SetaSpace.gutter, 12, SetaSpace.gutter, 0),
                sliver: SliverList.list(
                  children: [
                    SectionHeader(eyebrow: AppCopy.contactEyebrow, title: contact.title, subtitle: contact.intro),
                    const SizedBox(height: 24),
                    AutofillGroup(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          SetaTextField(
                            label: AppCopy.fieldName,
                            hint: AppCopy.fieldNameHint,
                            controller: _name,
                            errorText: _errors['name'],
                            autofillHints: const [AutofillHints.name],
                            textCapitalization: TextCapitalization.words,
                            textInputAction: TextInputAction.next,
                          ),
                          const SizedBox(height: 18),
                          SetaTextField(
                            label: AppCopy.fieldCompanyOptional,
                            hint: AppCopy.fieldCompanyHint,
                            controller: _company,
                            errorText: _errors['company'],
                            maxLength: 120,
                            autofillHints: const [AutofillHints.organizationName],
                            textCapitalization: TextCapitalization.words,
                            textInputAction: TextInputAction.next,
                          ),
                          const SizedBox(height: 18),
                          SetaTextField(
                            label: AppCopy.fieldEmail,
                            hint: AppCopy.fieldEmailHint,
                            controller: _email,
                            errorText: _errors['email'],
                            keyboardType: TextInputType.emailAddress,
                            autofillHints: const [AutofillHints.email],
                            textInputAction: TextInputAction.next,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 18),
                    FieldGroup(
                      label: AppCopy.fieldInterest,
                      errorText: _errors['interest'],
                      child: Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          for (final i in interests)
                            SelectionChip(
                              label: i.label,
                              selected: i.value == _interest,
                              onTap: () => setState(() => _interest = i.value),
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 18),
                    SetaTextField(
                      label: AppCopy.fieldMessage,
                      hint: AppCopy.fieldMessageHint,
                      controller: _message,
                      errorText: _errors['message'],
                      maxLines: 6,
                      maxLength: 2000,
                      keyboardType: TextInputType.multiline,
                      textCapitalization: TextCapitalization.sentences,
                    ),
                    if (_banner != null) ...[const SizedBox(height: 18), _ErrorBanner(_banner!)],
                    const SizedBox(height: 20),
                    GoldPillButton(
                      label: _sending ? AppCopy.sending : contact.submit,
                      expand: true,
                      loading: _sending,
                      onPressed: () => _submit(page),
                    ),
                    const SizedBox(height: 10),
                    Text(contact.helper, style: SetaType.small, textAlign: TextAlign.center),
                    const SizedBox(height: 4),
                    Text(site.reassurance, style: SetaType.small, textAlign: TextAlign.center),
                    const SizedBox(height: 28),
                    _OfficeCard(site: site),
                  ],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.only(top: 32, bottom: MediaQuery.paddingOf(context).bottom + 12),
                child: ExcludeSemantics(child: Image.asset('assets/images/renders/skyline.png', height: 140)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OfficeCard extends StatelessWidget {
  const _OfficeCard({required this.site});

  final SiteInfo site;

  @override
  Widget build(BuildContext context) {
    final rows = [
      (SetaIcons.mapPin, AppCopy.visit, site.office.full, Uri.parse(site.office.directions)),
      (SetaIcons.mail, AppCopy.fieldEmail, site.email, Uri(scheme: 'mailto', path: site.email)),
      (SetaIcons.phone, AppCopy.call, site.phone, Uri(scheme: 'tel', path: site.phone.replaceAll(' ', ''))),
    ];
    return SetaCard(
      glass: true,
      padding: const EdgeInsets.fromLTRB(22, 20, 22, 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const EyebrowLabel(AppCopy.ourOffice),
          const SizedBox(height: 4),
          for (final (i, (icon, label, value, uri)) in rows.indexed)
            ServiceRow(
              leading: IconBadge(size: 40, round: true, child: SetaIcon(icon, size: 18)),
              title: value,
              subtitle: label,
              divider: i < rows.length - 1,
              onTap: () => launchUrl(uri, mode: LaunchMode.externalApplication),
            ),
          const SizedBox(height: 4),
          Text(site.locations, style: SetaType.small),
          const SizedBox(height: 14),
        ],
      ),
    );
  }
}

class _ErrorBanner extends StatelessWidget {
  const _ErrorBanner(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Semantics(
      liveRegion: true,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: c.error.withValues(alpha: .1),
          borderRadius: BorderRadius.circular(SetaRadii.input),
          border: Border.all(color: c.error.withValues(alpha: .5)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SetaIcon(SetaIcons.alert, size: 18, color: c.error),
            const SizedBox(width: 10),
            Expanded(
              child: Text(text, style: SetaType.body.copyWith(color: c.white)),
            ),
          ],
        ),
      ),
    );
  }
}

/// The error banner, shared with the planners' request forms.
class SubmitErrorBanner extends StatelessWidget {
  const SubmitErrorBanner(this.text, {super.key});

  final String text;

  @override
  Widget build(BuildContext context) => _ErrorBanner(text);
}
