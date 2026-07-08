import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import '../core/models/snippet.dart';
import '../core/theme/tokens.dart';

enum CalendarViewType { week, month }

/// A minimal week/month calendar.
///
/// Design language (MiniMax): the grid reads as a plain calendar — no
/// heavy color-filled cells. State is expressed through restrained signals:
///   • selected day → filled ink circle (white numeral)
///   • today (unselected) → coral numeral
///   • a day that has a video → a small coral dot beneath the numeral
///   • future days → muted numeral
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

class _DualCalendarViewState extends State<DualCalendarView> {
  CalendarViewType _viewType = CalendarViewType.week;
  late DateTime _focusedDay;

  @override
  void initState() {
    super.initState();
    _focusedDay = widget.selectedDay ?? DateTime.now();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildHeader(),
        const SizedBox(height: AppTokens.spaceMd),
        AnimatedSwitcher(
          duration: AppTokens.animationMedium,
          child: _viewType == CalendarViewType.week
              ? _buildWeekView()
              : _buildMonthView(),
        ),
      ],
    );
  }

  // ---- Header: month label + week/month segmented toggle -------------------

  Widget _buildHeader() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: Text(
            DateFormat('MMMM').format(_focusedDay),
            style: AppTokens.headingSm.copyWith(color: AppTokens.ink),
          ),
        ),
        Text(
          DateFormat('yyyy').format(_focusedDay),
          style: AppTokens.bodySm.copyWith(color: AppTokens.stone),
        ),
        const SizedBox(width: AppTokens.spaceMd),
        _buildViewToggle(),
      ],
    );
  }

  Widget _buildViewToggle() {
    return Container(
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(
        color: AppTokens.surface,
        borderRadius: BorderRadius.circular(AppTokens.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildToggleButton(CalendarViewType.week, 'Week'),
          _buildToggleButton(CalendarViewType.month, 'Month'),
        ],
      ),
    );
  }

  Widget _buildToggleButton(CalendarViewType type, String label) {
    final isSelected = _viewType == type;
    return GestureDetector(
      onTap: () => _switchView(type),
      child: AnimatedContainer(
        duration: AppTokens.animationFast,
        padding: const EdgeInsets.symmetric(
            horizontal: AppTokens.spaceMd, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppTokens.ink : Colors.transparent,
          borderRadius: BorderRadius.circular(AppTokens.radiusFull),
        ),
        child: Text(
          label,
          style: AppTokens.captionBold.copyWith(
            color: isSelected ? AppTokens.onDark : AppTokens.steel,
          ),
        ),
      ),
    );
  }

  // ---- Week view -----------------------------------------------------------

  Widget _buildWeekView() {
    final weekStart =
        _focusedDay.subtract(Duration(days: _focusedDay.weekday - 1));

    return Column(
      key: const ValueKey('week'),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _navButton(Icons.chevron_left, () => _shiftWeek(-7)),
            Text(
              _weekRangeLabel(weekStart),
              style: AppTokens.caption.copyWith(color: AppTokens.slate),
            ),
            _navButton(Icons.chevron_right, () => _shiftWeek(7)),
          ],
        ),
        const SizedBox(height: AppTokens.spaceXs),
        Row(
          children: List.generate(7, (i) {
            final day = weekStart.add(Duration(days: i));
            return Expanded(child: _buildWeekCell(day));
          }),
        ),
      ],
    );
  }

  String _weekRangeLabel(DateTime start) {
    final end = start.add(const Duration(days: 6));
    if (start.month == end.month) {
      return '${DateFormat('MMM d').format(start)} – ${DateFormat('d').format(end)}';
    }
    return '${DateFormat('MMM d').format(start)} – ${DateFormat('MMM d').format(end)}';
  }

  Widget _navButton(IconData icon, VoidCallback onTap) {
    return IconButton(
      icon: Icon(icon, color: AppTokens.slate, size: 22),
      splashRadius: 20,
      visualDensity: VisualDensity.compact,
      onPressed: onTap,
    );
  }

  Widget _buildWeekCell(DateTime day) {
    final state = _stateFor(day);
    return GestureDetector(
      onTap: () {
        widget.onDaySelected(day);
        setState(() => _focusedDay = day);
        HapticFeedback.selectionClick();
      },
      behavior: HitTestBehavior.opaque,
      child: Column(
        children: [
          Text(
            DateFormat('EEE').format(day).toUpperCase(),
            style: AppTokens.micro.copyWith(
              color: state.isSelected ? AppTokens.ink : AppTokens.stone,
              fontWeight:
                  state.isSelected ? FontWeight.w600 : FontWeight.w400,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: AppTokens.spaceXs),
          _dayNumber(day, state, diameter: 40, fontSize: 17),
          const SizedBox(height: 6),
          _videoDot(state),
        ],
      ),
    );
  }

  // ---- Month view ----------------------------------------------------------

  Widget _buildMonthView() {
    return Padding(
      key: const ValueKey('month'),
      padding: const EdgeInsets.only(top: AppTokens.spaceXs),
      child: TableCalendar<Snippet>(
        firstDay: DateTime.utc(2020, 1, 1),
        lastDay: DateTime.utc(2030, 12, 31),
        focusedDay: _focusedDay,
        calendarFormat: CalendarFormat.month,
        headerVisible: false,
        rowHeight: 52,
        daysOfWeekHeight: 28,
        eventLoader: _snippetsForDay,
        startingDayOfWeek: StartingDayOfWeek.monday,
        selectedDayPredicate: (day) => _isSameDay(widget.selectedDay, day),
        onDaySelected: (selectedDay, focusedDay) {
          widget.onDaySelected(selectedDay);
          setState(() => _focusedDay = focusedDay);
          HapticFeedback.selectionClick();
        },
        onPageChanged: (focusedDay) {
          setState(() => _focusedDay = focusedDay);
          widget.onPageChanged(focusedDay);
        },
        daysOfWeekStyle: DaysOfWeekStyle(
          weekdayStyle: AppTokens.micro.copyWith(
              color: AppTokens.stone, letterSpacing: 0.5),
          weekendStyle: AppTokens.micro.copyWith(
              color: AppTokens.stone, letterSpacing: 0.5),
        ),
        calendarStyle: const CalendarStyle(
          outsideDaysVisible: false,
          markersMaxCount: 0,
          canMarkersOverflow: false,
        ),
        calendarBuilders: CalendarBuilders(
          defaultBuilder: (context, day, _) => _buildMonthCell(day),
          todayBuilder: (context, day, _) => _buildMonthCell(day),
          selectedBuilder: (context, day, _) => _buildMonthCell(day),
          outsideBuilder: (context, day, _) => const SizedBox.shrink(),
        ),
      ),
    );
  }

  Widget _buildMonthCell(DateTime day) {
    final state = _stateFor(day);
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _dayNumber(day, state, diameter: 34, fontSize: 14),
        const SizedBox(height: 4),
        _videoDot(state),
      ],
    );
  }

  // ---- Shared cell atoms ---------------------------------------------------

  Widget _dayNumber(DateTime day, _DayState state,
      {required double diameter, required double fontSize}) {
    Color textColor;
    FontWeight weight = FontWeight.w500;

    if (state.isSelected) {
      textColor = AppTokens.onDark;
      weight = FontWeight.w600;
    } else if (state.isToday) {
      textColor = AppTokens.brandCoral;
      weight = FontWeight.w700;
    } else if (state.isFuture) {
      textColor = AppTokens.stone;
    } else {
      textColor = AppTokens.charcoal;
    }

    return Container(
      width: diameter,
      height: diameter,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: state.isSelected ? AppTokens.ink : Colors.transparent,
        shape: BoxShape.circle,
      ),
      child: Text(
        '${day.day}',
        style: AppTokens.bodySm.copyWith(
          fontSize: fontSize,
          fontWeight: weight,
          color: textColor,
          height: 1.0,
        ),
      ),
    );
  }

  Widget _videoDot(_DayState state) {
    return Container(
      width: 5,
      height: 5,
      decoration: BoxDecoration(
        color: state.hasVideo
            ? (state.isSelected ? AppTokens.ink : AppTokens.brandCoral)
            : Colors.transparent,
        shape: BoxShape.circle,
      ),
    );
  }

  // ---- State helpers -------------------------------------------------------

  _DayState _stateFor(DateTime day) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final d = DateTime(day.year, day.month, day.day);
    return _DayState(
      isSelected:
          widget.selectedDay != null && _isSameDay(widget.selectedDay!, day),
      isToday: _isSameDay(day, now),
      isFuture: d.isAfter(today),
      hasVideo: _snippetsForDay(day).isNotEmpty,
    );
  }

  List<Snippet> _snippetsForDay(DateTime day) {
    return widget.snippets.where((snippet) {
      return _isSameDay(snippet.recordedAt, day);
    }).toList();
  }

  bool _isSameDay(DateTime? a, DateTime? b) {
    if (a == null || b == null) return false;
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  void _shiftWeek(int days) {
    setState(() => _focusedDay = _focusedDay.add(Duration(days: days)));
    widget.onPageChanged(_focusedDay);
    HapticFeedback.selectionClick();
  }

  void _switchView(CalendarViewType type) {
    if (_viewType != type) {
      HapticFeedback.selectionClick();
      setState(() => _viewType = type);
    }
  }
}

class _DayState {
  final bool isSelected;
  final bool isToday;
  final bool isFuture;
  final bool hasVideo;

  const _DayState({
    required this.isSelected,
    required this.isToday,
    required this.isFuture,
    required this.hasVideo,
  });
}
