import 'package:material_ui/material_ui.dart';

import '../icons.dart';
import '../tokens.dart';
import 'cards.dart';
import 'gold_text.dart';

/// A list row: optional number, icon, title over a muted line, chevron. Rows separate
/// with a hairline; the last one in a group passes [divider] false.
class ServiceRow extends StatelessWidget {
  const ServiceRow({
    super.key,
    required this.title,
    this.subtitle,
    this.leading,
    this.number,
    this.trailing,
    this.onTap,
    this.divider = true,
    this.dense = false,
  });

  final String title;
  final String? subtitle;
  final Widget? leading;
  final int? number;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool divider;
  final bool dense;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Semantics(
      button: onTap != null,
      label: [title, ?subtitle].join(', '),
      excludeSemantics: true,
      child: InkWell(
        onTap: onTap,
        splashColor: c.gold.withValues(alpha: .08),
        highlightColor: c.gold.withValues(alpha: .05),
        child: Container(
          padding: EdgeInsets.symmetric(vertical: dense ? 9 : 14),
          decoration: BoxDecoration(
            border: divider ? Border(bottom: BorderSide(color: c.hair)) : null,
          ),
          child: Row(
            children: [
              if (number != null)
                SizedBox(
                  width: 24,
                  child: Text(
                    number!.toString().padLeft(2, '0'),
                    style: SetaType.small.copyWith(fontFamily: SetaType.h3.fontFamily, color: c.gold),
                  ),
                ),
              if (leading != null) ...[leading!, const SizedBox(width: 14)],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: SetaType.rowTitle),
                    if (subtitle != null) Text(subtitle!, style: SetaType.small),
                  ],
                ),
              ),
              trailing ?? SetaIcon(SetaIcons.chevronRight, size: 18, color: c.gold.withValues(alpha: .8)),
            ],
          ),
        ),
      ),
    );
  }
}

/// A check-mark list in a card — "What's included", "What we take care of".
class InfoList extends StatelessWidget {
  const InfoList({super.key, required this.items, this.eyebrow, this.title, this.lead});

  final List<String> items;
  final String? eyebrow;
  final String? title;
  final String? lead;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return SetaCard(
      padding: const EdgeInsets.fromLTRB(22, 20, 22, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (eyebrow != null) EyebrowLabel(eyebrow!),
          if (title != null) ...[if (eyebrow != null) const SizedBox(height: 8), Text(title!, style: SetaType.h3)],
          if (lead != null) ...[const SizedBox(height: 6), Text(lead!, style: SetaType.body)],
          const SizedBox(height: 6),
          for (final (i, item) in items.indexed)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                border: i < items.length - 1 ? Border(bottom: BorderSide(color: c.hair)) : null,
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(color: c.gold.withValues(alpha: .15), shape: BoxShape.circle),
                    child: const SetaIcon(SetaIcons.check, size: 14),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(top: 1),
                      child: Text(item, style: SetaType.body.copyWith(color: c.white.withValues(alpha: .9))),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

/// A numbered sequence — only for content that really is in order, like "How it works".
class StepList extends StatelessWidget {
  const StepList({super.key, required this.steps, this.eyebrow, this.startAt = 1});

  final List<({String title, String text})> steps;
  final String? eyebrow;
  final int startAt;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return SetaCard(
      padding: const EdgeInsets.fromLTRB(22, 20, 22, 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (eyebrow != null) ...[EyebrowLabel(eyebrow!), const SizedBox(height: 6)],
          for (final (i, step) in steps.indexed)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  IconBadge(
                    size: 32,
                    round: true,
                    child: Text('${startAt + i}', style: SetaType.h3.copyWith(fontSize: 15, color: c.gold, height: 1)),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(step.title, style: SetaType.rowTitle),
                        const SizedBox(height: 4),
                        Text(step.text, style: SetaType.body),
                      ],
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

/// Label and value on one line, as in a receipt.
class KeyValueRow extends StatelessWidget {
  const KeyValueRow({super.key, required this.label, required this.value, this.emphasis = false});

  final String label;
  final String value;
  final bool emphasis;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.baseline,
        textBaseline: TextBaseline.alphabetic,
        children: [
          Expanded(
            child: Text(label, style: SetaType.body.copyWith(color: emphasis ? c.white : null)),
          ),
          const SizedBox(width: 12),
          if (emphasis)
            GoldGradientText(value, style: SetaType.h2)
          else
            Text(
              value,
              style: SetaType.body.copyWith(color: c.white, fontWeight: FontWeight.w500),
            ),
        ],
      ),
    );
  }
}
