import 'package:material_ui/material_ui.dart';
import 'package:cupertino_ui/cupertino_ui.dart' show CupertinoPageTransitionsBuilder;
import 'package:google_fonts/google_fonts.dart';

import '../design_system/tokens.dart';

/// Dark navy is the brand's base, so there is one theme.
ThemeData buildTheme(TargetPlatform platform) {
  const c = SetaColors.brand;
  final base = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    platform: platform,
    colorScheme: ColorScheme.fromSeed(
      seedColor: c.gold,
      brightness: Brightness.dark,
      primary: c.gold,
      onPrimary: c.navyDeep,
      secondary: c.gold,
      surface: c.navy,
      onSurface: c.white,
      error: c.error,
    ),
    scaffoldBackgroundColor: c.navy,
    canvasColor: c.navy,
    splashFactory: InkRipple.splashFactory,
    extensions: const [SetaColors.brand],
  );
  return base.copyWith(
    textTheme: GoogleFonts.ibmPlexSansTextTheme(base.textTheme).apply(bodyColor: c.white, displayColor: c.white),
    textSelectionTheme: TextSelectionThemeData(
      cursorColor: c.gold,
      selectionColor: c.gold.withValues(alpha: .3),
      selectionHandleColor: c.gold,
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: c.navyDeep,
      modalBackgroundColor: c.navyDeep,
      showDragHandle: true,
      dragHandleColor: c.gold.withValues(alpha: .4),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(SetaRadii.panel))),
    ),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: c.navyDeep,
      contentTextStyle: SetaType.body.copyWith(color: c.white),
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(SetaRadii.input),
        side: BorderSide(color: c.gold.withValues(alpha: .4)),
      ),
    ),
    pageTransitionsTheme: const PageTransitionsTheme(
      builders: {
        TargetPlatform.android: FadeForwardsPageTransitionsBuilder(),
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
      },
    ),
  );
}
