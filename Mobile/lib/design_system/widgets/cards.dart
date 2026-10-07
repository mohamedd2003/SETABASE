import 'dart:ui';

import 'package:material_ui/material_ui.dart';

import '../tokens.dart';
import 'gold_text.dart';

/// The base card: navy-deep with a soft gold hairline. [glass] is the translucent variant
/// used over photos and skies; [highlighted] is a selected card.
class SetaCard extends StatelessWidget {
  const SetaCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(22),
    this.glass = false,
    this.highlighted = false,
    this.color,
    this.borderColor,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final bool glass;
  final bool highlighted;
  final Color? color;
  final Color? borderColor;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final radius = BorderRadius.circular(context.cardRadius);
    final decorated = AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      padding: padding,
      decoration: BoxDecoration(
        color:
            color ??
            (highlighted
                ? c.gold.withValues(alpha: .10)
                : glass
                ? c.white.withValues(alpha: .05)
                : c.navyDeep),
        borderRadius: radius,
        border: Border.all(color: borderColor ?? (highlighted ? c.gold : c.gold.withValues(alpha: .30))),
        boxShadow: highlighted ? [BoxShadow(color: c.gold.withValues(alpha: .10), spreadRadius: 4)] : null,
      ),
      child: child,
    );
    if (!glass) return decorated;
    return ClipRRect(
      borderRadius: radius,
      child: BackdropFilter(filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12), child: decorated),
    );
  }
}

/// A gold-tinted card for reassurance, pricing and no-obligation messages.
class CalloutCard extends StatelessWidget {
  const CalloutCard({super.key, this.eyebrow, this.text, this.child});

  final String? eyebrow;
  final String? text;
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return SetaCard(
      color: c.gold.withValues(alpha: .07),
      borderColor: c.gold.withValues(alpha: .40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (eyebrow != null) ...[EyebrowLabel(eyebrow!), const SizedBox(height: 10)],
          if (text != null) Text(text!, style: SetaType.body.copyWith(color: c.white.withValues(alpha: .9))),
          ?child,
        ],
      ),
    );
  }
}

/// A short gold note under a description, e.g. a starting price or where we work.
class NoteBox extends StatelessWidget {
  const NoteBox(this.text, {super.key});

  final String text;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: c.gold.withValues(alpha: .08),
        borderRadius: BorderRadius.circular(SetaRadii.note),
      ),
      child: Text(text, style: SetaType.small.copyWith(color: c.gold)),
    );
  }
}

/// The rounded square that holds a department icon.
class IconBadge extends StatelessWidget {
  const IconBadge({super.key, required this.child, this.size = 52, this.round = false});

  final Widget child;
  final double size;
  final bool round;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: c.gold.withValues(alpha: .10),
        shape: round ? BoxShape.circle : BoxShape.rectangle,
        borderRadius: round ? null : BorderRadius.circular(SetaRadii.badge),
        border: Border.all(color: c.gold.withValues(alpha: .35)),
      ),
      child: child,
    );
  }
}

/// A 1px gold hairline.
class Hairline extends StatelessWidget {
  const Hairline({super.key});

  @override
  Widget build(BuildContext context) => Container(height: 1, color: context.colors.hair);
}
