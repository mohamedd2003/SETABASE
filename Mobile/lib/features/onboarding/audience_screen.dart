import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';

import '../../app/router.dart';
import '../../data/models/content.dart';
import '../../data/providers.dart';
import '../../data/static/app_copy.dart';
import '../../design_system/icons.dart';
import '../../design_system/iso/iso_model_view.dart';
import '../../design_system/iso/iso_scene.dart';
import '../../design_system/tokens.dart';
import '../../design_system/widgets/backdrops.dart';
import '../../design_system/widgets/bars.dart';
import '../../design_system/widgets/choices.dart';
import '../../design_system/widgets/gold_pill_button.dart';
import '../../design_system/widgets/pinned_actions.dart';

/// 02 · "Which best describes you?" — Private or Business, nothing more. The chosen
/// building lights up on the model; tapping a building picks it too.
class AudienceScreen extends ConsumerStatefulWidget {
  const AudienceScreen({super.key});

  @override
  ConsumerState<AudienceScreen> createState() => _AudienceScreenState();
}

class _AudienceScreenState extends ConsumerState<AudienceScreen> {
  late Audience _selected = ref.read(audienceChoiceProvider) ?? Audience.private;

  Future<void> _continue() async {
    await ref.read(audienceChoiceProvider.notifier).choose(_selected);
    if (mounted) context.go(Routes.home);
  }

  @override
  Widget build(BuildContext context) {
    final landing = ref.watch(contentProvider).landing;
    // 208pt on an 844pt-tall iPhone as in Figma; less on short phones.
    final modelHeight = (MediaQuery.sizeOf(context).height * .246).clamp(140.0, 260.0);

    return Scaffold(
      body: BackdropView(
        backdrop: Backdrop.sky,
        glow: const Rect.fromLTWH(.08, .08, .84, .3),
        child: PinnedActions(
          content: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              context.canPop() ? const SetaAppBar.back() : const SetaAppBar.logo(),
              IsoModelView(
                scene: siteScene(),
                height: modelHeight,
                animateIn: false,
                lit: {_selected.key},
                dim: {_selected.other.key},
                tapGroups: const ['private', 'business'],
                onTapGroup: (g) => setState(() => _selected = Audience.fromKey(g)!),
                semanticLabel: AppCopy.siteModelLabel,
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(SetaSpace.gutter, 24, SetaSpace.gutter, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Semantics(header: true, child: Text(landing.title, style: SetaType.h1)),
                    const SizedBox(height: 14),
                    Text(landing.intro, style: SetaType.body),
                    const SizedBox(height: 20),
                    for (final (i, a) in landing.audiences.indexed) ...[
                      if (i > 0) const SizedBox(height: 12),
                      ChoiceCard(
                        icon: a.audience == Audience.private ? SetaIcons.house : SetaIcons.building,
                        title: a.answer,
                        detail: a.detail,
                        selected: a.audience == _selected,
                        onTap: () => setState(() => _selected = a.audience),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
          actions: GoldPillButton(label: AppCopy.continueLabel, expand: true, onPressed: _continue),
        ),
      ),
    );
  }
}
