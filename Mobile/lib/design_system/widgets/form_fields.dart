import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';

import '../tokens.dart';

/// A labelled text field. Outlined with a gold focus glow on iOS; filled and underlined
/// on Android, as in the Figma file.
class SetaTextField extends StatefulWidget {
  const SetaTextField({
    super.key,
    required this.label,
    required this.controller,
    this.hint,
    this.errorText,
    this.keyboardType,
    this.textInputAction,
    this.autofillHints,
    this.textCapitalization = TextCapitalization.none,
    this.maxLines = 1,
    this.maxLength,
    this.inputFormatters,
    this.onChanged,
    this.onSubmitted,
    this.focusNode,
  });

  final String label;
  final TextEditingController controller;
  final String? hint;
  final String? errorText;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final Iterable<String>? autofillHints;
  final TextCapitalization textCapitalization;
  final int maxLines;
  final int? maxLength;
  final List<TextInputFormatter>? inputFormatters;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final FocusNode? focusNode;

  @override
  State<SetaTextField> createState() => _SetaTextFieldState();
}

class _SetaTextFieldState extends State<SetaTextField> {
  late final FocusNode _focus = widget.focusNode ?? FocusNode();
  bool _focused = false;

  @override
  void initState() {
    super.initState();
    _focus.addListener(_onFocus);
  }

  void _onFocus() => setState(() => _focused = _focus.hasFocus);

  @override
  void dispose() {
    _focus.removeListener(_onFocus);
    if (widget.focusNode == null) _focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final material = context.isMaterial;
    final hasError = widget.errorText != null;
    final accent = hasError ? c.error : c.gold;

    final InputBorder idle, focused;
    if (material) {
      const radius = BorderRadius.vertical(top: Radius.circular(8));
      idle = UnderlineInputBorder(
        borderRadius: radius,
        borderSide: BorderSide(color: hasError ? c.error : c.lineGold),
      );
      focused = UnderlineInputBorder(
        borderRadius: radius,
        borderSide: BorderSide(color: accent, width: 2),
      );
    } else {
      final radius = BorderRadius.circular(SetaRadii.input);
      idle = OutlineInputBorder(
        borderRadius: radius,
        borderSide: BorderSide(color: hasError ? c.error : c.gold.withValues(alpha: .35)),
      );
      focused = OutlineInputBorder(
        borderRadius: radius,
        borderSide: BorderSide(color: accent, width: 1.5),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.label, style: SetaType.label),
        const SizedBox(height: 8),
        AnimatedContainer(
          duration: const Duration(milliseconds: 160),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(SetaRadii.input),
            boxShadow: _focused && !material
                ? [BoxShadow(color: accent.withValues(alpha: .12), spreadRadius: 4)]
                : null,
          ),
          child: TextField(
            controller: widget.controller,
            focusNode: _focus,
            keyboardType: widget.keyboardType,
            textInputAction: widget.textInputAction,
            autofillHints: widget.autofillHints,
            textCapitalization: widget.textCapitalization,
            maxLines: widget.maxLines,
            minLines: widget.maxLines > 1 ? 4 : 1,
            maxLength: widget.maxLength,
            inputFormatters: widget.inputFormatters,
            onChanged: widget.onChanged,
            onSubmitted: widget.onSubmitted,
            style: SetaType.input,
            cursorColor: c.gold,
            decoration: InputDecoration(
              hintText: widget.hint,
              hintStyle: SetaType.input.copyWith(color: c.inkMute),
              filled: true,
              fillColor: material ? c.white.withValues(alpha: .06) : c.navyDeep.withValues(alpha: .6),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              counterText: '',
              border: idle,
              enabledBorder: idle,
              focusedBorder: focused,
            ),
          ),
        ),
        if (hasError) ...[
          const SizedBox(height: 6),
          Semantics(
            liveRegion: true,
            child: Text(widget.errorText!, style: SetaType.small.copyWith(color: c.error)),
          ),
        ],
      ],
    );
  }
}

/// A labelled group of chips or other controls, with an optional error under it.
class FieldGroup extends StatelessWidget {
  const FieldGroup({super.key, required this.label, required this.child, this.errorText});

  final String label;
  final Widget child;
  final String? errorText;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(label, style: SetaType.label),
      const SizedBox(height: 10),
      child,
      if (errorText != null) ...[
        const SizedBox(height: 6),
        Semantics(
          liveRegion: true,
          child: Text(errorText!, style: SetaType.small.copyWith(color: context.colors.error)),
        ),
      ],
    ],
  );
}
