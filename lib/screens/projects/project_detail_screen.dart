import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../providers/projects_provider.dart';
import '../../providers/snippets_provider.dart';
import '../../core/models/snippet.dart';
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
      backgroundColor: Colors.white,
      body: Consumer2<ProjectsProvider, SnippetsProvider>(
        builder: (context, projectsProvider, snippetsProvider, child) {
          final project = projectsProvider.getProjectById(widget.projectId);
          final snippets = snippetsProvider.getSnippetsForProject(widget.projectId);
          
          if (project == null) {
            return const Center(child: Text('Project not found'));
          }

          return Column(
            children: [
              // Header
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 10,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back, color: Colors.black),
                          onPressed: () => context.pop(),
                        ),
                        Expanded(
                          child: Text(
                            project.name,
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                              color: Colors.black,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.file_download, color: Colors.black),
                          onPressed: () => context.push('/export/${widget.projectId}'),
                          tooltip: 'Export Project',
                        ),
                        IconButton(
                          icon: const Icon(Icons.more_vert, color: Colors.black),
                          onPressed: () => _showProjectMenu(context, project),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              
              // Calendar Section
              Container(
                padding: const EdgeInsets.all(16),
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
                  padding: const EdgeInsets.all(16),
                  child: _selectedDay != null
                      ? _buildDateContent(snippets)
                      : _buildOverviewContent(snippets),
                ),
              ),
            ],
          );
        },
      ),
      // Floating action button for recording
      floatingActionButton: _selectedDay != null && _isToday(_selectedDay!)
          ? FloatingActionButton(
              onPressed: () => _navigateToCamera(),
              backgroundColor: Colors.black,
              child: const Icon(Icons.videocam, color: Colors.white),
            )
          : null,
    );
  }

  Widget _buildLegend() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildLegendItem(
            color: const Color(0xFF2196F3),
            label: 'Today',
          ),
          _buildLegendItem(
            color: const Color(0xFF4CAF50),
            label: 'Has Video',
          ),
          _buildLegendItem(
            color: const Color(0xFFE0E0E0),
            label: 'No Video',
          ),
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
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[700],
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
    final isPast = _selectedDay!.isBefore(DateTime.now().subtract(const Duration(days: 1)));
    final isFuture = _selectedDay!.isAfter(DateTime.now());

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Date header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              DateFormat('EEEE, MMMM d').format(_selectedDay!.toLocal()),
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
            if (isToday)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF2196F3),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Text(
                  'Today',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 24),
        
        // Content based on day type and video availability
        Expanded(
          child: _buildDayContent(daySnippets, isToday, isPast, isFuture),
        ),
      ],
    );
  }

  Widget _buildDayContent(List<Snippet> daySnippets, bool isToday, bool isPast, bool isFuture) {
    if (isFuture) {
      return _buildFutureDayContent();
    }

    if (daySnippets.isNotEmpty) {
      return DateVideoDisplay(
        snippets: daySnippets,
        isToday: isToday,
        onVideoTap: (snippet) => _playVideo(snippet),
        onEditTap: isToday ? (snippet) => _editSnippet(snippet) : null,
        onDeleteTap: isToday ? (snippet) => _deleteSnippet(snippet) : null,
      );
    }

    if (isToday) {
      return _buildTodayEmptyState();
    }

    return _buildPastEmptyState();
  }

  Widget _buildTodayEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.grey[100],
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.videocam_outlined,
              size: 40,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'No video for today',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Tap the camera button to record your first video',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: _navigateToCamera,
            icon: const Icon(Icons.videocam),
            label: const Text('Record Video'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.black,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPastEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.grey[100],
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.video_library_outlined,
              size: 40,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'No video recorded',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'You didn\'t record a video on this day',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildFutureDayContent() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.grey[100],
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.schedule,
              size: 40,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Future date',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'You can only record videos for today and past dates',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
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
    return day.year == now.year && day.month == now.month && day.day == now.day;
  }

  void _navigateToCamera() {
    final dateString = DateFormat('yyyy-MM-dd').format(_selectedDay ?? DateTime.now());
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
          content: const Text('Are you sure you want to delete this video? This action cannot be undone.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.read<SnippetsProvider>().deleteSnippet(snippet.id, widget.projectId);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Video deleted')),
                );
              },
              style: TextButton.styleFrom(foregroundColor: Colors.red),
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
                leading: const Icon(Icons.edit),
                title: const Text('Edit Project'),
                onTap: () {
                  Navigator.pop(context);
                  // TODO: Navigate to edit project screen
                },
              ),
              ListTile(
                leading: const Icon(Icons.file_download),
                title: const Text('Export Project'),
                onTap: () {
                  Navigator.pop(context);
                  context.push('/export/${widget.projectId}');
                },
              ),
              ListTile(
                leading: const Icon(Icons.delete, color: Colors.red),
                title: const Text('Delete Project', style: TextStyle(color: Colors.red)),
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