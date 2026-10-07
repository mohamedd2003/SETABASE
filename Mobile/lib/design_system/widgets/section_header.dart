import 'package:material_ui/material_ui.dart';

import '../tokens.dart';
import 'gold_text.dart';

/// Eyebrow, heading and an optional line underneath, with an optional trailing action.
class SectionHeader extends StatelessWidget {
  const SectionHeader({
    super.key,
    required this.title,
    this.eyebrow,
    this.subtitle,
    this.trailing,
    this.titleStyle,
    this.center = false,
  });

  final String title;
  final String? eyebrow;
  final String? subtitle;
  final Widget? trailing;
  final TextStyle? titleStyle;
  final bool center;

  @override
  Widget build(BuildContext context) {
    final align = center ? TextAlign.center : TextAlign.start;
    final heading = Column(
      crossAxisAlignment: center ? CrossAxisAlignment.center : CrossAxisAlignment.start,
      children: [
        if (eyebrow != null) ...[EyebrowLabel(eyebrow!, textAlign: align), const SizedBox(height: 8)],
        Semantics(
          header: true,
          child: Text(title, style: titleStyle ?? SetaType.h1, textAlign: align),
        ),
        if (subtitle != null) ...[const SizedBox(height: 10), Text(subtitle!, style: SetaType.body, textAlign: align)],
      ],
    );
    if (trailing == null) return heading;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Expanded(child: heading),
        const SizedBox(width: 12),
        trailing!,
      ],
    );
  }
}
