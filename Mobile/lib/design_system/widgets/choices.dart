import 'dart:ui';

import 'package:material_ui/material_ui.dart';

import '../icons.dart';
import '../tokens.dart';

/// A big answer card — "Private" / "Business" on onboarding.
class ChoiceCard extends StatelessWidget {
  const ChoiceCard({
    super.key,
    required this.icon,
    required this.title,
    required this.detail,
    required this.selected,
    required this.onTap,
  });

  final SetaIcons icon;
  final String title;
  final String detail;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final radius = BorderRadius.circular(context.cardRadius);
    return Semantics(
      button: true,
      selected: selected,
      label: '$title. $detail',
      excludeSemantics: true,
      child: GestureDetector(
        onTap: onTap,
        child: ClipRRect(
          borderRadius: radius,
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 220),
              curve: Curves.easeOut,
              padding: const EdgeInsets.fromLTRB(20, 20, 16, 20),
              decoration: BoxDecoration(
                color: selected ? c.gold.withValues(alpha: .10) : c.white.withValues(alpha: .05),
                borderRadius: radius,
                border: Border.all(color: selected ? c.gold : c.gold.withValues(alpha: .35)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: c.gold.withValues(alpha: .10),
                      border: Border.all(color: c.gold.withValues(alpha: .35)),
                    ),
                    child: SetaIcon(icon),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(title, style: SetaType.choice),
                        const SizedBox(height: 4),
                        Text(detail, style: SetaType.small.copyWith(color: c.inkSoft)),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  const SetaIcon(SetaIcons.chevronRight, size: 20),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// A pill chip that toggles. Selected chips turn gold with a check.
class SelectionChip extends StatelessWidget {
  const SelectionChip({
    super.key,
    required this.label,
    required this.selected,
    required this.onTap,
    this.detail,
    this.enabled = true,
  });

  final String label;
  final bool selected;
  final VoidCallback? onTap;

  /// A second, smaller line — a price or "included".
  final String? detail;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final ink = selected ? c.gold : c.inkSoft;
    return Semantics(
      button: true,
      selected: selected,
      enabled: enabled,
      label: [label, ?detail].join(', '),
      excludeSemantics: true,
      child: GestureDetector(
        onTap: enabled ? onTap : null,
        child: AnimatedOpacity(
          duration: const Duration(milliseconds: 150),
          opacity: enabled ? 1 : .5,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 160),
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: detail == null ? 10 : 8),
            decoration: BoxDecoration(
              color: selected ? c.gold.withValues(alpha: .16) : Colors.transparent,
              borderRadius: BorderRadius.circular(context.isMaterial ? SetaRadii.chipAndroid : SetaRadii.pill),
              border: Border.all(color: selected ? c.gold : c.gold.withValues(alpha: .40)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (selected) ...[const SetaIcon(SetaIcons.check, size: 14), const SizedBox(width: 6)],
                Flexible(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(label, style: SetaType.label.copyWith(color: ink)),
                      if (detail != null)
                        Text(
                          detail!,
                          style: SetaType.small.copyWith(
                            fontSize: 12,
                            color: selected ? c.gold.withValues(alpha: .8) : c.inkMute,
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Two or more options in one pill track — Private | Business, Property | Facility.
class SegmentedSwitch<T> extends StatelessWidget {
  const SegmentedSwitch({super.key, required this.options, required this.selected, required this.onChanged});

  final List<({T value, String label, SetaIcons? icon})> options;
  final T selected;
  final ValueChanged<T> onChanged;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: c.navyDeep.withValues(alpha: .70),
        borderRadius: BorderRadius.circular(SetaRadii.pill),
        border: Border.all(color: c.gold.withValues(alpha: .25)),
      ),
      child: Row(
        children: [
          for (final o in options)
            Expanded(
              child: Semantics(
                button: true,
                selected: o.value == selected,
                label: o.label,
                excludeSemantics: true,
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => onChanged(o.value),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    curve: Curves.easeOut,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: o.value == selected ? c.gold : Colors.transparent,
                      borderRadius: BorderRadius.circular(SetaRadii.pill),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (o.icon != null) ...[
                          SetaIcon(o.icon!, size: 16, color: o.value == selected ? c.navyDeep : c.inkSoft),
                          const SizedBox(width: 8),
                        ],
                        Flexible(
                          child: Text(
                            o.label,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: SetaType.label.copyWith(color: o.value == selected ? c.navyDeep : c.inkSoft),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
