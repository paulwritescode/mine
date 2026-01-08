import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:share_plus/share_plus.dart';
import '../../providers/snippets_provider.dart';
import '../../providers/projects_provider.dart';
import '../../core/models/project.dart';
import '../../core/models/snippet.dart';
import '../../services/video_export_service.dart';

class ExportScreen extends StatefulWidget {
  final String projectId;

  const ExportScreen({
    super.key,
    required this.projectId,
  });

  @override
  State<ExportScreen> createState() => _ExportScreenState();
}

class _ExportScreenState extends State<ExportScreen> {
  final VideoExportService _exportService = VideoExportService();
  bool _isExporting = false;
  double _exportProgress = 0.0;
  String _exportStatus = '';
  String? _exportedVideoPath;
  Project? _project;
  List<Snippet> _snippets = [];

  @override
  void initState() {
    super.initState();
    _loadProjectData();
  }

  Future<void> _loadProjectData() async {
    final projectsProvider = Provider.of<ProjectsProvider>(context, listen: false);
    final snippetsProvider = Provider.of<SnippetsProvider>(context, listen: false);
    
    _project = projectsProvider.getProjectById(widget.projectId);
    await snippetsProvider.loadSnippetsForProject(widget.projectId);
    _snippets = snippetsProvider.getSnippetsForProject(widget.projectId);
    
    setState(() {});
  }

  Future<void> _exportProject() async {
    if (_snippets.isEmpty) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No videos to export')),
        );
      }
      return;
    }

    setState(() {
      _isExporting = true;
      _exportProgress = 0.0;
      _exportStatus = 'Preparing export...';
      _exportedVideoPath = null;
    });

    try {
      final exportedPath = await _exportService.concatenateVideos(
        _snippets,
        onProgress: (progress, status) {
          setState(() {
            _exportProgress = progress;
            _exportStatus = status;
          });
        },
      );

      setState(() {
        _exportedVideoPath = exportedPath;
        _exportStatus = 'Export completed!';
        _isExporting = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Project exported successfully!')),
        );
      }
    } catch (e) {
      setState(() {
        _isExporting = false;
        _exportStatus = 'Export failed: $e';
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Export failed: $e')),
        );
      }
    }
  }

  Future<void> _shareExportedVideo() async {
    if (_exportedVideoPath == null) return;

    try {
      await Share.shareXFiles(
        [XFile(_exportedVideoPath!)],
        text: 'Exported video from ${_project?.name ?? 'project'}',
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to share: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Export ${_project?.name ?? 'Project'}',
          style: const TextStyle(color: Colors.white),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildProjectInfo(),
            const SizedBox(height: 24),
            _buildVideosList(),
            const SizedBox(height: 24),
            _buildExportSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildProjectInfo() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[900],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _project?.name ?? 'Unknown Project',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '${_snippets.length} videos • ${_getTotalDuration()} total duration',
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 14,
            ),
          ),
          if (_project != null) ...[
            const SizedBox(height: 4),
            Text(
              'Created ${DateFormat('MMM d, yyyy').format(_project!.createdAt.toLocal())}',
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 12,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildVideosList() {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.grey[900],
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Videos to Export',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: _snippets.isEmpty
                  ? const Center(
                      child: Text(
                        'No videos in this project',
                        style: TextStyle(color: Colors.white70),
                      ),
                    )
                  : ListView.builder(
                      itemCount: _snippets.length,
                      itemBuilder: (context, index) {
                        final snippet = _snippets[index];
                        return _buildVideoItem(snippet, index + 1);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVideoItem(Snippet snippet, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey[800],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.blue,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Center(
              child: Text(
                '$index',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  DateFormat('MMM d, h:mm a').format(snippet.recordedAt.toLocal()),
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                if (snippet.note?.isNotEmpty == true) ...[
                  const SizedBox(height: 2),
                  Text(
                    snippet.note!,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 12,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ],
            ),
          ),
          Text(
            '${snippet.duration}s',
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExportSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[900],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Export Options',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          if (_isExporting) ...[
            LinearProgressIndicator(
              value: _exportProgress,
              backgroundColor: Colors.grey[700],
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.blue),
            ),
            const SizedBox(height: 8),
            Text(
              _exportStatus,
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 12,
              ),
            ),
            const SizedBox(height: 16),
          ],
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: _isExporting || _snippets.isEmpty ? null : _exportProject,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: _isExporting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Text('Export Project'),
                ),
              ),
              if (_exportedVideoPath != null) ...[
                const SizedBox(width: 12),
                ElevatedButton(
                  onPressed: _shareExportedVideo,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Icon(Icons.share),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  String _getTotalDuration() {
    final totalSeconds = _snippets.fold<int>(0, (sum, snippet) => sum + snippet.duration);
    final minutes = totalSeconds ~/ 60;
    final seconds = totalSeconds % 60;
    return '${minutes}m ${seconds}s';
  }
}