import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../providers/projects_provider.dart';
import '../../providers/snippets_provider.dart';
import '../../core/models/snippet.dart';
import '../../core/theme/tokens.dart';
import '../../widgets/date_video_display.dart';
import '../../widgets/video_grid.dart';
import '../../widgets/dual_calendar_view.dart';

class ProjectDetailScreen extends StatefulWidget {
  final String projectId;

  const ProjectDetailScreen({
    super.key,
    required this.projectId,
  });

  @override
  State<ProjectDetailScreen> createState() => _ProjectDetailScreenState();
}

class _ProjectDetailScreenState extends State<ProjectDetailScreen> {
  DateTime? _selectedDay;

  @override
  void initState() {
    super.initState();
    _selectedDay = DateTime.now();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SnippetsProvider>().loadSnippetsForProject(widget.projectId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTokens.canvas,
      body: Consumer2<ProjectsProvider, SnippetsProvider>(
        builder: (context, projectsProvider, snippetsProvider, child) {
          final project = projectsProvider.getProjectById(widget.projectId);
          final snippets =
              snippetsProvider.getSnippetsForProject(widget.projectId);

          if (project == null) {
            return const Center(child: Text('Project not found'));
          }

          return Column(
            children: [
              // Header
              Container(
                decoration: const BoxDecoration(color: AppTokens.canvas),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(AppTokens.spaceMd),
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back,
                              color: AppTokens.ink),
                          onPressed: () => context.pop(),
                        ),
                        Expanded(
                          child: Text(
                            project.name,
                            style: AppTokens.cardTitle,
                            textAlign: TextAlign.center,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.file_download_outlined,
                              color: AppTokens.ink),
                          onPressed: () =>
                              context.push('/export/${widget.projectId}'),
                          tooltip: 'Export Project',
                        ),
                        IconButton(
                          icon: const Icon(Icons.more_horiz,
                              color: AppTokens.ink),
                          onPressed: () => _showProjectMenu(context, project),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Calendar Section
              Container(
                padding: const EdgeInsets.all(AppTokens.spaceMd),
                child: DualCalendarView(
                  snippets: snippets,
                  selectedDay: _selectedDay,
                  onDaySelected: (day) {
                    setState(() {
                      _selectedDay = day;
                    });
                  },
                  onPageChanged: (day) {
                    setState(() {
                      _selectedDay = day;
                    });
                  },
                ),
              ),

              // Legend
              _buildLegend(),

              // Content area
              Expanded(
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppTokens.spaceMd),
                  child: _selectedDay != null
                      ? _buildDateContent(snippets)
                      : _buildOverviewContent(snippets),
                ),
              ),
            ],
          );
        },
      ),
      // Floating action button for recording (Brand Coral via theme).
      floatingActionButton:
          _selectedDay != null && _canRecordVideo(_selectedDay!)
              ? FloatingActionButton(
                  onPressed: () => _navigateToCamera(),
                  child: const Icon(Icons.videocam),
                )
              : null,
    );
  }

  Widget _buildLegend() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: AppTokens.spaceMd),
      padding: const EdgeInsets.all(AppTokens.spaceSm),
      decoration: BoxDecoration(
        color: AppTokens.surface,
        borderRadius: BorderRadius.circular(AppTokens.radiusLg),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildLegendItem(color: AppTokens.ink, label: 'Today'),
          _buildLegendItem(color: AppTokens.brandCoral, label: 'Has Video'),
          _buildLegendItem(color: AppTokens.hairline, label: 'No Video'),
        ],
      ),
    );
  }

  Widget _buildLegendItem({required Color color, required String label}) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 6),
        Text(
          label,
          style: AppTokens.micro.copyWith(
            color: AppTokens.slate,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildDateContent(List<Snippet> snippets) {
    if (_selectedDay == null) return const SizedBox.shrink();

    final daySnippets = _getSnippetsForDay(_selectedDay!, snippets);
    final isToday = _isToday(_selectedDay!);
    final isPast =
        _selectedDay!.isBefore(DateTime.now().subtract(const Duration(days: 1)));
    final isFuture = _selectedDay!.isAfter(DateTime.now());

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Date header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                DateFormat('EEEE, MMMM d').format(_selectedDay!.toLocal()),
                style: AppTokens.headingSm,
              ),
            ),
            if (isToday)
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: AppTokens.spaceSm, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTokens.ink,
                  borderRadius: BorderRadius.circular(AppTokens.radiusFull),
                ),
                child: Text(
                  'Today',
                  style: AppTokens.micro.copyWith(
                    color: AppTokens.onDark,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: AppTokens.spaceXl),

        // Content based on day type and video availability
        Expanded(
          child: _buildDayContent(daySnippets, isToday, isPast, isFuture),
        ),
      ],
    );
  }

  Widget _buildDayContent(
      List<Snippet> daySnippets, bool isToday, bool isPast, bool isFuture) {
    if (isFuture) {
      return _buildFutureDayContent();
    }

    if (daySnippets.isNotEmpty) {
      return DateVideoDisplay(
        snippets: daySnippets,
        isToday: isToday,
        onVideoTap: (snippet) => _playVideo(snippet),
        onEditTap: _canRecordVideo(_selectedDay!)
            ? (snippet) => _editSnippet(snippet)
            : null,
        onDeleteTap: _canRecordVideo(_selectedDay!)
            ? (snippet) => _deleteSnippet(snippet)
            : null,
      );
    }

    if (isToday) {
      return _buildTodayEmptyState();
    }

    return _buildPastEmptyState();
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String message,
    Widget? action,
  }) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: const BoxDecoration(
              color: AppTokens.surface,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 40, color: AppTokens.steel),
          ),
          const SizedBox(height: AppTokens.spaceXl),
          Text(title, style: AppTokens.headingSm),
          const SizedBox(height: AppTokens.spaceXs),
          Text(
            message,
            style: AppTokens.bodyMd.copyWith(color: AppTokens.slate),
            textAlign: TextAlign.center,
          ),
          if (action != null) ...[
            const SizedBox(height: AppTokens.spaceXxl),
            action,
          ],
        ],
      ),
    );
  }

  Widget _buildTodayEmptyState() {
    return _buildEmptyState(
      icon: Icons.videocam_outlined,
      title: 'No video for today',
      message: 'Tap the camera button to record your first video',
      action: FilledButton.icon(
        onPressed: _navigateToCamera,
        icon: const Icon(Icons.videocam, size: 18),
        label: const Text('Record Video'),
      ),
    );
  }

  Widget _buildPastEmptyState() {
    return _buildEmptyState(
      icon: Icons.video_library_outlined,
      title: 'No video recorded',
      message: 'You didn\'t record a video on this day',
    );
  }

  Widget _buildFutureDayContent() {
    return _buildEmptyState(
      icon: Icons.schedule,
      title: 'Future date',
      message: 'You can only record videos for today and yesterday',
    );
  }

  Widget _buildOverviewContent(List<Snippet> snippets) {
    return VideoGrid(
      snippets: snippets,
      onVideoTap: (snippet) => _playVideo(snippet),
    );
  }

  List<Snippet> _getSnippetsForDay(DateTime day, List<Snippet> snippets) {
    return snippets.where((snippet) {
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

  bool _isYesterday(DateTime day) {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return day.year == yesterday.year &&
        day.month == yesterday.month &&
        day.day == yesterday.day;
  }

  bool _canRecordVideo(DateTime day) {
    return _isToday(day) || _isYesterday(day);
  }

  void _navigateToCamera() {
    final dateString =
        DateFormat('yyyy-MM-dd').format(_selectedDay ?? DateTime.now());
    context.push('/camera/${widget.projectId}?date=$dateString');
  }

  void _playVideo(Snippet snippet) {
    context.push(
      '/video-player/${snippet.id}',
      extra: {'videoPath': snippet.videoPath},
    );
  }

  void _editSnippet(Snippet snippet) {
    // TODO: Implement snippet editing
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Edit functionality coming soon')),
    );
  }

  void _deleteSnippet(Snippet snippet) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Delete Video'),
          content: const Text(
              'Are you sure you want to delete this video? This action cannot be undone.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                context
                    .read<SnippetsProvider>()
                    .deleteSnippet(snippet.id, widget.projectId);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Video deleted')),
                );
              },
              style: TextButton.styleFrom(foregroundColor: AppTokens.error),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );
  }

  void _showProjectMenu(BuildContext context, project) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.edit_outlined),
                title: const Text('Edit Project'),
                onTap: () {
                  Navigator.pop(context);
                  // TODO: Navigate to edit project screen
                },
              ),
              ListTile(
                leading: const Icon(Icons.file_download_outlined),
                title: const Text('Export Project'),
                onTap: () {
                  Navigator.pop(context);
                  context.push('/export/${widget.projectId}');
                },
              ),
              ListTile(
                leading:
                    const Icon(Icons.delete_outline, color: AppTokens.error),
                title: const Text('Delete Project',
                    style: TextStyle(color: AppTokens.error)),
                onTap: () {
                  Navigator.pop(context);
                  // TODO: Implement project deletion
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
