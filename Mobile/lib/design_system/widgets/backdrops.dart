import 'dart:math' as math;

import 'package:material_ui/material_ui.dart';

import '../tokens.dart';

enum Backdrop {
  /// Flat brand navy.
  navy,

  /// Night sky over a gold ground grid, with city lights — splash and onboarding.
  sky,

  /// Plain night gradient — confirmation and contact.
  night,

  /// A lighter panel fading into navy — detail pages.
  raised,
}

/// Paints one of the brand backdrops behind a screen.
class BackdropView extends StatelessWidget {
  const BackdropView({super.key, required this.backdrop, this.glow, this.child});

  final Backdrop backdrop;

  /// Where a soft gold glow sits, in fractions of the screen (behind the 3D model).
  final Rect? glow;
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return CustomPaint(painter: _BackdropPainter(backdrop, c, glow), child: child ?? const SizedBox.expand());
  }
}

class _BackdropPainter extends CustomPainter {
  _BackdropPainter(this.backdrop, this.c, this.glow);

  final Backdrop backdrop;
  final SetaColors c;
  final Rect? glow;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    switch (backdrop) {
      case Backdrop.navy:
        canvas.drawRect(rect, Paint()..color = c.navy);
      case Backdrop.night:
        canvas.drawRect(
          rect,
          Paint()
            ..shader = LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [c.night, c.navyDeep, c.dusk],
              stops: const [0, .45, 1],
            ).createShader(rect),
        );
        _lights(canvas, size);
      case Backdrop.raised:
        canvas.drawRect(
          rect,
          Paint()
            ..shader = LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [c.raised, c.navy],
              stops: const [0, .38],
            ).createShader(rect),
        );
      case Backdrop.sky:
        canvas.drawRect(
          rect,
          Paint()
            ..shader = LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [c.night, c.navyDeep, c.dusk, c.horizon],
              stops: const [0, .36, .68, 1],
            ).createShader(rect),
        );
        canvas.drawRect(
          rect,
          Paint()
            ..shader = RadialGradient(
              center: Alignment.bottomCenter,
              radius: 1.1,
              colors: [c.navyMedium.withValues(alpha: .38), c.navyMedium.withValues(alpha: 0)],
              stops: const [0, .62],
            ).createShader(rect),
        );
        _lights(canvas, size);
        _floor(canvas, size);
    }
    if (glow != null) _glow(canvas, size);
  }

  /// City lights: three offset dot grids, fading out towards the horizon.
  void _lights(Canvas canvas, Size size) {
    final bottom = size.height * .55;
    const layers = [
      (w: 157.0, h: 113.0, dx: 0.0, dy: 0.0, r: .9, color: Color(0x8CFFECBE)),
      (w: 239.0, h: 173.0, dx: 71.0, dy: 43.0, r: .75, color: Color(0x4DFFFFFF)),
      (w: 331.0, h: 211.0, dx: 193.0, dy: 97.0, r: 1.1, color: Color(0x66FFE2A0)),
    ];
    for (final l in layers) {
      for (var y = l.dy + l.h / 2; y < bottom; y += l.h) {
        final fade = 1 - (y / bottom) / .85;
        if (fade <= 0) continue;
        for (var x = l.dx + l.w / 2; x < size.width; x += l.w) {
          canvas.drawCircle(Offset(x, y), l.r, Paint()..color = l.color.withValues(alpha: l.color.a * fade));
        }
      }
    }
  }

  /// A gold ground grid in perspective along the bottom of the screen.
  void _floor(Canvas canvas, Size size) {
    final top = size.height * .58;
    final floorRect = Rect.fromLTRB(0, top, size.width, size.height);
    final paint = Paint()
      ..strokeWidth = 1
      ..shader = LinearGradient(
        begin: Alignment.bottomCenter,
        end: Alignment.topCenter,
        colors: [c.gold.withValues(alpha: .2), c.gold.withValues(alpha: .12), c.gold.withValues(alpha: 0)],
        stops: const [0, .45, .9],
      ).createShader(floorRect);

    final vanish = Offset(size.width / 2, top - size.height * .35);
    const spacing = 64.0 * 1.25;
    final count = (size.width / spacing).ceil() + 6;
    for (var i = -count; i <= count; i++) {
      final base = Offset(size.width / 2 + i * spacing, size.height);
      final t = (top - base.dy) / (vanish.dy - base.dy);
      canvas.drawLine(base, Offset.lerp(base, vanish, t)!, paint);
    }
    for (var n = 0; n < 14; n++) {
      final y = size.height - (size.height - top) * (1 - 1 / (1 + n * .32));
      if (y <= top) break;
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  void _glow(Canvas canvas, Size size) {
    final g = glow!;
    final r = Rect.fromLTWH(g.left * size.width, g.top * size.height, g.width * size.width, g.height * size.height);
    canvas.drawOval(
      r,
      Paint()
        ..shader = RadialGradient(
          colors: [
            c.gold.withValues(alpha: .34),
            const Color(0xFFE8955A).withValues(alpha: .12),
            c.gold.withValues(alpha: 0),
          ],
          stops: const [0, .6, 1],
        ).createShader(r)
        ..maskFilter = MaskFilter.blur(BlurStyle.normal, math.max(r.width, r.height) * .08),
    );
  }

  @override
  bool shouldRepaint(_BackdropPainter old) => old.backdrop != backdrop || old.glow != glow;
}
