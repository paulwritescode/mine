import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import '../core/models/snippet.dart';
import '../core/theme/tokens.dart';

enum CalendarViewType { week, month }

class DualCalendarView extends StatefulWidget {
  final List<Snippet> snippets;
  final DateTime? selectedDay;
  final Function(DateTime) onDaySelected;
  final Function(DateTime) onPageChanged;

  const DualCalendarView({
    super.key,
    required this.snippets,
    this.selectedDay,
    required this.onDaySelected,
    required this.onPageChanged,
  });

  @override
  State<DualCalendarView> createState() => _DualCalendarViewState();
}

class _DualCalendarViewState extends State<DualCalendarView>
    with TickerProviderStateMixin {
  CalendarViewType _viewType = CalendarViewType.week;
  late DateTime _focusedDay;
  late AnimationController _switchController;
  late AnimationController _fadeController;

  // Day-state encoding (MiniMax language):
  //  • today / selected → black (the brand's selection state)
  //  • past day with video → Brand Coral (the signature "captured" accent)
  //  • past day without video → quiet surface grey
  static const Color selectedColor = AppTokens.ink;
  static const Color hasVideoColor = AppTokens.brandCoral;
  static const Color noVideoColor = AppTokens.surface;

  @override
  void initState() {
    super.initState();
    _focusedDay = widget.selectedDay ?? DateTime.now();
    _switchController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _fadeController.forward();
  }

  @override
  void dispose() {
    _switchController.dispose();
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildCalendarHeader(),
        const SizedBox(height: AppTokens.spaceMd),
        _buildCalendarContent(),
      ],
    );
  }

  Widget _buildCalendarHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppTokens.spaceMd),
      child: Row(
        children: [
          // Month/Year display
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  DateFormat('MMMM yyyy').format(_focusedDay),
                  style: AppTokens.headingSm,
                ),
                if (widget.selectedDay != null)
                  Text(
                    DateFormat('EEEE, d').format(widget.selectedDay!),
                    style: AppTokens.bodySm.copyWith(color: AppTokens.slate),
                  ),
              ],
            ),
          ),
          // View toggle buttons
          _buildViewToggle(),
        ],
      ),
    );
  }

  Widget _buildViewToggle() {
    return Container(
      decoration: BoxDecoration(
        color: AppTokens.surface,
        borderRadius: BorderRadius.circular(AppTokens.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildToggleButton(CalendarViewType.week, Icons.view_week, 'Week'),
          _buildToggleButton(
              CalendarViewType.month, Icons.calendar_month, 'Month'),
        ],
      ),
    );
  }

  Widget _buildToggleButton(
      CalendarViewType type, IconData icon, String label) {
    final isSelected = _viewType == type;

    return GestureDetector(
      onTap: () => _switchView(type),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(
            horizontal: AppTokens.spaceSm, vertical: AppTokens.spaceXs),
        decoration: BoxDecoration(
          color: isSelected ? AppTokens.ink : Colors.transparent,
          borderRadius: BorderRadius.circular(AppTokens.radiusFull),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 16,
              color: isSelected ? AppTokens.onDark : AppTokens.slate,
            ),
            const SizedBox(width: AppTokens.spaceXxs),
            Text(
              label,
              style: AppTokens.micro.copyWith(
                fontWeight: FontWeight.w500,
                color: isSelected ? AppTokens.onDark : AppTokens.slate,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCalendarContent() {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 300),
      child: _viewType == CalendarViewType.week
          ? _buildWeekView()
          : _buildMonthView(),
    );
  }

  Widget _buildWeekView() {
    return SizedBox(
      key: const ValueKey('week'),
      height: 140,
      child: _buildCustomWeekCalendar(),
    );
  }

  Widget _buildCustomWeekCalendar() {
    // Calculate the start of the week for the focused day
    final focusedWeekStart =
        _focusedDay.subtract(Duration(days: _focusedDay.weekday - 1));

    return Column(
      children: [
        // Navigation row
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(
              icon: const Icon(Icons.chevron_left, color: AppTokens.ink),
              onPressed: () {
                setState(() {
                  _focusedDay = _focusedDay.subtract(const Duration(days: 7));
                });
                widget.onPageChanged(_focusedDay);
              },
            ),
            Text(
              DateFormat('MMMM yyyy').format(_focusedDay),
              style: AppTokens.bodyMd.copyWith(
                color: AppTokens.ink,
                fontWeight: FontWeight.w600,
              ),
            ),
            IconButton(
              icon: const Icon(Icons.chevron_right, color: AppTokens.ink),
              onPressed: () {
                setState(() {
                  _focusedDay = _focusedDay.add(const Duration(days: 7));
                });
                widget.onPageChanged(_focusedDay);
              },
            ),
          ],
        ),
        const SizedBox(height: AppTokens.spaceXs),
        // Week dates
        Row(
          children: List.generate(7, (index) {
            final day = focusedWeekStart.add(Duration(days: index));
            return Expanded(
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: AppTokens.spaceXxs),
                child: _buildWeekDayCell(day),
              ),
            );
          }),
        ),
      ],
    );
  }

  Widget _buildWeekDayCell(DateTime day) {
    final isToday = _isToday(day);
    final isSelected =
        widget.selectedDay != null && _isSameDay(widget.selectedDay!, day);
    final hasVideo = _getSnippetsForDay(day).isNotEmpty;
    final isPast = day.isBefore(DateTime.now().subtract(const Duration(days: 1)));

    Color backgroundColor;
    Color textColor;

    if (isSelected || isToday) {
      backgroundColor = selectedColor;
      textColor = AppTokens.onDark;
    } else if (isPast && hasVideo) {
      backgroundColor = hasVideoColor;
      textColor = AppTokens.onDark;
    } else if (isPast && !hasVideo) {
      backgroundColor = noVideoColor;
      textColor = AppTokens.slate;
    } else {
      backgroundColor = AppTokens.surfaceSoft;
      textColor = AppTokens.charcoal;
    }

    return GestureDetector(
      onTap: () {
        widget.onDaySelected(day);
        setState(() {
          _focusedDay = day;
        });
      },
      child: Container(
        height: 70,
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(AppTokens.radiusLg),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '${day.day}',
              style: AppTokens.cardTitle.copyWith(color: textColor),
            ),
            const SizedBox(height: 2),
            Text(
              DateFormat('EEE').format(day),
              style: AppTokens.micro.copyWith(
                fontWeight: FontWeight.w500,
                color: textColor.withValues(alpha: 0.8),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMonthView() {
    return Container(
      key: const ValueKey('month'),
      child: TableCalendar<Snippet>(
        firstDay: DateTime.utc(2020, 1, 1),
        lastDay: DateTime.utc(2030, 12, 31),
        focusedDay: _focusedDay,
        calendarFormat: CalendarFormat.month,
        eventLoader: (day) => _getSnippetsForDay(day),
        startingDayOfWeek: StartingDayOfWeek.monday,
        selectedDayPredicate: (day) => _isSameDay(widget.selectedDay, day),
        onDaySelected: (selectedDay, focusedDay) {
          widget.onDaySelected(selectedDay);
          setState(() {
            _focusedDay = focusedDay;
          });
        },
        onPageChanged: (focusedDay) {
          setState(() {
            _focusedDay = focusedDay;
          });
          widget.onPageChanged(focusedDay);
        },
        calendarStyle: const CalendarStyle(
          outsideDaysVisible: false,
          // Remove default decorations since we're using custom builders
          todayDecoration: BoxDecoration(color: Colors.transparent),
          selectedDecoration: BoxDecoration(color: Colors.transparent),
          defaultDecoration: BoxDecoration(color: Colors.transparent),
          weekendDecoration: BoxDecoration(color: Colors.transparent),
          // Text styles
          todayTextStyle: TextStyle(color: Colors.transparent),
          selectedTextStyle: TextStyle(color: Colors.transparent),
          defaultTextStyle: TextStyle(color: Colors.transparent),
          weekendTextStyle: TextStyle(color: Colors.transparent),
          // Marker styling
          markersMaxCount: 0,
          canMarkersOverflow: false,
        ),
        calendarBuilders: CalendarBuilders(
          defaultBuilder: (context, day, focusedDay) {
            return _buildDayCell(day, false, false);
          },
          todayBuilder: (context, day, focusedDay) {
            return _buildDayCell(day, true, false);
          },
          selectedBuilder: (context, day, focusedDay) {
            return _buildDayCell(day, false, true);
          },
          outsideBuilder: (context, day, focusedDay) {
            return _buildDayCell(day, false, false, isOutside: true);
          },
        ),
        headerStyle: HeaderStyle(
          formatButtonVisible: false,
          titleCentered: true,
          titleTextStyle: AppTokens.subtitle.copyWith(
            color: AppTokens.ink,
            fontWeight: FontWeight.w600,
          ),
          leftChevronIcon:
              const Icon(Icons.chevron_left, color: AppTokens.ink),
          rightChevronIcon:
              const Icon(Icons.chevron_right, color: AppTokens.ink),
        ),
      ),
    );
  }

  Widget _buildDayCell(DateTime day, bool isToday, bool isSelected,
      {bool isOutside = false}) {
    final hasVideo = _getSnippetsForDay(day).isNotEmpty;
    final isPast = day.isBefore(DateTime.now().subtract(const Duration(days: 1)));

    Color backgroundColor;
    Color textColor;

    if (isOutside) {
      backgroundColor = Colors.transparent;
      textColor = AppTokens.stone;
    } else if (isSelected || isToday) {
      backgroundColor = selectedColor;
      textColor = AppTokens.onDark;
    } else if (isPast && hasVideo) {
      backgroundColor = hasVideoColor;
      textColor = AppTokens.onDark;
    } else if (isPast && !hasVideo) {
      backgroundColor = noVideoColor;
      textColor = AppTokens.slate;
    } else {
      backgroundColor = AppTokens.surfaceSoft;
      textColor = AppTokens.charcoal;
    }

    return Container(
      margin: const EdgeInsets.all(2),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(AppTokens.radiusMd),
      ),
      child: Center(
        child: Text(
          '${day.day}',
          style: AppTokens.bodySm.copyWith(
            color: textColor,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  List<Snippet> _getSnippetsForDay(DateTime day) {
    return widget.snippets.where((snippet) {
      final snippetDate = DateTime(
        snippet.recordedAt.year,
        snippet.recordedAt.month,
        snippet.recordedAt.day,
      );
      final targetDate = DateTime(day.year, day.month, day.day);
      return snippetDate.isAtSameMomentAs(targetDate);
    }).toList();
  }

  bool _isToday(DateTime day) {
    final now = DateTime.now();
    return day.year == now.year &&
        day.month == now.month &&
        day.day == now.day;
  }

  bool _isSameDay(DateTime? a, DateTime? b) {
    if (a == null || b == null) return false;
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  void _switchView(CalendarViewType newType) {
    if (_viewType != newType) {
      HapticFeedback.selectionClick();
      setState(() {
        _viewType = newType;
      });
    }
  }
}
