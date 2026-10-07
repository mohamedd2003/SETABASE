import 'package:material_ui/material_ui.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

import '../../app/router.dart';
import '../../data/static/app_copy.dart';
import '../../design_system/icons.dart';
import '../../design_system/tokens.dart';
import '../../design_system/widgets/backdrops.dart';
import '../../design_system/widgets/cards.dart';
import '../../design_system/widgets/gold_pill_button.dart';
import '../../design_system/widgets/gold_text.dart';
import '../../design_system/widgets/pinned_actions.dart';
import 'submission.dart';

export 'submission.dart' show SentDetails;

/// 11 · Request sent — who we'll reply to and, for package requests, the reference.
class RequestSentScreen extends StatelessWidget {
  const RequestSentScreen({super.key, required this.details});

  final SentDetails details;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final rows = [
      (AppCopy.service, details.service),
      (AppCopy.replyBy, '${AppCopy.fieldEmail} · ${details.email}'),
      if (details.reference != null) (AppCopy.reference, details.reference!),
    ];

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) context.go(Routes.home);
      },
      child: Scaffold(
        body: BackdropView(
          backdrop: Backdrop.night,
          glow: const Rect.fromLTWH(.08, .1, .84, .32),
          child: PinnedActions(
            content: Padding(
              padding: const EdgeInsets.fromLTRB(SetaSpace.gutter, 28, SetaSpace.gutter, 0),
              child: Column(
                children: [
                  Container(
                        width: 96,
                        height: 96,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: c.gold.withValues(alpha: .14),
                          border: Border.all(color: c.gold, width: 1.5),
                        ),
                        child: const SetaIcon(SetaIcons.check, size: 44),
                      )
                      .animate()
                      .fadeIn(duration: 300.ms)
                      .scale(begin: const Offset(.85, .85), duration: 500.ms, curve: Curves.easeOutBack),
                  const SizedBox(height: 14),
                  const EyebrowLabel(AppCopy.requestSent),
                  const SizedBox(height: 14),
                  Semantics(
                    header: true,
                    liveRegion: true,
                    child: Text(AppCopy.thankYou(details.firstName), style: SetaType.h1, textAlign: TextAlign.center),
                  ),
                  const SizedBox(height: 14),
                  Text(AppCopy.gotYourRequest(details.service), style: SetaType.body, textAlign: TextAlign.center),
                  const SizedBox(height: 14),
                  SetaCard(
                    glass: true,
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
                    child: Column(
                      children: [
                        for (final (i, (label, value)) in rows.indexed)
                          Container(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            decoration: BoxDecoration(
                              border: i < rows.length - 1 ? Border(bottom: BorderSide(color: c.hair)) : null,
                            ),
                            child: Row(
                              children: [
                                Text(label, style: SetaType.small),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    value,
                                    textAlign: TextAlign.end,
                                    style: SetaType.label.copyWith(fontSize: 14, color: c.white),
                                  ),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            actions: Column(
              children: [
                ExcludeSemantics(child: Image.asset('assets/images/renders/skyline.png', height: 110)),
                const SizedBox(height: 8),
                GoldPillButton(label: AppCopy.backToHome, expand: true, onPressed: () => context.go(Routes.home)),
                const SizedBox(height: 6),
                GoldPillButton.ghost(label: AppCopy.exploreServices, onPressed: () => context.go(Routes.services)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
