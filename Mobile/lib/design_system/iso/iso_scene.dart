// The website's CSS 3D "box" model, ported to a painter. A scene is a plate (the table)
// plus boxes, each a top and walls folded up from a rectangle on the plan. Coordinates are
// the website's CSS pixels: x right, y down the plan (towards the street), z up.

import 'package:flutter/painting.dart';

/// How a box is coloured.
enum IsoFinish {
  /// Plain navy walls with gold edges.
  plain,

  /// Glass: a fine gold grid of floors and mullions on the walls.
  glazed,

  /// A pale roof slab.
  slab,

  /// A tree: foliage green, no edges.
  tree,
}

/// A window drawn on the front wall, as CSS insets in fractions (top, right, bottom, left).
typedef IsoWindow = ({double top, double right, double bottom, double left});

const wideWindow = (top: .18, right: .08, bottom: 0.0, left: .34);
const bandWindow = (top: .22, right: .10, bottom: .26, left: .10);

class IsoBox {
  const IsoBox({
    required this.x,
    required this.y,
    required this.w,
    required this.d,
    required this.h,
    this.z = 0,
    this.finish = IsoFinish.plain,
    this.group,
    this.delay = 0,
    this.window,
    this.icon,
  });

  /// Left edge and top edge on the plan, width (x) and depth (y).
  final double x, y, w, d;

  /// Wall height and how high the box sits.
  final double h, z;
  final IsoFinish finish;

  /// Boxes in the same group light up, dim and slide out together.
  final String? group;

  /// When this box rises into place on the entry animation, in seconds.
  final double delay;
  final IsoWindow? window;

  /// A department icon id drawn on the front wall.
  final String? icon;
}

/// A flat shape drawn on the site plan (roads, plots, a pool).
sealed class IsoPlanShape {
  const IsoPlanShape(this.rect);
  final Rect rect;
}

class IsoRoad extends IsoPlanShape {
  const IsoRoad(super.rect);
}

class IsoPool extends IsoPlanShape {
  const IsoPool(super.rect);
}

class IsoPlot extends IsoPlanShape {
  const IsoPlot(super.rect);
}

/// The camera and contents of one model, matching a `stage(...)` call in the prototype.
class IsoScene {
  const IsoScene({
    required this.width,
    required this.depth,
    required this.plateHeight,
    required this.tilt,
    required this.turn,
    required this.lift,
    required this.boxes,
    this.siteBase = 0,
    this.perspectiveOriginY = .28,
    this.plan = const [],
    this.slideOut = 0,
  });

  /// The plate's size on the plan.
  final double width, depth, plateHeight;

  /// rotateX and rotateZ, in degrees.
  final double tilt, turn;

  /// How far the table is pushed down, before scaling (CSS `--lift`).
  final double lift;
  final List<IsoBox> boxes;

  /// Buildings stand on this height (the website's `.site { translateZ(--base) }`).
  final double siteBase;
  final double perspectiveOriginY;
  final List<IsoPlanShape> plan;

  /// How far a lit group slides towards the street.
  final double slideOut;

  double get riseDuration => boxes.fold<double>(0, (m, b) => b.delay > m ? b.delay : m) + 1.4;
}

/// The landing site: a villa (Private) and two towers (Business) on one plate.
IsoScene siteScene() => const IsoScene(
  width: 520,
  depth: 380,
  plateHeight: 14,
  siteBase: 14,
  tilt: 56,
  turn: -34,
  lift: 70,
  plan: [
    IsoRoad(Rect.fromLTWH(256, 0, 26, 380)),
    IsoPool(Rect.fromLTWH(60, 318, 120, 40)),
    IsoPlot(Rect.fromLTRB(12, 140, 244, 368)),
    IsoPlot(Rect.fromLTRB(284, 36, 508, 270)),
  ],
  boxes: [
    IsoBox(x: 36, y: 178, w: 196, d: 128, h: 58, group: 'private', delay: .1, window: wideWindow),
    IsoBox(x: 62, y: 192, w: 132, d: 92, h: 46, z: 58, group: 'private', delay: .25, window: bandWindow),
    IsoBox(x: 50, y: 184, w: 160, d: 110, h: 6, z: 104, finish: IsoFinish.slab, group: 'private', delay: .4),
    IsoBox(x: 238, y: 262, w: 12, d: 12, h: 34, finish: IsoFinish.tree, group: 'private', delay: .5),
    IsoBox(x: 20, y: 150, w: 14, d: 14, h: 28, finish: IsoFinish.tree, group: 'private', delay: .55),
    IsoBox(x: 292, y: 52, w: 180, d: 190, h: 22, group: 'business', delay: .2),
    IsoBox(x: 302, y: 64, w: 96, d: 96, h: 236, z: 22, finish: IsoFinish.glazed, group: 'business', delay: .35),
    IsoBox(x: 404, y: 150, w: 58, d: 82, h: 142, z: 22, finish: IsoFinish.glazed, group: 'business', delay: .5),
    IsoBox(x: 470, y: 262, w: 12, d: 12, h: 30, finish: IsoFinish.tree, group: 'business', delay: .6),
  ],
);

/// The services as floors of one building, bottom to top, each carrying its icon.
/// Floor groups are named by the service id, so lighting a service lights its floor.
IsoScene towerScene(List<String> serviceIds) {
  const inset = 30.0, size = 160.0, floorH = 44.0, gap = 6.0, base = 10.0;
  final boxes = <IsoBox>[
    for (final (i, id) in serviceIds.indexed)
      IsoBox(
        x: inset,
        y: inset,
        w: size,
        d: size,
        h: floorH,
        z: base + i * (floorH + gap),
        finish: IsoFinish.glazed,
        group: id,
        delay: .1 + i * .12,
        icon: id,
      ),
    IsoBox(
      x: inset - 8,
      y: inset - 8,
      w: size + 16,
      d: size + 16,
      h: 6,
      z: base + serviceIds.length * (floorH + gap),
      finish: IsoFinish.slab,
      delay: .1 + serviceIds.length * .12,
    ),
  ];
  return IsoScene(
    width: 220,
    depth: 220,
    plateHeight: base,
    tilt: 58,
    turn: -40,
    lift: 140,
    perspectiveOriginY: .2,
    slideOut: 34,
    boxes: boxes,
  );
}
