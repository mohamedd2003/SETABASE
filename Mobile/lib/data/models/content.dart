// The website's copy, as exported by tool/export_content.mjs into assets/content/content.json.
// Widgets read everything from these models, so Private and Business share the same screens.

typedef Json = Map<String, dynamic>;

List<T> _list<T>(Object? raw, T Function(Json) parse) => [
  for (final item in (raw as List? ?? const [])) parse(item as Json),
];

List<String> _strings(Object? raw) => [for (final s in (raw as List? ?? const [])) s as String];

/// Who the app is looking after. Chosen once on onboarding and remembered.
enum Audience {
  private('private'),
  business('business');

  const Audience(this.key);
  final String key;

  static Audience? fromKey(String? key) {
    for (final a in values) {
      if (a.key == key) return a;
    }
    return null;
  }

  Audience get other => this == private ? business : private;
}

/// The website's department ids. They are also the `interest` values `/api/contact` accepts.
enum ServiceId {
  propertyManagement('property-management'),
  facilityManagement('facility-management'),
  relocation('relocation'),
  specialServices('special-services'),
  realEstate('real-estate');

  const ServiceId(this.key);
  final String key;

  static ServiceId? fromKey(String? key) {
    for (final s in values) {
      if (s.key == key) return s;
    }
    return null;
  }
}

class AppContent {
  const AppContent({
    required this.site,
    required this.landing,
    required this.audiences,
    required this.explainer,
    required this.relocation,
    required this.specialServices,
    required this.fallbackOffers,
    required this.fallbackRelocationPackages,
  });

  factory AppContent.fromJson(Json json) {
    final audiences = json['audiences'] as Json;
    final fallback = json['fallbackCatalog'] as Json;
    return AppContent(
      site: SiteInfo.fromJson(json['site'] as Json),
      landing: Landing.fromJson(json['landing'] as Json),
      audiences: {
        Audience.private: AudiencePage.fromJson(audiences['private'] as Json),
        Audience.business: AudiencePage.fromJson(audiences['business'] as Json),
      },
      explainer: Explainer.fromJson(json['explainer'] as Json),
      relocation: RelocationContent.fromJson(json['relocation'] as Json),
      specialServices: SpecialServicesContent.fromJson(json['specialServices'] as Json),
      fallbackOffers: (fallback['specialOffers'] as List).cast<Json>(),
      fallbackRelocationPackages: (fallback['relocationPackages'] as List).cast<Json>(),
    );
  }

  final SiteInfo site;
  final Landing landing;
  final Map<Audience, AudiencePage> audiences;
  final Explainer explainer;
  final RelocationContent relocation;
  final SpecialServicesContent specialServices;

  /// Raw `SpecialOffer` / `RelocationPackage` JSON, used when the live catalog can't be reached.
  final List<Json> fallbackOffers;
  final List<Json> fallbackRelocationPackages;

  AudiencePage page(Audience audience) => audiences[audience]!;
}

class SiteInfo {
  const SiteInfo({
    required this.name,
    required this.description,
    required this.office,
    required this.email,
    required this.phone,
    required this.locations,
    required this.reassurance,
    required this.pricingOnRequest,
    required this.creditLabel,
    required this.creditHref,
  });

  factory SiteInfo.fromJson(Json json) {
    final credit = json['credit'] as Json;
    return SiteInfo(
      name: json['name'] as String,
      description: json['description'] as String,
      office: Office.fromJson(json['office'] as Json),
      email: json['email'] as String,
      phone: json['phone'] as String,
      locations: json['locations'] as String,
      reassurance: json['reassurance'] as String,
      pricingOnRequest: json['pricingOnRequest'] as String,
      creditLabel: credit['label'] as String,
      creditHref: credit['href'] as String,
    );
  }

  final String name;
  final String description;
  final Office office;
  final String email;
  final String phone;
  final String locations;
  final String reassurance;
  final String pricingOnRequest;
  final String creditLabel;
  final String creditHref;
}

class Office {
  const Office({
    required this.short,
    required this.full,
    required this.lines,
    required this.place,
    required this.directions,
  });

  factory Office.fromJson(Json json) => Office(
    short: json['short'] as String,
    full: json['full'] as String,
    lines: _strings(json['lines']),
    place: json['place'] as String,
    directions: json['directions'] as String,
  );

  final String short;
  final String full;
  final List<String> lines;
  final String place;
  final String directions;
}

class Landing {
  const Landing({required this.title, required this.intro, required this.audiences});

  factory Landing.fromJson(Json json) => Landing(
    title: json['title'] as String,
    intro: json['intro'] as String,
    audiences: _list(json['audiences'], LandingAudience.fromJson),
  );

  final String title;
  final String intro;
  final List<LandingAudience> audiences;
}

