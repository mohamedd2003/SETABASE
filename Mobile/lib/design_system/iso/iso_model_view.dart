import 'dart:math' as math;

import 'package:material_ui/material_ui.dart';

import '../icons.dart';
import '../tokens.dart';
import 'iso_scene.dart';

/// Draws an [IsoScene]. Boxes rise into place once when the view first appears; changing
/// [lit] or [dim] cross-fades the groups (and slides a lit floor out), which is how the
/// Private/Business choice and the chosen service show on the model.
class IsoModelView extends StatefulWidget {
  const IsoModelView({
    super.key,
    required this.scene,
    required this.height,
    this.fill = const Size(.74, .9),
    this.lit = const {},
    this.dim = const {},
    this.animateIn = true,
    this.onTapGroup,
    this.tapGroups = const [],
    this.semanticLabel,
  });

  final IsoScene scene;
  final double height;

  /// How much of the box the model may take, as fractions of width and height. Like the
  /// Figma frames, the model is fitted into its box rather than drawn at a fixed scale.
  final Size fill;
  final Set<String> lit;
  final Set<String> dim;
  final bool animateIn;

  /// Called with the group nearest to a tap, among [tapGroups].
  final ValueChanged<String>? onTapGroup;
  final List<String> tapGroups;

  /// Describes the picture for screen readers; without it the model is decorative.
  final String? semanticLabel;

  @override
  State<IsoModelView> createState() => _IsoModelViewState();
}

class _IsoModelViewState extends State<IsoModelView> with TickerProviderStateMixin {
  late final AnimationController _rise = AnimationController(
    vsync: this,
    duration: Duration(milliseconds: (widget.scene.riseDuration * 1000).round()),
  );
  late final AnimationController _swap = AnimationController(vsync: this, duration: const Duration(milliseconds: 520));

  final _litFrom = <String, double>{};
  final _dimFrom = <String, double>{};
  bool _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_started) return;
    _started = true;
    final still = MediaQuery.disableAnimationsOf(context) || !widget.animateIn;
    if (still) {
      _rise.value = 1;
    } else {
      _rise.forward();
    }
    _swap.value = 1;
  }

  @override
  void didUpdateWidget(IsoModelView old) {
    super.didUpdateWidget(old);
    if (old.lit.length != widget.lit.length ||
        !old.lit.containsAll(widget.lit) ||
        old.dim.length != widget.dim.length ||
        !old.dim.containsAll(widget.dim)) {
      for (final g in _groups) {
        _litFrom[g] = _value(g, old.lit, _litFrom);
        _dimFrom[g] = _value(g, old.dim, _dimFrom);
      }
      if (MediaQuery.disableAnimationsOf(context)) {
        _swap.value = 1;
      } else {
        _swap.forward(from: 0);
      }
    }
  }

  Iterable<String> get _groups => widget.scene.boxes.map((b) => b.group).whereType<String>().toSet();

  double _value(String group, Set<String> target, Map<String, double> from) {
    final to = target.contains(group) ? 1.0 : 0.0;
    final start = from[group] ?? to;
    return start + (to - start) * Curves.easeInOut.transform(_swap.value);
  }

  @override
  void dispose() {
    _rise.dispose();
    _swap.dispose();
    super.dispose();
  }

  void _onTapUp(TapUpDetails details) {
    final size = context.size;
    if (size == null) return;
    final camera = _Camera.fitted(widget.scene, size, widget.fill);
    String? best;
    var bestDistance = double.infinity;
    for (final group in widget.tapGroups) {
      final boxes = widget.scene.boxes.where((b) => b.group == group);
      if (boxes.isEmpty) continue;
      final points = [
        for (final b in boxes)
          camera.project(b.x + b.w / 2, b.y + b.d / 2, widget.scene.siteBase + b.z + b.h / 2).offset,
      ];
      final centre = points.reduce((a, b) => a + b) / points.length.toDouble();
      final distance = (centre - details.localPosition).distance;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = group;
      }
    }
    if (best != null) widget.onTapGroup!(best);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    // No LayoutBuilder: scroll views ask this widget for its intrinsic height, and the painter
    // can size the model from the space it is given at paint time.
    Widget paint = AnimatedBuilder(
      animation: Listenable.merge([_rise, _swap]),
      builder: (context, _) => CustomPaint(
        size: Size(double.infinity, widget.height),
        painter: _IsoPainter(
          scene: widget.scene,
          fill: widget.fill,
          colors: colors,
          time: _rise.value * widget.scene.riseDuration,
          lit: (g) => _value(g, widget.lit, _litFrom),
          dim: (g) => _value(g, widget.dim, _dimFrom),
        ),
      ),
    );

    if (widget.onTapGroup != null && widget.tapGroups.isNotEmpty) {
      paint = GestureDetector(behavior: HitTestBehavior.opaque, onTapUp: _onTapUp, child: paint);
    }

    return Semantics(
      image: widget.semanticLabel != null,
      label: widget.semanticLabel,
      excludeSemantics: true,
      child: SizedBox(width: double.infinity, height: widget.height, child: paint),
    );
  }
}

