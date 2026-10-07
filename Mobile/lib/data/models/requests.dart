// Bodies for the website's public POST routes (src/lib/contact-schema.ts and
// src/lib/package-request-schema.ts).

import 'content.dart';

/// `POST /api/contact`.
class ContactRequest {
  const ContactRequest({
    required this.name,
    required this.email,
    required this.interest,
    required this.message,
    this.company = '',
  });

  final String name;
  final String company;
  final String email;
  final ServiceId interest;
  final String message;

  Map<String, Object?> toJson() => {
    'name': name.trim(),
    'company': company.trim(),
    'email': email.trim(),
    'interest': interest.key,
    'message': message.trim(),
  };
}

/// Who is asking, shared by both package requests.
class Requester {
  const Requester({required this.name, required this.company, required this.email, this.phone = '', this.message = ''});

  final String name;
  final String company;
  final String email;
  final String phone;
  final String message;

  Map<String, Object?> toJson() => {
    'name': name.trim(),
    'company': company.trim(),
    'email': email.trim(),
    'phone': phone.trim(),
    'message': message.trim(),
  };
}

/// `POST /api/requests` with `service: "special-services"`.
class SpecialServicesRequest {
  const SpecialServicesRequest({
    required this.employees,
    required this.packages,
    required this.flexItems,
    required this.eventIdeas,
    required this.requester,
    this.contractLength,
  });

  final int employees;
  final List<String> packages;
  final List<String> flexItems;
  final List<String> eventIdeas;
  final String? contractLength;
  final Requester requester;

  Map<String, Object?> toJson() => {
    'service': 'special-services',
    'employees': employees,
    'packages': packages,
    'flexItems': flexItems,
    'eventIdeas': eventIdeas,
    // The schema takes the key or nothing — never null.
    'contractLength': ?contractLength,
    'requester': requester.toJson(),
  };
}

/// `POST /api/requests` with `service: "relocation"`.
class RelocationRequest {
  const RelocationRequest({
    required this.stages,
    required this.options,
    required this.employees,
    required this.movingFrom,
    required this.destination,
    required this.requester,
    this.arrival = '',
  });

  /// Stage slugs, in the order of the move.
  final List<String> stages;
  final List<String> options;
  final int employees;
  final String movingFrom;
  final String destination;

  /// "YYYY-MM" or empty.
  final String arrival;
  final Requester requester;

  Map<String, Object?> toJson() => {
    'service': 'relocation',
    'stages': stages,
    'options': options,
    'employees': employees,
    'movingFrom': movingFrom.trim(),
    'destination': destination,
    'arrival': arrival,
    'requester': requester.toJson(),
  };
}