class LandingAudience {
  const LandingAudience({required this.audience, required this.answer, required this.detail});

  factory LandingAudience.fromJson(Json json) => LandingAudience(
    audience: Audience.fromKey(json['key'] as String)!,
    answer: json['answer'] as String,
    detail: json['detail'] as String,
  );

  final Audience audience;
  final String answer;
  final String detail;
}

class AudiencePage {
  const AudiencePage({
    required this.audience,
    required this.switchLabel,
    required this.hero,
    required this.servicesTitle,
    required this.servicesSubtitle,
    required this.departments,
    required this.contact,
  });

  factory AudiencePage.fromJson(Json json) {
    final services = json['services'] as Json;
    return AudiencePage(
      audience: Audience.fromKey(json['slug'] as String)!,
      switchLabel: (json['switchLink'] as Json)['label'] as String,
      hero: AudienceHero.fromJson(json['hero'] as Json),
      servicesTitle: services['title'] as String,
      servicesSubtitle: services['subtitle'] as String,
      departments: _list(services['departments'], Department.fromJson),
      contact: ContactBlock.fromJson(json['contact'] as Json),
    );
  }

  final Audience audience;
  final String switchLabel;
  final AudienceHero hero;
  final String servicesTitle;
  final String servicesSubtitle;
  final List<Department> departments;
  final ContactBlock contact;

  Department? department(ServiceId id) {
    for (final d in departments) {
      if (d.id == id) return d;
    }
    return null;
  }
}

class AudienceHero {
  const AudienceHero({
    required this.title,
    required this.paragraph,
    required this.cta,
    required this.secondaryCta,
    required this.strapline,
    required this.photos,
    required this.summaryEyebrow,
    required this.summaryRows,
  });

  factory AudienceHero.fromJson(Json json) {
    final summary = json['summary'] as Json;
    return AudienceHero(
      title: json['title'] as String,
      paragraph: json['paragraph'] as String,
      cta: json['cta'] as String,
      secondaryCta: json['secondaryCta'] as String?,
      strapline: json['strapline'] as String?,
      photos: _list(json['photos'], HeroPhoto.fromJson),
      summaryEyebrow: summary['eyebrow'] as String,
      summaryRows: _list(summary['rows'], SummaryRow.fromJson),
    );
  }

  final String title;
  final String paragraph;
  final String cta;
  final String? secondaryCta;
  final String? strapline;
  final List<HeroPhoto> photos;
  final String summaryEyebrow;
  final List<SummaryRow> summaryRows;
}

class HeroPhoto {
  const HeroPhoto({required this.file, required this.alt, required this.alignmentX});

  factory HeroPhoto.fromJson(Json json) {
    // CSS object-position "42% 50%" → the horizontal focus, which is what matters on a phone.
    final x = double.tryParse((json['position'] as String).split(' ').first.replaceAll('%', ''));
    return HeroPhoto(file: json['src'] as String, alt: json['alt'] as String, alignmentX: x == null ? 0 : x / 50 - 1);
  }

  final String file;
  final String alt;

  /// -1 (left edge) to 1 (right edge).
  final double alignmentX;

  String get asset => 'assets/images/hero/$file';
}

class SummaryRow {
  const SummaryRow({required this.id, required this.label, required this.audience});

  factory SummaryRow.fromJson(Json json) => SummaryRow(
    id: ServiceId.fromKey(json['id'] as String)!,
    label: json['label'] as String,
    audience: json['audience'] as String,
  );

  final ServiceId id;
  final String label;
  final String audience;
}

class Department {
  const Department({
    required this.id,
    required this.eyebrow,
    required this.title,
    required this.description,
    required this.note,
    required this.hasPackages,
    required this.detail,
  });

  factory Department.fromJson(Json json) => Department(
    id: ServiceId.fromKey(json['id'] as String)!,
    eyebrow: json['eyebrow'] as String,
    title: json['title'] as String,
    description: json['description'] as String,
    note: json['note'] as String?,
    hasPackages: json['packagesHref'] != null,
    detail: json['detail'] == null ? null : ServiceDetail.fromJson(json['detail'] as Json),
  );

  final ServiceId id;
  final String eyebrow;
  final String title;
  final String description;
  final String? note;

  /// The website gives this department a packages page (Corporate Relocation, Special Services).
  final bool hasPackages;
  final ServiceDetail? detail;
}

class ServiceDetail {
  const ServiceDetail({
    required this.intro,
    required this.groups,
    required this.steps,
    required this.pricing,
    required this.closing,
  });

  factory ServiceDetail.fromJson(Json json) => ServiceDetail(
    intro: json['intro'] as String?,
    groups: _list(json['groups'], ServiceGroup.fromJson),
    steps: _list(json['steps'], ServiceStep.fromJson),
    pricing: json['pricing'] as String?,
    closing: json['closing'] as String?,
  );

