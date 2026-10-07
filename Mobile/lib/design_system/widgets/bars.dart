import 'dart:ui';

import 'package:material_ui/material_ui.dart';

import '../icons.dart';
import '../tokens.dart';

/// The round 44pt icon button used in the header.
class CircleIconButton extends StatelessWidget {
  const CircleIconButton({
    super.key,
    required this.icon,
    required this.onPressed,
    required this.tooltip,
    this.iconColor,
  });

  final SetaIcons icon;
  final VoidCallback onPressed;
  final String tooltip;
  final Color? iconColor;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final material = context.isMaterial;
    return Tooltip(
      message: tooltip,
      child: Semantics(
        button: true,
        label: tooltip,
        excludeSemantics: true,
        child: ClipOval(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: material ? 0 : 10, sigmaY: material ? 0 : 10),
            child: Material(
              color: material ? Colors.transparent : c.navyDeep.withValues(alpha: .55),
              shape: CircleBorder(side: material ? BorderSide.none : BorderSide(color: c.lineGoldSoft)),
              child: InkWell(
                customBorder: const CircleBorder(),
                onTap: onPressed,
                child: SizedBox.square(
                  dimension: 44,
                  child: Center(
                    child: SetaIcon(icon, size: material ? 24 : 20, color: iconColor ?? (material ? c.white : c.gold)),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// The header: the SETABASE logo with actions, or a back button with an optional title.
class SetaAppBar extends StatelessWidget {
  const SetaAppBar.logo({super.key, this.actions = const []}) : title = null, onBack = null, _back = false;

  const SetaAppBar.back({super.key, this.title, this.onBack, this.actions = const []}) : _back = true;

  final String? title;
  final VoidCallback? onBack;
  final List<Widget> actions;
  final bool _back;

  @override
  Widget build(BuildContext context) {
    final material = context.isMaterial;
    final c = context.colors;
    Widget leading;
    if (_back) {
      leading = CircleIconButton(
        icon: material ? SetaIcons.arrowLeft : SetaIcons.backIos,
        tooltip: 'Back',
        onPressed: onBack ?? () => Navigator.of(context).maybePop(),
      );
    } else {
      leading = Semantics(
        label: 'SETABASE Services',
        image: true,
        excludeSemantics: true,
        child: Image.asset(
          'assets/images/logo/setabase-horizontal.png',
          height: 34,
          filterQuality: FilterQuality.medium,
        ),
      );
    }

    final titleText = title == null
        ? null
        : Text(
            title!,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: material
                ? SetaType.rowTitle.copyWith(fontSize: 22, fontWeight: FontWeight.w400)
                : SetaType.rowTitle.copyWith(color: c.white),
          );

    return SizedBox(
      height: material ? 64 : 60,
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: material && _back ? 4 : SetaSpace.gutter),
        child: Row(
          children: [
            leading,
            if (material && titleText != null) ...[
              const SizedBox(width: 8),
              Expanded(child: titleText),
            ] else
              const Spacer(),
            if (!material && titleText != null) ...[titleText, const Spacer()],
            ...actions,
            if (!material && _back && actions.isEmpty) const SizedBox(width: 44),
          ],
        ),
      ),
    );
  }
}

/// A fixed action area along the bottom, over the content.
class CtaDock extends StatelessWidget {
  const CtaDock({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final bottom = MediaQuery.paddingOf(context).bottom;
    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          padding: EdgeInsets.fromLTRB(SetaSpace.gutter, 16, SetaSpace.gutter, 16 + bottom),
          decoration: BoxDecoration(
            color: c.night.withValues(alpha: .9),
            border: Border(top: BorderSide(color: c.gold.withValues(alpha: .2))),
          ),
          child: child,
        ),
      ),
    );
  }
}