/* --------------------------------------------------------------- projection */

typedef _Point = ({Offset offset, double depth});

/// The website's stage: the table is centred, turned (rotateZ), tilted back (rotateX),
/// scaled, pushed down by `lift`, then seen through a 1800px perspective.
class _Camera {
  _Camera(this.scene, this.size, this.scale, [this.offset = Offset.zero])
    : _cosTurn = math.cos(scene.turn * math.pi / 180),
      _sinTurn = math.sin(scene.turn * math.pi / 180),
      _cosTilt = math.cos(scene.tilt * math.pi / 180),
      _sinTilt = math.sin(scene.tilt * math.pi / 180);

  /// Scaled and centred so the whole model — every box at full height, every floor slid
  /// out — fits [fill] of the box.
  factory _Camera.fitted(IsoScene scene, Size size, Size fill) {
    final first = _Camera(scene, size, 1).bounds();
    final scale = math.min(size.width * fill.width / first.width, size.height * fill.height / first.height);
    final placed = _Camera(scene, size, scale).bounds();
    return _Camera(scene, size, scale, size.center(Offset.zero) - placed.center);
  }

  final IsoScene scene;
  final Size size;
  final double scale;
  final Offset offset;
  final double _cosTurn, _sinTurn, _cosTilt, _sinTilt;

  static const _perspective = 1800.0;

  _Point project(double x, double y, double z) {
    final px = x - scene.width / 2, py = y - scene.depth / 2;
    final rx = px * _cosTurn - py * _sinTurn;
    final ry = px * _sinTurn + py * _cosTurn;
    final ty = ry * _cosTilt - z * _sinTilt;
    final tz = ry * _sinTilt + z * _cosTilt;

    final sx = rx * scale + size.width / 2;
    final sy = ty * scale + scale * scene.lift + size.height / 2;
    final sz = tz * scale;

    final ox = size.width / 2, oy = size.height * scene.perspectiveOriginY;
    final k = _perspective / (_perspective - sz);
    return (offset: Offset(ox + (sx - ox) * k, oy + (sy - oy) * k) + offset, depth: sz);
  }

  /// The screen rectangle the finished model covers.
  Rect bounds() {
    var rect = Rect.zero;
    var first = true;
    void add(double x, double y, double z) {
      final p = project(x, y, z).offset;
      rect = first ? Rect.fromPoints(p, p) : rect.expandToInclude(Rect.fromPoints(p, p));
      first = false;
    }

    for (final x in [0.0, scene.width]) {
      for (final y in [0.0, scene.depth]) {
        add(x, y, 0);
        add(x, y, scene.plateHeight);
      }
    }
    for (final b in scene.boxes) {
      final zb = scene.siteBase + b.z;
      for (final dy in {0.0, if (b.group != null) scene.slideOut}) {
        for (final x in [b.x, b.x + b.w]) {
          for (final y in [b.y + dy, b.y + dy + b.d]) {
            add(x, y, zb);
            add(x, y, zb + b.h);
          }
        }
      }
    }
    return rect;
  }
}

