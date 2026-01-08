import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import '../core/models/snippet.dart';

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

class _DualCalendarViewState extends State<DualCalendarView> with TickerProviderStateMixin {
  CalendarViewType _viewType = CalendarViewType.week;
  late DateTime _focusedDay;
  late AnimationController _switchController;
  late AnimationController _fadeController;

  // Color definitions
  static const Color todayColor = Color(0xFF2196F3); // Blue for today
  static const Color hasVideoColor = Color(0xFF4CAF50); // Green for days with videos
  static const Color noVideoColor = Color(0xFFE0E0E0); // Light grey for past days without videos

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
        const SizedBox(height: 16),
        _buildCalendarContent(),
      ],
    );
  }

  Widget _buildCalendarHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          // Month/Year display
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  DateFormat('MMMM yyyy').format(_focusedDay),
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
                if (widget.selectedDay != null)
                  Text(
                    DateFormat('EEEE, d').format(widget.selectedDay!),
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
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
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildToggleButton(
            CalendarViewType.week,
            Icons.view_week,
            'Week',
          ),
          _buildToggleButton(
            CalendarViewType.month,
            Icons.calendar_month,
            'Month',
          ),
        ],
      ),
    );
  }

  Widget _buildToggleButton(CalendarViewType type, IconData icon, String label) {
    final isSelected = _viewType == type;
    
    return GestureDetector(
      onTap: () => _switchView(type),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? Colors.black : Colors.transparent,
          borderRadius: BorderRadius.circular(6),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 16,
              color: isSelected ? Colors.white : Colors.grey[600],
            ),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: isSelected ? Colors.white : Colors.grey[600],
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
    final focusedWeekStart = _focusedDay.subtract(Duration(days: _focusedDay.weekday - 1));
    
    return Column(
      children: [
        // Navigation row
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(
              icon: const Icon(Icons.chevron_left, color: Colors.black),
              onPressed: () {
                setState(() {
                  _focusedDay = _focusedDay.subtract(const Duration(days: 7));
                });
                widget.onPageChanged(_focusedDay);
              },
            ),
            Text(
              DateFormat('MMMM yyyy').format(_focusedDay),
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
            IconButton(
              icon: const Icon(Icons.chevron_right, color: Colors.black),
              onPressed: () {
                setState(() {
                  _focusedDay = _focusedDay.add(const Duration(days: 7));
                });
                widget.onPageChanged(_focusedDay);
              },
            ),
          ],
        ),
        const SizedBox(height: 8),
        // Week dates
        Row(
          children: List.generate(7, (index) {
            final day = focusedWeekStart.add(Duration(days: index));
            return Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
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
    final isSelected = widget.selectedDay != null && _isSameDay(widget.selectedDay!, day);
    final hasVideo = _getSnippetsForDay(day).isNotEmpty;
    final isPast = day.isBefore(DateTime.now().subtract(const Duration(days: 1)));
    
    Color backgroundColor;
    Color textColor;
    
    if (isSelected || isToday) {
      backgroundColor = todayColor;
      textColor = Colors.white;
    } else if (isPast && hasVideo) {
      backgroundColor = hasVideoColor;
      textColor = Colors.white;
    } else if (isPast && !hasVideo) {
      backgroundColor = noVideoColor;
      textColor = Colors.black87;
    } else {
      backgroundColor = Colors.grey[100]!;
      textColor = Colors.black87;
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
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '${day.day}',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: textColor,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              DateFormat('EEE').format(day),
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: textColor.withOpacity(0.8),
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
        calendarStyle: CalendarStyle(
          outsideDaysVisible: false,
          // Remove default decorations since we're using custom builders
          todayDecoration: const BoxDecoration(color: Colors.transparent),
          selectedDecoration: const BoxDecoration(color: Colors.transparent),
          defaultDecoration: const BoxDecoration(color: Colors.transparent),
          weekendDecoration: const BoxDecoration(color: Colors.transparent),
          // Text styles
          todayTextStyle: const TextStyle(color: Colors.transparent),
          selectedTextStyle: const TextStyle(color: Colors.transparent),
          defaultTextStyle: const TextStyle(color: Colors.transparent),
          weekendTextStyle: const TextStyle(color: Colors.transparent),
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
        headerStyle: const HeaderStyle(
          formatButtonVisible: false,
          titleCentered: true,
          titleTextStyle: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.black,
          ),
          leftChevronIcon: Icon(Icons.chevron_left, color: Colors.black),
          rightChevronIcon: Icon(Icons.chevron_right, color: Colors.black),
        ),
      ),
    );
  }

  Widget _buildDayCell(DateTime day, bool isToday, bool isSelected, {bool isOutside = false}) {
    final hasVideo = _getSnippetsForDay(day).isNotEmpty;
    final isPast = day.isBefore(DateTime.now().subtract(const Duration(days: 1)));
    
    Color backgroundColor;
    Color textColor;

    if (isOutside) {
      backgroundColor = Colors.transparent;
      textColor = Colors.grey[400]!;
    } else if (isSelected || isToday) {
      backgroundColor = todayColor;
      textColor = Colors.white;
    } else if (isPast && hasVideo) {
      backgroundColor = hasVideoColor;
      textColor = Colors.white;
    } else if (isPast && !hasVideo) {
      backgroundColor = noVideoColor;
      textColor = Colors.black87;
    } else {
      backgroundColor = Colors.grey[100]!;
      textColor = Colors.black87;
    }

    return Container(
      margin: const EdgeInsets.all(2),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Center(
        child: Text(
          '${day.day}',
          style: TextStyle(
            color: textColor,
            fontWeight: FontWeight.w600,
            fontSize: 14,
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
    return day.year == now.year && day.month == now.month && day.day == now.day;
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