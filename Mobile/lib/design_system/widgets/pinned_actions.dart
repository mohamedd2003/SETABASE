import 'package:material_ui/material_ui.dart';

import '../tokens.dart';

/// A full-screen layout with its buttons fixed along the bottom, as in the Figma frames.
/// The content above scrolls when a small screen or large text needs it, so the actions
/// never depend on how tall the text turns out.
class PinnedActions extends StatelessWidget {
  const PinnedActions({super.key, required this.content, required this.actions});

  final Widget content;
  final Widget actions;

  @override
  Widget build(BuildContext context) => SafeArea(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Expanded(child: SingleChildScrollView(child: content)),
        Padding(padding: const EdgeInsets.fromLTRB(SetaSpace.gutter, 16, SetaSpace.gutter, 24), child: actions),
      ],
    ),
  );
}