/* ------------------------------------------------------------------ painter */

const _foliage = Color(0xFF5F8F6A);
const _water = Color(0xFF5AA9E6);
const _waterDeep = Color(0xFF2F6FA8);
final _riseCurve = const Cubic(.22, 1, .36, 1);

class _IsoPainter extends CustomPainter {
  _IsoPainter({
    required this.scene,
    required this.fill,
    required this.colors,
    required this.time,
    required this.lit,
    required this.dim,
  });

  final IsoScene scene;
  final Size fill;
  final SetaColors colors;
  final double time;
  final double Function(String group) lit;
  final double Function(String group) dim;

  late _Camera _camera;
  late double scale;

  double get _stroke => math.max(.6, scale);

  @override
  void paint(Canvas canvas, Size size) {
    _camera = _Camera.fitted(scene, size, fill);
    scale = _camera.scale;
    _paintPlate(canvas);
    _paintPlan(canvas);

    final placed = [for (final box in scene.boxes) _place(box)]..sort((a, b) => a.depth.compareTo(b.depth));
    for (final p in placed) {
      _paintBox(canvas, p);
    }
  }

  /* plate */

  void _paintPlate(Canvas canvas) {
    final w = scene.width, d = scene.depth, h = scene.plateHeight;
    final top = _poly([(0, 0, h), (w, 0, h), (w, d, h), (0, d, h)]);

    // A deep shadow under the table.
    canvas.drawPath(
      top.shift(Offset(0, 46 * scale)),
      Paint()
        ..color = const Color(0xFF030A16).withValues(alpha: .7)
        ..maskFilter = MaskFilter.blur(BlurStyle.normal, 34 * scale),
    );

    final edge = colors.gold.withValues(alpha: .32);
    _fillFace(canvas, _poly([(0, d, h), (w, d, h), (w, d, 0), (0, d, 0)]), colors.navyDeep, edge);
    _fillFace(canvas, _poly([(0, 0, h), (0, d, h), (0, d, 0), (0, 0, 0)]), colors.navyDeep, edge);
    _fillFace(canvas, top, Color.lerp(colors.navyDeep, colors.navy, .7)!, colors.gold.withValues(alpha: .6));

    final grid = Paint()
      ..color = colors.gold.withValues(alpha: .10)
      ..strokeWidth = _stroke * .8;
    for (var x = 26.0; x < w; x += 26) {
      _line(canvas, (x, 0, h), (x, d, h), grid);
    }
    for (var y = 26.0; y < d; y += 26) {
      _line(canvas, (0, y, h), (w, y, h), grid);
    }
  }

  /* plan */

  void _paintPlan(Canvas canvas) {
    final z = scene.siteBase + .5;
    for (final shape in scene.plan) {
      final r = shape.rect;
      final path = _poly([(r.left, r.top, z), (r.right, r.top, z), (r.right, r.bottom, z), (r.left, r.bottom, z)]);
      switch (shape) {
        case IsoRoad():
          canvas.drawPath(path, Paint()..color = colors.navyDeep.withValues(alpha: .8));
          final dash = Paint()
            ..color = colors.gold.withValues(alpha: .6)
            ..strokeWidth = _stroke;
          for (var y = r.top; y < r.bottom; y += 14) {
            _line(canvas, (r.center.dx, y, z), (r.center.dx, math.min(y + 7, r.bottom), z), dash);
          }
        case IsoPool():
          canvas.drawPath(path, Paint()..color = Color.lerp(colors.navyDeep, _waterDeep, .55)!);
          canvas.drawPath(path, _strokePaint(_water.withValues(alpha: .6)));
        case IsoPlot():
          final dash = _strokePaint(colors.gold.withValues(alpha: .6));
          final corners = [(r.left, r.top), (r.right, r.top), (r.right, r.bottom), (r.left, r.bottom)];
          for (var i = 0; i < 4; i++) {
            final (x1, y1) = corners[i];
            final (x2, y2) = corners[(i + 1) % 4];
            final length = math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            for (var t = 0.0; t < length; t += 10) {
              final t2 = math.min(t + 5, length);
              _line(
                canvas,
                (x1 + (x2 - x1) * t / length, y1 + (y2 - y1) * t / length, z),
                (x1 + (x2 - x1) * t2 / length, y1 + (y2 - y1) * t2 / length, z),
                dash,
              );
            }
          }
      }
    }
  }

