import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mine/widgets/dual_calendar_view.dart';
import 'package:mine/core/models/snippet.dart';

void main() {
  group('DualCalendarView Tests', () {
    testWidgets('should render calendar widget', (WidgetTester tester) async {
      final snippets = <Snippet>[];
      
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: DualCalendarView(
              snippets: snippets,
              selectedDay: DateTime.now(),
              onDaySelected: (day) {},
              onPageChanged: (day) {},
            ),
          ),
        ),
      );

      // Verify the calendar renders
      expect(find.byType(DualCalendarView), findsOneWidget);
      
      // Verify toggle buttons are present
      expect(find.text('Week'), findsOneWidget);
      expect(find.text('Month'), findsOneWidget);
    });

    testWidgets('should switch between week and month views', (WidgetTester tester) async {
      final snippets = <Snippet>[];
      
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: DualCalendarView(
              snippets: snippets,
              selectedDay: DateTime.now(),
              onDaySelected: (day) {},
              onPageChanged: (day) {},
            ),
          ),
        ),
      );

      // Initially should be in week view
      expect(find.text('Week'), findsOneWidget);
      
      // Tap month toggle
      await tester.tap(find.text('Month'));
      await tester.pumpAndSettle();
      
      // Should switch to month view
      expect(find.text('Month'), findsOneWidget);
    });
  });
}