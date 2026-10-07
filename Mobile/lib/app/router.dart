import 'package:material_ui/material_ui.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../data/models/content.dart';
import '../data/providers.dart';
import '../features/contact/request_quote_screen.dart';
import '../features/contact/request_sent_screen.dart';
import '../features/guide/guide_screen.dart';
import '../features/home/home_screen.dart';
import '../features/onboarding/audience_screen.dart';
import '../features/onboarding/splash_screen.dart';
import '../features/relocation/relocation_planner_screen.dart';
import '../features/services/service_detail_screen.dart';
import '../features/services/services_screen.dart';
import '../features/special_services/special_services_screen.dart';
import 'app_shell.dart';

part 'router.g.dart';

abstract final class Routes {
  static const welcome = '/welcome';
  static const audience = '/audience';
  static const home = '/home';
  static const services = '/services';
  static const guide = '/guide';
  static const contact = '/contact';
  static const relocation = '/relocation';
  static const specialServices = '/special-services';
  static const sent = '/sent';

  static String service(ServiceId id) => '/service/${id.key}';
  static String contactAbout(ServiceId id) => '$contact?interest=${id.key}';
}

final _rootKey = GlobalKey<NavigatorState>(debugLabel: 'root');

/// Onboarding, then four tabs; detail pages and the planners open over the tabs.
@Riverpod(keepAlive: true)
GoRouter router(Ref ref) {
  bool chosen() => ref.read(audienceChoiceProvider) != null;

  return GoRouter(
    navigatorKey: _rootKey,
    initialLocation: chosen() ? Routes.home : Routes.welcome,
    redirect: (context, state) {
      final onboarding = state.matchedLocation == Routes.welcome || state.matchedLocation == Routes.audience;
      // Everything past onboarding needs an audience to show the right copy.
      if (!onboarding && !chosen()) return Routes.welcome;
      return null;
    },
    routes: [
      GoRoute(path: Routes.welcome, builder: (_, _) => const SplashScreen()),
      GoRoute(path: Routes.audience, builder: (_, _) => const AudienceScreen()),
      StatefulShellRoute.indexedStack(
        builder: (context, state, shell) => AppShell(shell: shell),
        branches: [
          StatefulShellBranch(
            routes: [GoRoute(path: Routes.home, builder: (_, _) => const HomeScreen())],
          ),
          StatefulShellBranch(
            routes: [GoRoute(path: Routes.services, builder: (_, _) => const ServicesScreen())],
          ),
          StatefulShellBranch(
            routes: [GoRoute(path: Routes.guide, builder: (_, _) => const GuideScreen())],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: Routes.contact,
                builder: (_, state) => RequestQuoteScreen(
                  key: ValueKey(state.uri.queryParameters['interest']),
                  initialInterest: ServiceId.fromKey(state.uri.queryParameters['interest']),
                ),
              ),
            ],
          ),
        ],
      ),
      GoRoute(
        path: '/service/:id',
        parentNavigatorKey: _rootKey,
        redirect: (_, state) => ServiceId.fromKey(state.pathParameters['id']) == null ? Routes.services : null,
        builder: (_, state) => ServiceDetailScreen(id: ServiceId.fromKey(state.pathParameters['id'])!),
      ),
      GoRoute(
        path: Routes.relocation,
        parentNavigatorKey: _rootKey,
        builder: (_, _) => const RelocationPlannerScreen(),
      ),
      GoRoute(
        path: Routes.specialServices,
        parentNavigatorKey: _rootKey,
        builder: (_, _) => const SpecialServicesScreen(),
      ),
      GoRoute(
        path: Routes.sent,
        parentNavigatorKey: _rootKey,
        redirect: (_, state) => state.extra is SentDetails ? null : Routes.home,
        pageBuilder: (_, state) => CustomTransitionPage(
          child: RequestSentScreen(details: state.extra! as SentDetails),
          transitionsBuilder: (_, animation, _, child) => FadeTransition(opacity: animation, child: child),
        ),
      ),
    ],
  );
}
