import 'package:dio/dio.dart';

/// What went wrong talking to the website, in terms a screen can act on.
sealed class ApiException implements Exception {
  const ApiException(this.message);
  final String message;

  @override
  String toString() => '$runtimeType: $message';
}

/// No connection, or the server didn't answer in time.
class ApiOffline extends ApiException {
  const ApiOffline() : super('offline');
}

/// The server rejected some fields. Keys are the request's dotted paths, e.g. `requester.email`.
class ApiValidation extends ApiException {
  const ApiValidation(super.message, this.fields);
  final Map<String, String> fields;
}

/// Too many requests from this network; [retryAfter] says when to try again.
class ApiRateLimited extends ApiException {
  const ApiRateLimited(super.message, this.retryAfter);
  final Duration? retryAfter;
}

/// The server can't take requests right now (no database in production).
class ApiUnavailable extends ApiException {
  const ApiUnavailable(super.message);
}

/// Anything else — a 500, an unexpected body.
class ApiFailure extends ApiException {
  const ApiFailure(super.message, {this.status});
  final int? status;
}

typedef ApiResponse = ({int status, Object? body, Headers headers});

/// A thin client for the website's public routes. Statuses are handled by callers,
/// because `/api/contact` and `/api/requests` answer in different shapes.
class ApiClient {
  ApiClient(this._dio);

  factory ApiClient.create(String baseUrl) => ApiClient(
    Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 10),
        sendTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 20),
        headers: {'Accept': 'application/json'},
        contentType: Headers.jsonContentType,
        responseType: ResponseType.json,
        validateStatus: (_) => true,
      ),
    ),
  );

  final Dio _dio;

  Future<ApiResponse> get(String path) => _send(() => _dio.get<Object?>(path));

  Future<ApiResponse> post(String path, Map<String, Object?> body) => _send(() => _dio.post<Object?>(path, data: body));

  Future<ApiResponse> _send(Future<Response<Object?>> Function() call) async {
    try {
      final r = await call();
      return (status: r.statusCode ?? 0, body: r.data, headers: r.headers);
    } on DioException catch (e) {
      switch (e.type) {
        case DioExceptionType.connectionError:
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          throw const ApiOffline();
        default:
          throw ApiFailure(e.message ?? 'Request failed', status: e.response?.statusCode);
      }
    }
  }
}

/// `{ "error": "..." }` or `{ "error": { "message": "..." } }` → the message, if any.
String? errorMessageOf(Object? body) {
  if (body is! Map) return null;
  final error = body['error'];
  if (error is String) return error;
  if (error is Map && error['message'] is String) return error['message'] as String;
  return null;
}

Duration? retryAfterOf(Headers headers) {
  final seconds = int.tryParse(headers.value('retry-after') ?? '');
  return seconds == null ? null : Duration(seconds: seconds);
}
