import 'package:material_ui/material_ui.dart';

import '../icons.dart';
import '../tokens.dart';

enum PillVariant { primary, outline, ghost }

/// The brand button: an uppercase pill. Primary is gold-filled; outline fills gold while
/// pressed; ghost is plain white text.
class GoldPillButton extends StatefulWidget {
  const GoldPillButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = PillVariant.primary,
    this.expand = false,
    this.loading = false,
    this.icon,
  });

  const GoldPillButton.outline({
    super.key,
    required this.label,
    required this.onPressed,
    this.expand = false,
    this.loading = false,
    this.icon,
  }) : variant = PillVariant.outline;

  const GoldPillButton.ghost({
    super.key,
    required this.label,
    required this.onPressed,
    this.expand = false,
    this.loading = false,
    this.icon,
  }) : variant = PillVariant.ghost;

  final String label;
  final VoidCallback? onPressed;
  final PillVariant variant;

  /// Stretches to the available width.
  final bool expand;

  /// Shows a spinner and ignores taps, e.g. while a request is sending.
  final bool loading;
  final SetaIcons? icon;

  @override
  State<GoldPillButton> createState() => _GoldPillButtonState();
}

class _GoldPillButtonState extends State<GoldPillButton> {
  bool _pressed = false;

  void _setPressed(bool value) {
    if (_pressed != value) setState(() => _pressed = value);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final enabled = widget.onPressed != null && !widget.loading;
    final radius = BorderRadius.circular(context.isMaterial ? SetaRadii.buttonAndroid : SetaRadii.pill);

    final (Color fill, Color ink, Border? border, List<BoxShadow> shadow) = switch (widget.variant) {
      PillVariant.primary => (
        _pressed ? Color.lerp(c.gold, c.goldDark, .25)! : c.gold,
        c.navyDeep,
        null,
        [
          BoxShadow(
            color: c.gold.withValues(alpha: _pressed ? .3 : .45),
            blurRadius: 30,
            offset: const Offset(0, 10),
            spreadRadius: -12,
          ),
        ],
      ),
      PillVariant.outline => (
        _pressed ? c.gold : Colors.transparent,
        _pressed ? c.navyDeep : c.gold,
        Border.all(color: c.gold),
        const <BoxShadow>[],
      ),
      PillVariant.ghost => (
        _pressed ? c.white.withValues(alpha: .08) : Colors.transparent,
        c.white,
        null,
        const <BoxShadow>[],
      ),
    };

    final label = Text(
      widget.label.toUpperCase(),
      style: SetaType.button.copyWith(color: ink),
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
    );

    return Semantics(
      button: true,
      enabled: enabled,
      label: widget.label,
      excludeSemantics: true,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: enabled ? (_) => _setPressed(true) : null,
        onTapUp: enabled ? (_) => _setPressed(false) : null,
        onTapCancel: () => _setPressed(false),
        onTap: enabled ? widget.onPressed : null,
        child: AnimatedOpacity(
          duration: const Duration(milliseconds: 150),
          opacity: widget.onPressed == null ? .45 : 1,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 140),
            curve: Curves.easeOut,
            constraints: const BoxConstraints(minHeight: 48),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            decoration: BoxDecoration(color: fill, borderRadius: radius, border: border, boxShadow: shadow),
            child: Row(
              mainAxisSize: widget.expand ? MainAxisSize.max : MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (widget.loading)
                  SizedBox.square(dimension: 16, child: CircularProgressIndicator(strokeWidth: 2, color: ink))
                else if (widget.icon != null)
                  SetaIcon(widget.icon!, size: 18, color: ink),
                if (widget.loading || widget.icon != null) const SizedBox(width: 10),
                Flexible(child: label),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
