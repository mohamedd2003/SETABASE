import 'package:material_ui/material_ui.dart';

import '../../data/static/app_copy.dart';
import '../../design_system/icons.dart';
import '../../design_system/tokens.dart';
import '../../design_system/widgets/bars.dart';
import '../../design_system/widgets/cards.dart';
import '../../design_system/widgets/gold_pill_button.dart';
import '../../design_system/widgets/gold_text.dart';

/// The opening of a packages page: who it's for, the promise and three facts.
class PlannerHero extends StatelessWidget {
  const PlannerHero({
    super.key,
    required this.eyebrow,
    required this.title,
    required this.paragraph,
    required this.facts,
  });

  final String eyebrow;
  final String title;
  final String paragraph;
  final List<String> facts;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      EyebrowLabel(eyebrow),
      const SizedBox(height: 10),
      Semantics(header: true, child: Text(title, style: SetaType.h1)),
      const SizedBox(height: 12),
      Text(paragraph, style: SetaType.body),
      const SizedBox(height: 14),
      for (final fact in facts)
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 5),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(padding: EdgeInsets.only(top: 2), child: SetaIcon(SetaIcons.check, size: 16)),
              const SizedBox(width: 10),
              Expanded(
                child: Text(fact, style: SetaType.body.copyWith(color: context.colors.white.withValues(alpha: .9))),
              ),
            ],
          ),
        ),
    ],
  );
}

class CatalogLoading extends StatelessWidget {
  const CatalogLoading({super.key});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 48),
    child: Center(child: CircularProgressIndicator(color: context.colors.gold, strokeWidth: 2)),
  );
}

class CatalogUnavailable extends StatelessWidget {
  const CatalogUnavailable({super.key, required this.onRetry});

  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 32),
    child: Column(
      children: [
        Text(AppCopy.errorOffline, style: SetaType.body, textAlign: TextAlign.center),
        const SizedBox(height: 14),
        GoldPillButton.outline(label: AppCopy.retry, onPressed: onRetry),
      ],
    ),
  );
}

/// Shown when the live catalog couldn't be reached and the bundled one is on screen.
class FallbackNote extends StatelessWidget {
  const FallbackNote({super.key, required this.onRetry});

  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) => Row(
    children: [
      Expanded(child: Text(AppCopy.catalogOffline, style: SetaType.small)),
      TextButton(
        onPressed: onRetry,
        child: Text(AppCopy.retry, style: SetaType.label.copyWith(color: context.colors.gold)),
      ),
    ],
  );
}

/// A round check that fills gold when its card is chosen.
class SelectedMark extends StatelessWidget {
  const SelectedMark({super.key, required this.selected});

  final bool selected;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 180),
      width: 28,
      height: 28,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: selected ? c.gold : Colors.transparent,
        border: Border.all(color: selected ? c.gold : c.lineGold),
      ),
      child: selected
          ? SetaIcon(SetaIcons.check, size: 16, color: c.navyDeep)
          : SetaIcon(SetaIcons.plus, size: 16, color: c.gold),
    );
  }
}

/// "Your selection" — what the request will carry.
class SelectionSummary extends StatelessWidget {
  const SelectionSummary({super.key, required this.lines, required this.emptyText});

  final List<({String label, String? detail})> lines;
  final String emptyText;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return SetaCard(
      padding: const EdgeInsets.fromLTRB(22, 20, 22, 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const EyebrowLabel(AppCopy.yourSelection),
          const SizedBox(height: 8),
          if (lines.isEmpty)
            Text(emptyText, style: SetaType.body)
          else
            for (final (i, line) in lines.indexed)
              Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  border: i < lines.length - 1 ? Border(bottom: BorderSide(color: c.hair)) : null,
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Text(line.label, style: SetaType.body.copyWith(color: c.white)),
                    ),
                    if (line.detail != null && line.detail!.isNotEmpty) ...[
                      const SizedBox(width: 12),
                      Flexible(
                        child: Text(line.detail!, style: SetaType.small, textAlign: TextAlign.end),
                      ),
                    ],
                  ],
                ),
              ),
        ],
      ),
    );
  }
}

/// The bar along the bottom while something is chosen: how many, the price, and a way on.
class SelectionDock extends StatelessWidget {
  const SelectionDock({
    super.key,
    required this.count,
    required this.detail,
    required this.actionLabel,
    required this.onAction,
  });

  final int count;
  final String detail;
  final String actionLabel;
  final VoidCallback onAction;

  @override
  Widget build(BuildContext context) => CtaDock(
    child: Row(
      children: [
        Expanded(
          child: Semantics(
            liveRegion: true,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(AppCopy.chosenCount(count), style: SetaType.rowTitle),
                Text(detail, style: SetaType.small, maxLines: 1, overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
        ),
        const SizedBox(width: 12),
        GoldPillButton(label: actionLabel, onPressed: onAction),
      ],
    ),
  );
}
