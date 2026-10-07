import 'package:material_ui/material_ui.dart';
import 'package:google_fonts/google_fonts.dart';

import '../tokens.dart';

/// Text filled with the metallic gold gradient.
class GoldGradientText extends StatelessWidget {
  const GoldGradientText(this.text, {super.key, required this.style, this.textAlign, this.maxLines});

  final String text;
  final TextStyle style;
  final TextAlign? textAlign;
  final int? maxLines;

  @override
  Widget build(BuildContext context) => ShaderMask(
    blendMode: BlendMode.srcIn,
    shaderCallback: goldGradient.createShader,
    child: Text(
      text,
      style: style.copyWith(color: Colors.white),
      textAlign: textAlign,
      maxLines: maxLines,
    ),
  );
}

/// The small uppercase section label above a heading, in gold gradient. Never bold.
class EyebrowLabel extends StatelessWidget {
  const EyebrowLabel(this.text, {super.key, this.textAlign});

  final String text;
  final TextAlign? textAlign;

  @override
  Widget build(BuildContext context) =>
      GoldGradientText(text.toUpperCase(), style: SetaType.eyebrow, textAlign: textAlign);
}

/// "SETA" in white and "BASE" in gold gradient, Newsreader Semibold, uppercase.
class Wordmark extends StatelessWidget {
  const Wordmark({super.key, this.size = 22});

  final double size;

  @override
  Widget build(BuildContext context) {
    final style = GoogleFonts.newsreader(
      fontSize: size,
      height: 1,
      fontWeight: FontWeight.w600,
      letterSpacing: size * .08,
    );
    return Semantics(
      label: 'SETABASE',
      excludeSemantics: true,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('SETA', style: style.copyWith(color: context.colors.white)),
          GoldGradientText('BASE', style: style),
        ],
      ),
    );
  }
}
