import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:video_player/video_player.dart';
import 'package:video_thumbnail/video_thumbnail.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import 'dart:io';
import '../../providers/snippets_provider.dart';
import '../../core/models/snippet.dart';

class PostCaptureScreen extends StatefulWidget {
  final String videoPath;
  final String projectId;
  final int duration;

  const PostCaptureScreen({
    super.key,
    required this.videoPath,
    required this.projectId,
    required this.duration,
  });

  @override
  State<PostCaptureScreen> createState() => _PostCaptureScreenState();
}

class _PostCaptureScreenState extends State<PostCaptureScreen> {
  final _noteController = TextEditingController();
  final _locationController = TextEditingController();
  final _noteFocusNode = FocusNode();
  final _locationFocusNode = FocusNode();
  bool _isSaving = false;
  DateTime? _recordedDate;
  VideoPlayerController? _videoController;
  bool _isVideoInitialized = false;
  String? _thumbnailPath;

  @override
  void initState() {
    super.initState();
    // Set default date - will be updated in didChangeDependencies
    _recordedDate = DateTime.now();
    
    _initializeVideo();
    _generateThumbnail();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    
    // Get recorded date from route extra data
    final extra = GoRouterState.of(context).extra as Map<String, dynamic>?;
    final dateString = extra?['recordedDate'] as String?;
    if (dateString != null) {
      try {
        _recordedDate = DateTime.parse(dateString);
      } catch (e) {
        _recordedDate = DateTime.now();
      }
    }
  }

  Future<void> _initializeVideo() async {
    try {
      _videoController = VideoPlayerController.file(File(widget.videoPath));
      await _videoController!.initialize();
      
      if (mounted) {
        setState(() {
          _isVideoInitialized = true;
        });
      }
    } catch (e) {
      debugPrint('Error initializing video: $e');
    }
  }

  Future<void> _generateThumbnail() async {
    try {
      final tempDir = await getTemporaryDirectory();
      final thumbnailFileName = 'thumbnail_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final thumbnailPath = path.join(tempDir.path, thumbnailFileName);
      
      final thumbnail = await VideoThumbnail.thumbnailFile(
        video: widget.videoPath,
        thumbnailPath: thumbnailPath,
        imageFormat: ImageFormat.JPEG,
        maxWidth: 300,
        quality: 75,
      );
      
      if (mounted && thumbnail != null) {
        setState(() {
          _thumbnailPath = thumbnail;
        });
      }
    } catch (e) {
      debugPrint('Error generating thumbnail: $e');
    }
  }

