import 'package:material_ui/material_ui.dart';
import 'package:go_router/go_router.dart';

import '../data/static/app_copy.dart';
import '../design_system/icons.dart';
import '../design_system/widgets/tab_bar.dart';

const _tabs = <TabItem>[
  (label: AppCopy.tabHome, icon: SetaIcons.house),
  (label: AppCopy.tabServices, icon: SetaIcons.grid),
  (label: AppCopy.tabGuide, icon: SetaIcons.book),
  (label: AppCopy.tabContact, icon: SetaIcons.message),
];

/// Home · Services · Guide · Contact, each keeping its own scroll position.
class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.shell});

  final StatefulNavigationShell shell;

  @override
  Widget build(BuildContext context) => Scaffold(
    extendBody: true,
    body: shell,
    bottomNavigationBar: SetaTabBar(
      items: _tabs,
      currentIndex: shell.currentIndex,
      onTap: (i) => shell.goBranch(i, initialLocation: i == shell.currentIndex),
    ),
  );
}