  /* boxes */

  _Placed _place(IsoBox box) {
    final local = ((time - box.delay) / 1.4).clamp(0.0, 1.0);
    final rise = _riseCurve.transform(local);
    final litT = box.group == null ? 0.0 : lit(box.group!);
    final dimT = box.group == null ? 0.0 : dim(box.group!);
    final dy = scene.slideOut * litT;
    final zb = scene.siteBase + box.z * rise;
    final h = box.h * rise;
    final depth = _camera.project(box.x + box.w / 2, box.y + dy + box.d / 2, zb + h / 2).depth;
    return _Placed(box, zb, h, dy, litT, dimT, depth);
  }

  void _paintBox(Canvas canvas, _Placed p) {
    final b = p.box;
    if (p.h <= .01) return;
    final x0 = b.x, x1 = b.x + b.w, y0 = b.y + p.dy, y1 = b.y + p.dy + b.d;
    final zb = p.zb, zt = p.zb + p.h;
    final opacity = 1 - .68 * p.dimT;
    final canLight = b.finish != IsoFinish.tree;
    final litT = canLight ? p.litT : 0.0;

    final c = colors;
    Color baseTop, baseWall;
    Color edge = c.gold.withValues(alpha: .6);
    switch (b.finish) {
      case IsoFinish.plain || IsoFinish.glazed:
        baseTop = Color.lerp(c.navyDeep, c.navyMedium, .62)!;
        baseWall = Color.lerp(c.navyDeep, c.navyMedium, .42)!;
      case IsoFinish.slab:
        baseTop = Color.lerp(c.navyDeep, c.white, .16)!;
        baseWall = Color.lerp(c.navyDeep, c.navyMedium, .42)!;
      case IsoFinish.tree:
        baseTop = Color.lerp(c.navyDeep, _foliage, .5)!;
        baseWall = Color.lerp(c.navyDeep, _foliage, .34)!;
        edge = Colors.transparent;
    }
    final top = Color.lerp(baseTop, Color.lerp(c.navyDeep, c.gold, .55), litT)!.withValues(alpha: opacity);
    final wall = Color.lerp(baseWall, Color.lerp(c.navyDeep, c.gold, .34), litT)!.withValues(alpha: opacity);
    edge = (b.finish == IsoFinish.tree ? edge : Color.lerp(edge, c.gold, litT)!);
    edge = edge.withValues(alpha: edge.a * opacity);

    final front = _poly([(x0, y1, zt), (x1, y1, zt), (x1, y1, zb), (x0, y1, zb)]);
    final left = _poly([(x0, y0, zt), (x0, y1, zt), (x0, y1, zb), (x0, y0, zb)]);
    _fillFace(canvas, left, wall, edge);
    _fillFace(canvas, front, wall, edge);

    if (b.finish == IsoFinish.glazed) {
      final grid = Paint()
        ..color = c.gold.withValues(alpha: .32 * opacity)
        ..strokeWidth = _stroke * .8;
      // Front wall: floors every 14px from the top, mullions every 16px.
      for (var z = zt - 14; z > zb + 1; z -= 14) {
        _line(canvas, (x0, y1, z), (x1, y1, z), grid);
      }
      for (var x = x0 + 16; x < x1 - 1; x += 16) {
        _line(canvas, (x, y1, zb), (x, y1, zt), grid);
      }
      // Left wall: the website's pattern runs the other way round on this face.
      for (var z = zb + 16; z < zt - 1; z += 16) {
        _line(canvas, (x0, y0, z), (x0, y1, z), grid);
      }
      for (var y = y0 + 14; y < y1 - 1; y += 14) {
        _line(canvas, (x0, y, zb), (x0, y, zt), grid);
      }
    }

    final window = b.window;
    if (window != null) {
      final u0 = x0 + b.w * window.left, u1 = x1 - b.w * window.right;
      final v0 = zt - p.h * window.top, v1 = zb + p.h * window.bottom;
      final pane = _poly([(u0, y1, v0), (u1, y1, v0), (u1, y1, v1), (u0, y1, v1)]);
      canvas.drawPath(pane, Paint()..color = c.gold.withValues(alpha: .24 * opacity));
      canvas.drawPath(pane, _strokePaint(c.gold.withValues(alpha: .6 * opacity)));
    }

    _fillFace(canvas, _poly([(x0, y0, zt), (x1, y0, zt), (x1, y1, zt), (x0, y1, zt)]), top, edge);

    if (b.icon != null && p.h > 20) _paintIcon(canvas, b.icon!, x0, x1, y1, zb, zt, litT, opacity);
  }

