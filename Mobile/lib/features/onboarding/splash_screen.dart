import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';

import '../../app/router.dart';
import '../../data/models/content.dart';
import '../../data/providers.dart';
import '../../data/static/app_copy.dart';
import '../../design_system/iso/iso_model_view.dart';
import '../../design_system/iso/iso_scene.dart';
import '../../design_system/tokens.dart';
import '../../design_system/widgets/backdrops.dart';
import '../../design_system/widgets/gold_pill_button.dart';
import '../../design_system/widgets/pinned_actions.dart';

/// 01 · Welcome: the site model rising, the logo and the promise.
class SplashScreen extends ConsumerWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) => Scaffold(
    body: BackdropView(
      backdrop: Backdrop.sky,
      glow: const Rect.fromLTWH(.05, .12, .9, .32),
      child: PinnedActions(
        content: Column(
          children: [
            IsoModelView(scene: siteScene(), height: 269, semanticLabel: AppCopy.siteModelLabel),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: SetaSpace.gutter),
              child: Column(
                children: [
                  Semantics(
                    label: 'SETABASE Services',
                    image: true,
                    excludeSemantics: true,
                    child: Image.asset('assets/images/logo/setabase-stacked.png', height: 84),
                  ),
                  const SizedBox(height: 18),
                  Semantics(
                    header: true,
                    child: Text(AppCopy.splashTitle, style: SetaType.h1, textAlign: TextAlign.center),
                  ),
                  const SizedBox(height: 14),
                  Text(AppCopy.splashTagline, style: SetaType.body, textAlign: TextAlign.center),
                ],
              ),
            ),
          ],
        ),
        actions: Column(
          children: [
            GoldPillButton(label: AppCopy.getStarted, expand: true, onPressed: () => context.push(Routes.audience)),
            const SizedBox(height: 6),
            GoldPillButton.ghost(
              label: AppCopy.exploreServices,
              onPressed: () async {
                // Browse without answering: Private for this session only.
                await ref.read(audienceChoiceProvider.notifier).choose(Audience.private, remember: false);
                if (context.mounted) context.go(Routes.services);
              },
            ),
          ],
        ),
      ),
    ),
  );
}
