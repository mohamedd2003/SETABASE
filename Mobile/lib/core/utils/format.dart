import 'package:intl/intl.dart';

final _egp = NumberFormat('#,##0', 'en');

/// "22,200 EGP" — the website's `formatEgp` (Intl en-EG, no decimals).
String formatEgp(num value) => '${_egp.format(roundHalfUp(value))} EGP';

/// JavaScript's `Math.round`: halves go up, also for negatives (-2.5 → -2).
int roundHalfUp(num value) => (value + 0.5).floor();
