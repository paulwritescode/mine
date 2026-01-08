import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:video_player/video_player.dart';
import 'dart:io';

class VideoPlayerScreen extends StatefulWidget {
  final String snippetId;
  final String? videoPath;

  const VideoPlayerScreen({
    super.key,
    required this.snippetId,
    this.videoPath,
  });

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  VideoPlayerController? _controller;
  bool _isInitialized = false;
  bool _showControls = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _initializeVideo();
    
    // Hide system UI for immersive experience
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
  }

  @override
  void dispose() {
    _controller?.dispose();
    // Restore system UI
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    super.dispose();
  }

  Future<void> _initializeVideo() async {
    if (widget.videoPath == null) {
      setState(() {
        _errorMessage = 'No video path provided';
      });
      return;
    }

    try {
      final videoFile = File(widget.videoPath!);
      if (!await videoFile.exists()) {
        setState(() {
          _errorMessage = 'Video file not found';
        });
        return;
      }

      _controller = VideoPlayerController.file(videoFile);
      await _controller!.initialize();
      
      if (mounted) {
        setState(() {
          _isInitialized = true;
        });
        
        // Auto-play the video
        _controller!.play();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Error loading video: $e';
        });
      }
    }
  }

  void _togglePlayPause() {
    if (_controller == null) return;
    
    setState(() {
      if (_controller!.value.isPlaying) {
        _controller!.pause();
      } else {
        _controller!.play();
      }
    });
  }

  void _toggleControls() {
    setState(() {
      _showControls = !_showControls;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: GestureDetector(
        onTap: _toggleControls,
        child: Stack(
          children: [
            // Video player
            Center(
              child: _buildVideoContent(),
            ),
            // Controls overlay
            if (_showControls) _buildControlsOverlay(),
          ],
        ),
      ),
    );
  }

  Widget _buildVideoContent() {
    if (_errorMessage != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.white,
            ),
            const SizedBox(height: 16),
            const Text(
              'Error Loading Video',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _errorMessage!,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 16,
                color: Colors.white70,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Go Back'),
            ),
          ],
        ),
      );
    }

    if (!_isInitialized || _controller == null) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(
              color: Colors.white,
            ),
            SizedBox(height: 16),
            Text(
              'Loading Video...',
              style: TextStyle(
                fontSize: 18,
                color: Colors.white,
              ),
            ),
          ],
        ),
      );
    }

    return AspectRatio(
      aspectRatio: _controller!.value.aspectRatio,
      child: VideoPlayer(_controller!),
    );
  }

  Widget _buildControlsOverlay() {
    return SafeArea(
      child: Column(
        children: [
          // Top bar
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.black.withValues(alpha: 0.7),
                  Colors.transparent,
                ],
              ),
            ),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: Colors.white),
                  onPressed: () => Navigator.of(context).pop(),
                ),
                const Expanded(
                  child: Text(
                    'Video Player',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const Spacer(),
          // Bottom controls
          if (_isInitialized && _controller != null)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [
                    Colors.black.withValues(alpha: 0.7),
                    Colors.transparent,
                  ],
                ),
              ),
              child: Column(
                children: [
                  // Progress bar
                  VideoProgressIndicator(
                    _controller!,
                    allowScrubbing: true,
                    colors: const VideoProgressColors(
                      playedColor: Colors.white,
                      bufferedColor: Colors.white30,
                      backgroundColor: Colors.white10,
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Play/pause button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      IconButton(
                        icon: Icon(
                          _controller!.value.isPlaying ? Icons.pause : Icons.play_arrow,
                          color: Colors.white,
                          size: 32,
                        ),
                        onPressed: _togglePlayPause,
                      ),
                    ],
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}