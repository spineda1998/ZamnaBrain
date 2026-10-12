import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:zumabrain/core/hydration/hydration.dart';
import 'package:zumabrain/core/widgets/zuma_arcade_button.dart';

void main() {
  group('HydrationController', () {
    test('arranca en L0 shell', () {
      final c = HydrationController();
      expect(c.level, HydrationLevel.l0Shell);
      expect(c.reached(HydrationLevel.l1Layout), isFalse);
    });

    test('avanza solo hacia adelante (nunca retrocede)', () {
      final c = HydrationController();
      c.advanceTo(HydrationLevel.l2Critical);
      expect(c.reached(HydrationLevel.l1Layout), isTrue);
      expect(c.reached(HydrationLevel.l3Heavy), isFalse);

      c.advanceTo(HydrationLevel.l1Layout); // intento de retroceso
      expect(c.level, HydrationLevel.l2Critical);
    });

    test('notifica a los listeners al avanzar', () {
      final c = HydrationController();
      var notified = 0;
      c.addListener(() => notified++);
      c.advanceTo(HydrationLevel.l1Layout);
      c.advanceTo(HydrationLevel.l1Layout); // sin cambio → sin notificación
      expect(notified, 1);
    });
  });

  testWidgets('ZumaArcadeButton dispara onPressed', (tester) async {
    var tapped = false;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ZumaArcadeButton(label: 'INICIAR', onPressed: () => tapped = true),
        ),
      ),
    );
    await tester.tap(find.text('INICIAR'));
    await tester.pumpAndSettle();
    expect(tapped, isTrue);
  });
}
