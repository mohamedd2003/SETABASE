import 'package:material_ui/material_ui.dart';
import 'package:google_fonts/google_fonts.dart';

/// Brand colours, shared with the website (src/app/globals.css) and the Figma file.
@immutable
class SetaColors extends ThemeExtension<SetaColors> {
  const SetaColors({
    required this.navy,
    required this.navyMedium,
    required this.navyDeep,
    required this.night,
    required this.dusk,
    required this.horizon,
    required this.gold,
    required this.goldDark,
    required this.cream,
    required this.creamPanel,
    required this.line,
    required this.white,
    required this.error,
  });

  static const brand = SetaColors(
    navy: Color(0xFF1F325A),
    navyMedium: Color(0xFF2E5A8F),
    navyDeep: Color(0xFF0A1E3A),
    night: Color(0xFF071630),
    dusk: Color(0xFF0F264C),
    horizon: Color(0xFF1A3768),
    gold: Color(0xFFE6C158),
    goldDark: Color(0xFFB9863F),
    cream: Color(0xFFF6F3EC),
    creamPanel: Color(0xFFECE7DA),
    line: Color(0xFFD8D1BF),
    white: Color(0xFFFFFDF9),
    error: Color(0xFFF2A69C),
  );

  /// Primary background.
  final Color navy;

  /// Panels and raised surfaces.
  final Color navyMedium;

  /// Cards, the darkest panels, text on gold.
  final Color navyDeep;

  /// Navigation bars and the deepest sky.
  final Color night;
  final Color dusk;
  final Color horizon;

  /// Accents, borders, CTAs.
  final Color gold;

  /// Small gold text on light surfaces.
  final Color goldDark;
  final Color cream;
  final Color creamPanel;
  final Color line;

  /// Text on navy.
  final Color white;
  final Color error;

  Color get raised => Color.lerp(navy, navyMedium, .42)!;
  Color get inkSoft => white.withValues(alpha: .74);
  Color get inkMute => white.withValues(alpha: .56);
  Color get hair => gold.withValues(alpha: .18);
  Color get lineGoldSoft => gold.withValues(alpha: .32);
  Color get lineGold => gold.withValues(alpha: .60);

  @override
  SetaColors copyWith() => this;

  @override
  SetaColors lerp(ThemeExtension<SetaColors>? other, double t) => this;
}

/// The metallic gold used for eyebrows, headline accents and the wordmark: 120°, five stops.
const goldGradient = LinearGradient(
  begin: Alignment(-0.866, -0.5),
  end: Alignment(0.866, 0.5),
  colors: [Color(0xFFB8901F), Color(0xFFFFEBAE), Color(0xFFF4C94A), Color(0xFFFFF8DF), Color(0xFFB8901F)],
  stops: [0, .26, .5, .7, 1],
);

/// Type scale from the Figma file. Newsreader for headings, prices and the wordmark;
/// IBM Plex Sans for everything people read or tap.
abstract final class SetaType {
  static TextStyle _serif(double size, double height, {double tracking = 0}) => GoogleFonts.newsreader(
    fontSize: size,
    height: height,
    fontWeight: FontWeight.w500,
    letterSpacing: size * tracking,
    color: SetaColors.brand.white,
  );

  static TextStyle _sans(double size, double height, {FontWeight weight = FontWeight.w400}) =>
      GoogleFonts.ibmPlexSans(fontSize: size, height: height, fontWeight: weight);

  static final display = _serif(38, 1.06, tracking: -.01);
  static final h1 = _serif(31, 1.12, tracking: -.005);
  static final h2 = _serif(25, 1.2);
  static final h3 = _serif(20, 1.3);
  static final choice = _serif(22, 1.2);
  static final serifItalic = GoogleFonts.newsreader(
    fontStyle: FontStyle.italic,
    fontWeight: FontWeight.w400,
    fontSize: 21,
    height: 1.4,
    color: SetaColors.brand.white,
  );

  static final body = _sans(15, 1.55).copyWith(color: SetaColors.brand.inkSoft);
  static final small = _sans(13, 1.45).copyWith(color: SetaColors.brand.inkMute);
  static final label = _sans(13, 1.3, weight: FontWeight.w500).copyWith(color: SetaColors.brand.inkSoft);
  static final rowTitle = _sans(16, 1.3, weight: FontWeight.w500).copyWith(color: SetaColors.brand.white);
  static final input = _sans(15, 1.5).copyWith(color: SetaColors.brand.white);

  /// Uppercase labels: eyebrows, buttons, links. Callers upper-case the text.
  static final eyebrow = _sans(12, 1.3, weight: FontWeight.w500).copyWith(letterSpacing: 12 * .06);
  static final button = _sans(14, 1, weight: FontWeight.w500).copyWith(letterSpacing: 14 * .06);
  static final link = _sans(13, 1.2, weight: FontWeight.w500).copyWith(letterSpacing: 13 * .07);
  static final tag = _sans(11, 1.2, weight: FontWeight.w500).copyWith(letterSpacing: 11 * .08);
  static final tab = _sans(11, 1.2, weight: FontWeight.w500);

  /// Touches every style, so google_fonts starts loading each weight before the first frame.
  static void preload() => [
    display,
    h1,
    h2,
    h3,
    choice,
    serifItalic,
    body,
    small,
    label,
    rowTitle,
    input,
    eyebrow,
    button,
    link,
    tag,
    tab,
    tabAndroid,
  ];
  static final tabAndroid = _sans(12, 1.2, weight: FontWeight.w500);
}

abstract final class SetaSpace {
  /// Side gutter on phones.
  static const gutter = 20.0;
  static const xs = 6.0;
  static const sm = 10.0;
  static const md = 14.0;
  static const lg = 20.0;
  static const xl = 28.0;
  static const xxl = 40.0;

  /// The iOS tab bar is 88 tall including the home indicator area; content scrolls under it.
  static const navBar = 88.0;
}

abstract final class SetaRadii {
  static const card = 24.0;
  static const cardAndroid = 20.0;
  static const panel = 28.0;
  static const badge = 16.0;
  static const input = 12.0;
  static const note = 12.0;
  static const pill = 999.0;
  static const buttonAndroid = 20.0;
  static const chipAndroid = 10.0;
}

extension SetaThemeContext on BuildContext {
  SetaColors get colors => Theme.of(this).extension<SetaColors>() ?? SetaColors.brand;

  /// Android follows Material 3 in the Figma file (bars, inputs, radii); iOS keeps the pills.
  bool get isMaterial => Theme.of(this).platform == TargetPlatform.android;

  double get cardRadius => isMaterial ? SetaRadii.cardAndroid : SetaRadii.card;
}
