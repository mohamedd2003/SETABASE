import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../data/models/content.dart';
import '../data/providers.dart';
import '../data/static/app_copy.dart';
import '../design_system/icons.dart';
import '../design_system/tokens.dart';
import '../design_system/widgets/bars.dart';
import '../design_system/widgets/cards.dart';
import '../design_system/widgets/rows.dart';
import 'router.dart';

/// The header's actions: a menu on iOS; a direct audience switch plus the menu on Android.
List<Widget> headerActions(BuildContext context, WidgetRef ref) => [
  if (context.isMaterial)
    CircleIconButton(icon: SetaIcons.swap, tooltip: AppCopy.switchAudience, onPressed: () => switchAudience(ref)),
  CircleIconButton(icon: SetaIcons.menu, tooltip: AppCopy.menu, onPressed: () => showHeaderMenu(context, ref)),
];

Future<void> switchAudience(WidgetRef ref) {
  final current = ref.read(audienceChoiceProvider) ?? Audience.private;
  return ref.read(audienceChoiceProvider.notifier).choose(current.other);
}

Future<void> showHeaderMenu(BuildContext context, WidgetRef ref) {
  final content = ref.read(contentProvider);
  final page = ref.read(audiencePageProvider);
  final site = content.site;
  final other = content.landing.audiences.firstWhere((a) => a.audience == page.audience.other);

  return showModalBottomSheet<void>(
    context: context,
    useRootNavigator: true,
    builder: (sheet) {
      void close(VoidCallback then) {
        Navigator.of(sheet).pop();
        then();
      }

      return SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(SetaSpace.gutter, 0, SetaSpace.gutter, 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ServiceRow(
                leading: IconBadge(
                  size: 40,
                  round: true,
                  child: SetaIcon(other.audience == Audience.private ? SetaIcons.house : SetaIcons.building, size: 18),
                ),
                title: page.switchLabel.replaceAll('→', '').trim(),
                subtitle: other.detail,
                onTap: () => close(() => switchAudience(ref)),
              ),
              ServiceRow(
                leading: const IconBadge(size: 40, round: true, child: SetaIcon(SetaIcons.message, size: 18)),
                title: page.hero.cta,
                subtitle: page.contact.helper,
                onTap: () => close(() => context.go(Routes.contact)),
              ),
              ServiceRow(
                leading: const IconBadge(size: 40, round: true, child: SetaIcon(SetaIcons.phone, size: 18)),
                title: AppCopy.call,
                subtitle: site.phone,
                onTap: () => close(() => launchUrl(Uri(scheme: 'tel', path: site.phone.replaceAll(' ', '')))),
              ),
              ServiceRow(
                leading: const IconBadge(size: 40, round: true, child: SetaIcon(SetaIcons.mail, size: 18)),
                title: AppCopy.fieldEmail,
                subtitle: site.email,
                onTap: () => close(() => launchUrl(Uri(scheme: 'mailto', path: site.email))),
              ),
              ServiceRow(
                leading: const IconBadge(size: 40, round: true, child: SetaIcon(SetaIcons.mapPin, size: 18)),
                title: AppCopy.getDirections,
                subtitle: site.office.full,
                divider: false,
                onTap: () =>
                    close(() => launchUrl(Uri.parse(site.office.directions), mode: LaunchMode.externalApplication)),
              ),
            ],
          ),
        ),
      );
    },
  );
}
