import '../../core/api/api_client.dart';
import '../../data/static/app_copy.dart';

final _email = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]{2,}$');
final _phone = RegExp(r'^[+\d\s()-]*$');

/// The same rules as the website's zod schemas, so most mistakes show before sending.
abstract final class Validate {
  static String? name(String v) => v.trim().length < 2 ? AppCopy.errorName : null;

  static String? requiredCompany(String v) => v.trim().length < 2 ? AppCopy.errorCompany : null;

  static String? email(String v) => _email.hasMatch(v.trim()) ? null : AppCopy.errorEmail;

  static String? phone(String v) => _phone.hasMatch(v.trim()) ? null : AppCopy.errorPhone;

  static String? message(String v) => v.trim().length < 10 ? AppCopy.errorMessage : null;
}

/// A sentence for the banner above the submit button.
String describeSubmitError(Object error, {required String fallback}) => switch (error) {
  ApiOffline() => AppCopy.errorOffline,
  ApiValidation(:final fields) when fields.isNotEmpty => AppCopy.errorFields,
  ApiValidation(:final message) => message,
  ApiRateLimited(:final message) => message,
  ApiUnavailable(:final message) => message,
  _ => fallback,
};

/// What the confirmation screen shows.
class SentDetails {
  const SentDetails({required this.name, required this.service, required this.email, this.reference});

  final String name;
  final String service;
  final String email;
  final String? reference;

  String get firstName => name.trim().split(RegExp(r'\s+')).first;
}