  /// A department icon on the front wall, mapped onto the wall's plane.
  void _paintIcon(
    Canvas canvas,
    String id,
    double x0,
    double x1,
    double y,
    double zb,
    double zt,
    double litT,
    double opacity,
  ) {
    final origin = _camera.project(x0, y, zt).offset;
    final alongX = _camera.project(x1, y, zt).offset - origin;
    final down = _camera.project(x0, y, zb).offset - origin;
    final w = x1 - x0, h = zt - zb;

    // Face-local units (CSS px on the wall) → screen.
    final matrix = Matrix4.identity()
      ..setEntry(0, 0, alongX.dx / w)
      ..setEntry(1, 0, alongX.dy / w)
      ..setEntry(0, 1, down.dx / h)
      ..setEntry(1, 1, down.dy / h)
      ..setEntry(0, 3, origin.dx)
      ..setEntry(1, 3, origin.dy);

    const iconSize = 30.0;
    canvas.save();
    canvas.transform(matrix.storage);
    canvas.translate(w / 2 - iconSize / 2, h / 2 - iconSize / 2);
    canvas.scale(iconSize / 32);
    final ink = Color.lerp(colors.gold, colors.navyDeep, litT)!;
    canvas.drawPath(
      deptIconPath(id),
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.6
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round
        ..color = ink.withValues(alpha: (.75 + .25 * litT) * opacity),
    );
    canvas.restore();
  }

  /* helpers */

  Path _poly(List<(double, double, double)> points) {
    final path = Path();
    for (final (i, (x, y, z)) in points.indexed) {
      final o = _camera.project(x, y, z).offset;
      i == 0 ? path.moveTo(o.dx, o.dy) : path.lineTo(o.dx, o.dy);
    }
    return path..close();
  }

  void _line(Canvas canvas, (double, double, double) a, (double, double, double) b, Paint paint) {
    canvas.drawLine(_camera.project(a.$1, a.$2, a.$3).offset, _camera.project(b.$1, b.$2, b.$3).offset, paint);
  }

  Paint _strokePaint(Color color) => Paint()
    ..style = PaintingStyle.stroke
    ..strokeWidth = _stroke
    ..color = color;

  void _fillFace(Canvas canvas, Path path, Color fill, Color edge) {
    canvas.drawPath(path, Paint()..color = fill);
    if (edge.a > 0) canvas.drawPath(path, _strokePaint(edge));
  }

  @override
  bool shouldRepaint(_IsoPainter old) => true;
}

class _Placed {
  const _Placed(this.box, this.zb, this.h, this.dy, this.litT, this.dimT, this.depth);

  final IsoBox box;
  final double zb, h, dy, litT, dimT, depth;
}
