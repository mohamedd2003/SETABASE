import 'package:material_ui/material_ui.dart';

import '../../data/models/content.dart';
import '../icons.dart';
import '../tokens.dart';
import 'cards.dart';
import 'gold_text.dart';

/// One department as a card: icon and eyebrow, title, one-line description, optional note,
/// and a "Take me there" link along the bottom.
class DepartmentTile extends StatelessWidget {
  const DepartmentTile({super.key, required this.department, required this.linkLabel, this.onTap});

  final Department department;
  final String linkLabel;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Semantics(
      button: true,
      label: '${department.title}. ${department.description}',
      excludeSemantics: true,
      child: _PressScale(
        onTap: onTap,
        child: SetaCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  IconBadge(child: DeptIcon.service(department.id)),
                  const SizedBox(width: 12),
                  Expanded(child: EyebrowLabel(department.eyebrow)),
                ],
              ),
              const SizedBox(height: 14),
              Text(department.title, style: SetaType.h2),
              const SizedBox(height: 14),
              Text(department.description, style: SetaType.body),
              if (department.note != null) ...[const SizedBox(height: 14), NoteBox(department.note!)],
              const SizedBox(height: 14),
              const Hairline(),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: Text(linkLabel.toUpperCase(), style: SetaType.link.copyWith(color: c.gold)),
                  ),
                  const SetaIcon(SetaIcons.arrowRight, size: 20),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// A gentle press response for large tappable cards.
class _PressScale extends StatefulWidget {
  const _PressScale({required this.child, this.onTap});

  final Widget child;
  final VoidCallback? onTap;

  @override
  State<_PressScale> createState() => _PressScaleState();
}

class _PressScaleState extends State<_PressScale> {
  bool _down = false;

  @override
  Widget build(BuildContext context) => GestureDetector(
    behavior: HitTestBehavior.opaque,
    onTapDown: (_) => setState(() => _down = true),
    onTapUp: (_) => setState(() => _down = false),
    onTapCancel: () => setState(() => _down = false),
    onTap: widget.onTap,
    child: AnimatedScale(scale: _down ? .985 : 1, duration: const Duration(milliseconds: 120), child: widget.child),
  );
}
