import '../../core/api/api_client.dart';
import '../models/requests.dart';

/// Sends enquiries and package requests to the website.
class RequestRepository {
  RequestRepository(this._api);

  final ApiClient _api;

  /// `POST /api/contact` → `{ ok: true }`, or `{ error, issues: [{ field, message }] }` on 422.
  Future<void> sendContact(ContactRequest request) async {
    final r = await _api.post('/api/contact', request.toJson());
    if (r.status == 200) return;
    final message = errorMessageOf(r.body) ?? 'Request failed';
    if (r.status == 422) {
      final issues = r.body is Map ? (r.body as Map)['issues'] : null;
      throw ApiValidation(message, {
        if (issues is List)
          for (final i in issues)
            if (i is Map && i['field'] is String && i['message'] is String)
              i['field'] as String: i['message'] as String,
      });
    }
    throw _common(r, message);
  }

  /// `POST /api/requests` → the new request id (null when the server only logged it).
  Future<String?> sendSpecialServices(SpecialServicesRequest request) => _sendPackages(request.toJson());

  Future<String?> sendRelocation(RelocationRequest request) => _sendPackages(request.toJson());

  Future<String?> _sendPackages(Map<String, Object?> body) async {
    final r = await _api.post('/api/requests', body);
    if (r.status == 201 || r.status == 200) {
      final data = r.body is Map ? (r.body as Map)['data'] : null;
      return data is Map && data['id'] is String ? data['id'] as String : null;
    }
    final message = errorMessageOf(r.body) ?? 'Request failed';
    if (r.status == 422) {
      final error = r.body is Map ? (r.body as Map)['error'] : null;
      final fields = error is Map ? error['fields'] : null;
      throw ApiValidation(message, {
        if (fields is Map)
          for (final e in fields.entries)
            if (e.key is String && e.value is String) e.key as String: e.value as String,
      });
    }
    throw _common(r, message);
  }

  ApiException _common(ApiResponse r, String message) => switch (r.status) {
    429 => ApiRateLimited(message, retryAfterOf(r.headers)),
    503 => ApiUnavailable(message),
    _ => ApiFailure(message, status: r.status),
  };
}

/// The short reference the website shows for a request: the id's last 8 characters.
String? referenceFor(String? id) => id == null || id.length < 8 ? null : id.substring(id.length - 8).toUpperCase();
