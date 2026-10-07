import 'dart:ui';

import 'package:material_ui/material_ui.dart';

import '../icons.dart';
import '../tokens.dart';

typedef TabItem = ({String label, SetaIcons icon});

/// The bottom navigation: an iOS tab bar with a gold indicator on top, or a Material 3
/// navigation bar with a pill behind the active icon on Android — as in the Figma file.
class SetaTabBar extends StatelessWidget {
  const SetaTabBar({super.key, required this.items, required this.currentIndex, required this.onTap});

  final List<TabItem> items;
  final int currentIndex;
  final ValueChanged<int> onTap;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final material = context.isMaterial;
    final bottom = MediaQuery.paddingOf(context).bottom;

    final tabs = [
      for (final (i, item) in items.indexed)
        Expanded(
          child: Semantics(
            button: true,
            selected: i == currentIndex,
            label: item.label,
            excludeSemantics: true,
            child: InkResponse(
              onTap: () => onTap(i),
              radius: 40,
              highlightColor: Colors.transparent,
              splashColor: c.gold.withValues(alpha: .08),
              child: material ? _materialTab(c, item, i == currentIndex) : _iosTab(c, item, i == currentIndex),
            ),
          ),
        ),
    ];

    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: material ? 0 : 20, sigmaY: material ? 0 : 20),
        child: Container(
          padding: EdgeInsets.fromLTRB(
            material ? 8 : 24,
            material ? 12 : 0,
            material ? 8 : 24,
            bottom + (material ? 12 : 8),
          ),
          decoration: BoxDecoration(
            color: c.night.withValues(alpha: material ? .94 : .88),
            border: material ? null : Border(top: BorderSide(color: c.gold.withValues(alpha: .2))),
          ),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: tabs),
        ),
      ),
    );
  }

  Widget _iosTab(SetaColors c, TabItem item, bool active) {
    final ink = active ? c.gold : c.white.withValues(alpha: .56);
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: 20,
          height: 3,
          margin: const EdgeInsets.only(bottom: 8),
          decoration: BoxDecoration(
            color: active ? c.gold : Colors.transparent,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        SetaIcon(item.icon, size: 22, color: ink),
        const SizedBox(height: 5),
        Text(item.label, style: SetaType.tab.copyWith(color: ink)),
      ],
    );
  }

  Widget _materialTab(SetaColors c, TabItem item, bool active) {
    final ink = active ? c.gold : c.white.withValues(alpha: .74);
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: 64,
          height: 32,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: active ? c.gold.withValues(alpha: .22) : Colors.transparent,
            borderRadius: BorderRadius.circular(16),
          ),
          child: SetaIcon(item.icon, size: 22, color: ink),
        ),
        const SizedBox(height: 4),
        Text(
          item.label,
          style: SetaType.tabAndroid.copyWith(color: ink, fontWeight: active ? FontWeight.w600 : FontWeight.w500),
        ),
      ],
    );
  }
}
