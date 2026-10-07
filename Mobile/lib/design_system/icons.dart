import 'package:flutter/widgets.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:path_drawing/path_drawing.dart';

import '../data/models/content.dart';
import 'tokens.dart';

/// Lucide line icons (24×24, stroke 1.75), the set the website and Figma use.
enum SetaIcons {
  menu('<path d="M4 6h16M4 12h16M4 18h16"/>'),
  close('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  chevronRight('<path d="m9 18 6-6-6-6"/>'),
  chevronDown('<path d="m6 9 6 6 6-6"/>'),
  arrowRight('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
  arrowLeft('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'),
  backIos('<path d="m15 18-6-6 6-6"/>'),
  house(
    '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  ),
  building(
    '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/>',
  ),
  grid(
    '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  ),
  book(
    '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  ),
  message('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'),
  phone(
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  ),
  mail('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
  mapPin(
    '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  ),
  check('<path d="M20 6 9 17l-5-5"/>'),
  swap('<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>'),
  plus('<path d="M5 12h14"/><path d="M12 5v14"/>'),
  minus('<path d="M5 12h14"/>'),
  alert('<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>');

  const SetaIcons(this.markup);
  final String markup;
}

/// The website's hairline department icons (32×32, stroke 1.6), plus the leak drop.
const _deptMarkup = <String, String>{
  'property-management': '<path d="M5 15 16 6l11 9"/><path d="M8 13v13h16V13"/><circle cx="16" cy="18.5" r="2.5"/><path d="M16 21v4M16 23.5h2"/>',
  'facility-management': '<path d="M6 27V7h12v20"/><path d="M9.5 11h5M9.5 15h5M9.5 19h5"/><circle cx="23" cy="22" r="3"/><path d="M23 16.5v2M23 25.5v2M17.5 22h2M26.5 22h2M19.1 18.1l1.4 1.4M25.5 24.5l1.4 1.4M19.1 25.9l1.4-1.4M25.5 19.5l1.4-1.4"/><path d="M3 27h14"/>',
  'relocation': '<path d="M4 17l8-7 8 7"/><path d="M6 15.5V26h12V15.5"/><path d="M24 20s-5-5.2-5-9a5 5 0 0 1 10 0c0 3.8-5 9-5 9z"/><circle cx="24" cy="11" r="1.6"/><path d="M3 27h26"/>',
  'special-services': '<path d="m16 4 2.6 5.3 5.9.9-4.3 4.1 1 5.8L16 17.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/><path d="M4 26c3-2 6-2.4 9-1.4l5 1.6c1.5.4 3 .1 4.4-.9L28 22"/>',
  'real-estate': '<path d="M8 4v24M4 28h8"/><path d="M8 8h18v10H8"/><path d="M12 13h10"/>',
  'leak': '<path d="M16 4s7 7.6 7 12.8a7 7 0 0 1-14 0C9 11.6 16 4 16 4z"/>',
};

String _hex(Color c) => '#${(c.toARGB32() & 0xFFFFFF).toRadixString(16).padLeft(6, '0')}';

String _svg(String body, Color color, {required int box, required double stroke}) =>
    '<svg xmlns="http://www.w3.org/2000/svg" width="$box" height="$box" viewBox="0 0 $box $box" '
    'fill="none" stroke="${_hex(color)}" stroke-opacity="${color.a.toStringAsFixed(3)}" '
    'stroke-width="$stroke" stroke-linecap="round" stroke-linejoin="round">$body</svg>';

class SetaIcon extends StatelessWidget {
  const SetaIcon(this.icon, {super.key, this.size = 22, this.color});

  final SetaIcons icon;
  final double size;
  final Color? color;

  @override
  Widget build(BuildContext context) => SvgPicture.string(
    _svg(icon.markup, color ?? context.colors.gold, box: 24, stroke: 1.75),
    width: size,
    height: size,
    excludeFromSemantics: true,
  );
}

class DeptIcon extends StatelessWidget {
  const DeptIcon(this.id, {super.key, this.size = 30, this.color});

  /// A [ServiceId] key, or "leak".
  final String id;
  final double size;
  final Color? color;

  DeptIcon.service(ServiceId service, {Key? key, double size = 30, Color? color})
    : this(service.key, key: key, size: size, color: color);

  @override
  Widget build(BuildContext context) => SvgPicture.string(
    _svg(_deptMarkup[id] ?? '', color ?? context.colors.gold, box: 32, stroke: 1.6),
    width: size,
    height: size,
    excludeFromSemantics: true,
  );
}

final _pathCache = <String, Path>{};

/// A department icon as one [Path] in its 32×32 box, for drawing on the 3D model's faces.
Path deptIconPath(String id) => _pathCache.putIfAbsent(id, () {
  final markup = _deptMarkup[id] ?? '';
  final path = Path();
  for (final m in RegExp(r'<path d="([^"]+)"').allMatches(markup)) {
    path.addPath(parseSvgPathData(m.group(1)!), Offset.zero);
  }
  for (final m in RegExp(r'<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"').allMatches(markup)) {
    path.addOval(
      Rect.fromCircle(
        center: Offset(double.parse(m.group(1)!), double.parse(m.group(2)!)),
        radius: double.parse(m.group(3)!),
      ),
    );
  }
  return path;
});