  @override
  void dispose() {
    _noteController.dispose();
    _locationController.dispose();
    _noteFocusNode.dispose();
    _locationFocusNode.dispose();
    _videoController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            _buildHeader(),
            // Video preview
            Expanded(
              flex: 3,
              child: _buildVideoPreview(),
            ),
            // Form section
            Expanded(
              flex: 2,
              child: _buildFormSection(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.close, color: Colors.white),
            onPressed: () => context.pop(),
          ),
          Expanded(
            child: Column(
              children: [
                const Text(
                  'Review Video',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (_recordedDate != null)
                  Text(
                    DateFormat('EEEE, MMMM d • h:mm a').format(_recordedDate!.toLocal()),
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
              ],
            ),
          ),
          TextButton(
            onPressed: _isSaving ? null : _saveVideo,
            child: _isSaving
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : const Text(
                    'Save',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildVideoPreview() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.grey[900],
        borderRadius: BorderRadius.circular(20),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Video preview
          Container(
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: _buildVideoContent(),
            ),
          ),
          // Play/Pause button
          if (_isVideoInitialized && _videoController != null)
            GestureDetector(
              onTap: _togglePlayPause,
              child: Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.9),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  _videoController!.value.isPlaying ? Icons.pause : Icons.play_arrow,
                  color: Colors.black,
                  size: 30,
                ),
              ),
            ),
          // Duration badge
          Positioned(
            bottom: 16,
            right: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.7),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Text(
                '${widget.duration}s',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVideoContent() {
    if (!_isVideoInitialized || _videoController == null) {
      return Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.grey[800]!,
              Colors.grey[900]!,
            ],
          ),
        ),
        child: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(
                color: Colors.white54,
              ),
              SizedBox(height: 16),
              Text(
                'Loading Video...',
                style: TextStyle(
                  color: Colors.white54,
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return AspectRatio(
      aspectRatio: _videoController!.value.aspectRatio,
      child: VideoPlayer(_videoController!),
    );
  }

  void _togglePlayPause() {
    if (_videoController == null) return;
    
    setState(() {
      if (_videoController!.value.isPlaying) {
        _videoController!.pause();
      } else {
        _videoController!.play();
      }
    });
  }

  Widget _buildFormSection() {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle bar
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 24),
            // Note field
            const Text(
              'Add a note (optional)',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _noteController,
              focusNode: _noteFocusNode,
              maxLines: 2,
              textInputAction: TextInputAction.next,
              onSubmitted: (_) => _locationFocusNode.requestFocus(),
              decoration: InputDecoration(
                hintText: 'What happened in this moment?',
                hintStyle: TextStyle(color: Colors.grey[500]),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Colors.black),
                ),
                contentPadding: const EdgeInsets.all(16),
              ),
            ),
            const SizedBox(height: 16),
            // Location field
            const Text(
              'Location (optional)',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _locationController,
              focusNode: _locationFocusNode,
              textInputAction: TextInputAction.done,
              onSubmitted: (_) => _locationFocusNode.unfocus(),
              decoration: InputDecoration(
                hintText: 'Where was this recorded?',
                hintStyle: TextStyle(color: Colors.grey[500]),
                prefixIcon: Icon(Icons.location_on, color: Colors.grey[500]),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Colors.black),
                ),
                contentPadding: const EdgeInsets.all(16),
              ),
            ),
            // Add some bottom padding to ensure fields are visible above keyboard
            SizedBox(height: MediaQuery.of(context).viewInsets.bottom > 0 ? 16 : 0),
          ],
        ),
      ),
    );
  }

  Future<void> _saveVideo() async {
    if (_isSaving) return;

    setState(() {
      _isSaving = true;
    });

    try {
      // Copy video to permanent location
      final appDir = await getApplicationDocumentsDirectory();
      final videosDir = Directory(path.join(appDir.path, 'videos'));
      if (!await videosDir.exists()) {
        await videosDir.create(recursive: true);
      }
      
      final videoFileName = 'video_${DateTime.now().millisecondsSinceEpoch}.mp4';
      final permanentVideoPath = path.join(videosDir.path, videoFileName);
      
      final originalFile = File(widget.videoPath);
      await originalFile.copy(permanentVideoPath);
      
      // Copy thumbnail to permanent location if it exists
      String? permanentThumbnailPath;
      if (_thumbnailPath != null) {
        final thumbnailsDir = Directory(path.join(appDir.path, 'thumbnails'));
        if (!await thumbnailsDir.exists()) {
          await thumbnailsDir.create(recursive: true);
        }
        
        final thumbnailFileName = 'thumbnail_${DateTime.now().millisecondsSinceEpoch}.jpg';
        permanentThumbnailPath = path.join(thumbnailsDir.path, thumbnailFileName);
        
        final thumbnailFile = File(_thumbnailPath!);
        await thumbnailFile.copy(permanentThumbnailPath);
      }

      final snippet = Snippet(
        projectId: widget.projectId,
        videoPath: permanentVideoPath,
        thumbnailPath: permanentThumbnailPath,
        duration: widget.duration,
        recordedAt: _recordedDate?.toLocal() ?? DateTime.now(),
        note: _noteController.text.trim().isEmpty ? null : _noteController.text.trim(),
        location: _locationController.text.trim().isEmpty ? null : _locationController.text.trim(),
      );

      if (!mounted) return;
      
      await context.read<SnippetsProvider>().addSnippet(snippet);

      if (mounted) {
        // Navigate back to project detail
        context.go('/project/${widget.projectId}');
        
        // Show success message
        Future.microtask(() {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Video saved successfully!'),
                backgroundColor: Colors.green,
              ),
            );
          }
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error saving video: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSaving = false;
        });
      }
    }
  }
}