  final String? intro;
  final List<ServiceGroup> groups;
  final List<ServiceStep> steps;
  final String? pricing;
  final String? closing;
}

class ServiceGroup {
  const ServiceGroup({required this.title, required this.lead, required this.items});

  factory ServiceGroup.fromJson(Json json) =>
      ServiceGroup(title: json['title'] as String, lead: json['lead'] as String?, items: _strings(json['items']));

  final String title;
  final String? lead;
  final List<String> items;
}

class ServiceStep {
  const ServiceStep({required this.title, required this.text});

  factory ServiceStep.fromJson(Json json) => ServiceStep(title: json['title'] as String, text: json['text'] as String);

  final String title;
  final String text;
}

class ContactBlock {
  const ContactBlock({
    required this.title,
    required this.intro,
    required this.interests,
    required this.submit,
    required this.helper,
  });

  factory ContactBlock.fromJson(Json json) => ContactBlock(
    title: json['title'] as String,
    intro: json['intro'] as String,
    interests: _list(json['interests'], Interest.fromJson),
    submit: json['submit'] as String,
    helper: json['helper'] as String,
  );

  final String title;
  final String intro;
  final List<Interest> interests;
  final String submit;
  final String helper;
}

class Interest {
  const Interest({required this.value, required this.label});

  factory Interest.fromJson(Json json) =>
      Interest(value: ServiceId.fromKey(json['value'] as String)!, label: json['label'] as String);

  final ServiceId value;
  final String label;
}

class Explainer {
  const Explainer({required this.title, required this.intro, required this.columns, required this.closing});

  factory Explainer.fromJson(Json json) => Explainer(
    title: json['title'] as String,
    intro: json['intro'] as String,
    columns: _list(json['columns'], ExplainerColumn.fromJson),
    closing: json['closing'] as String,
  );

  final String title;
  final String intro;
  final List<ExplainerColumn> columns;
  final String closing;
}

class ExplainerColumn {
  const ExplainerColumn({required this.title, required this.summary, required this.example});

  factory ExplainerColumn.fromJson(Json json) => ExplainerColumn(
    title: json['title'] as String,
    summary: json['summary'] as String,
    example: json['example'] as String,
  );

  final String title;
  final String summary;
  final String example;
}

class RelocationContent {
  const RelocationContent({
    required this.openingTitle,
    required this.openingParagraph,
    required this.openingFacts,
    required this.conversation,
    required this.nextTitle,
    required this.nextText,
    required this.destinations,
    required this.exclusions,
  });

  factory RelocationContent.fromJson(Json json) {
    final opening = json['opening'] as Json;
    final next = json['next'] as Json;
    return RelocationContent(
      openingTitle: opening['title'] as String,
      openingParagraph: opening['paragraph'] as String,
      openingFacts: _strings(opening['facts']),
      conversation: Conversation.fromJson(json['conversation'] as Json),
      nextTitle: next['title'] as String,
      nextText: next['text'] as String,
      destinations: _strings(json['destinations']),
      exclusions: json['exclusions'] as String,
    );
  }

  final String openingTitle;
  final String openingParagraph;
  final List<String> openingFacts;
  final Conversation conversation;
  final String nextTitle;
  final String nextText;

  /// The exact strings `/api/requests` accepts as `destination`.
  final List<String> destinations;
  final String exclusions;
}

class Conversation {
  const Conversation({
    required this.when,
    required this.title,
    required this.summary,
    required this.questionsLead,
    required this.questions,
    required this.noObligation,
  });

  factory Conversation.fromJson(Json json) => Conversation(
    when: json['when'] as String,
    title: json['title'] as String,
    summary: json['summary'] as String,
    questionsLead: json['questionsLead'] as String,
    questions: _strings(json['questions']),
    noObligation: json['noObligation'] as String,
  );

  final String when;
  final String title;
  final String summary;
  final String questionsLead;
  final List<String> questions;
  final String noObligation;
}

class SpecialServicesContent {
  const SpecialServicesContent({required this.steps, required this.terms, required this.contractLengths});

  factory SpecialServicesContent.fromJson(Json json) => SpecialServicesContent(
    steps: _list(json['steps'], ServiceStep.fromJson),
    terms: _strings(json['terms']),
    contractLengths: [
      for (final c in json['contractLengths'] as List)
        (value: (c as Json)['value'] as String, label: c['label'] as String),
    ],
  );

  final List<ServiceStep> steps;
  final List<String> terms;

  /// The `contractLength` values `/api/requests` accepts, with their labels.
  final List<({String value, String label})> contractLengths;
}
