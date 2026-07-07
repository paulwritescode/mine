import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:camera/camera.dart';
import 'package:permission_handler/permission_handler.dart';
import '../../providers/settings_provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/theme/tokens.dart';

class CameraScreen extends StatefulWidget {
  final String projectId;

  const CameraScreen({
    super.key,
    required this.projectId,
  });

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> with TickerProviderStateMixin, WidgetsBindingObserver {
  CameraController? _cameraController;
  List<CameraDescription> _cameras = [];
  int _selectedCameraIndex = 0;
  bool _isRecording = false;
  int _selectedDuration = AppConstants.defaultVideoDuration;
  int _countdown = 0;
  late AnimationController _recordingController;
  late AnimationController _countdownController;
  DateTime? _selectedDate;
  bool _isInitialized = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    
    _recordingController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _countdownController = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    );
    
    // Set default date - will be updated in didChangeDependencies
    _selectedDate = DateTime.now();
    
    _initializeCamera();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    
    // Parse date from query parameters if provided
    final uri = GoRouterState.of(context).uri;
    final dateString = uri.queryParameters['date'];
    if (dateString != null) {
      try {
        _selectedDate = DateFormat('yyyy-MM-dd').parse(dateString);
      } catch (e) {
        _selectedDate = DateTime.now();
      }
    }
    
    // Get settings
    final settings = context.read<SettingsProvider>().settings;
    if (settings != null && _selectedDuration == AppConstants.defaultVideoDuration) {
      _selectedDuration = settings.defaultVideoDuration;
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    final CameraController? cameraController = _cameraController;

    // App state changed before we got the chance to initialize.
    if (cameraController == null || !cameraController.value.isInitialized) {
      return;
    }

    if (state == AppLifecycleState.inactive) {
      cameraController.dispose();
    } else if (state == AppLifecycleState.resumed) {
      _initializeCamera();
    }
  }

  Future<void> _initializeCamera() async {
    try {
      // Request camera permission
      final cameraStatus = await Permission.camera.request();
      final microphoneStatus = await Permission.microphone.request();
      
      if (cameraStatus != PermissionStatus.granted || microphoneStatus != PermissionStatus.granted) {
        setState(() {
          _errorMessage = 'Camera and microphone permissions are required';
        });
        return;
      }

      // Get available cameras
      _cameras = await availableCameras();
      
      if (_cameras.isEmpty) {
        setState(() {
          _errorMessage = 'No cameras available';
        });
        return;
      }

      // Initialize camera controller
      _cameraController = CameraController(
        _cameras[_selectedCameraIndex],
        ResolutionPreset.high,
        enableAudio: true,
      );

      await _cameraController!.initialize();
      
      if (mounted) {
        setState(() {
          _isInitialized = true;
          _errorMessage = null;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to initialize camera: $e';
        });
      }
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _cameraController?.dispose();
    _recordingController.dispose();
    _countdownController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTokens.inkStrong,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            _buildHeader(),
            // Camera preview area
            Expanded(
              child: _buildCameraPreview(),
            ),
            // Controls
            _buildControls(),
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
            icon: const Icon(Icons.close, color: AppTokens.onDark),
            onPressed: () => context.pop(),
          ),
          Expanded(
            child: Column(
              children: [
                const Text(
                  'Record Video',
                  style: TextStyle(
                    color: AppTokens.onDark,
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (_selectedDate != null)
                  Text(
                    DateFormat('EEEE, MMMM d').format(_selectedDate!.toLocal()),
                    style: TextStyle(
                      color: AppTokens.onDark.withValues(alpha: 0.7),
                      fontSize: 14,
                    ),
                  ),
              ],
            ),
          ),
          // Duration selector
          _buildDurationSelector(),
        ],
      ),
    );
  }

  Widget _buildDurationSelector() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppTokens.onDark.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<int>(
          value: _selectedDuration,
          dropdownColor: const Color(0xFF1C1C1C),
          style: const TextStyle(color: AppTokens.onDark),
          icon: const Icon(Icons.keyboard_arrow_down, color: AppTokens.onDark),
          items: AppConstants.videoDurations.map((duration) {
            return DropdownMenuItem(
              value: duration,
              child: Text('${duration}s'),
            );
          }).toList(),
          onChanged: _isRecording ? null : (value) {
            if (value != null) {
              setState(() {
                _selectedDuration = value;
              });
            }
          },
        ),
      ),
    );
  }

  Widget _buildCameraPreview() {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppTokens.inkStrong,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Camera preview or error/loading state
          Container(
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: _buildCameraContent(),
            ),
          ),
          // Recording indicator
          if (_isRecording)
            Positioned(
              top: 20,
              child: AnimatedBuilder(
                animation: _recordingController,
                builder: (context, child) {
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppTokens.brandCoral.withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppTokens.onDark,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'REC ${_countdown}s',
                          style: const TextStyle(
                            color: AppTokens.onDark,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          // Countdown overlay
          if (_countdown > 0 && !_isRecording)
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: AppTokens.inkStrong.withValues(alpha: 0.7),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  '$_countdown',
                  style: const TextStyle(
                    color: AppTokens.onDark,
                    fontSize: 48,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildCameraContent() {
    if (_errorMessage != null) {
      return Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              const Color(0xFF1C1C1C),
              AppTokens.inkStrong,
            ],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 80,
                color: AppTokens.onDark.withValues(alpha: 0.54),
              ),
              const SizedBox(height: 16),
              Text(
                'Camera Error',
                style: TextStyle(
                  color: AppTokens.onDark.withValues(alpha: 0.54),
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 8),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Text(
                  _errorMessage!,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: AppTokens.onDark.withValues(alpha: 0.38),
                    fontSize: 14,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _initializeCamera,
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    if (!_isInitialized || _cameraController == null) {
      return Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              const Color(0xFF1C1C1C),
              AppTokens.inkStrong,
            ],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(
                color: AppTokens.onDark.withValues(alpha: 0.54),
              ),
              const SizedBox(height: 16),
              Text(
                'Initializing Camera...',
                style: TextStyle(
                  color: AppTokens.onDark.withValues(alpha: 0.54),
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return CameraPreview(_cameraController!);
  }

  Widget _buildControls() {
    return Container(
      padding: const EdgeInsets.all(32),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          // Gallery button
          IconButton(
            icon: Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: AppTokens.onDark.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.photo_library,
                color: AppTokens.onDark,
                size: 24,
              ),
            ),
            onPressed: _isRecording ? null : _openGallery,
          ),
          // Record button
          GestureDetector(
            onTap: _isRecording ? null : _startRecording,
            child: AnimatedBuilder(
              animation: _recordingController,
              builder: (context, child) {
                return Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: _isRecording
                        ? AppTokens.brandCoral
                        : AppTokens.onDark,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppTokens.onDark,
                      width: 4,
                    ),
                  ),
                  child: _isRecording
                      ? const Icon(
                          Icons.stop,
                          color: AppTokens.onDark,
                          size: 32,
                        )
                      : const Icon(
                          Icons.videocam,
                          color: AppTokens.ink,
                          size: 32,
                        ),
                );
              },
            ),
          ),
          // Switch camera button
          IconButton(
            icon: Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: AppTokens.onDark.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.flip_camera_ios,
                color: AppTokens.onDark,
                size: 24,
              ),
            ),
            onPressed: _isRecording ? null : _switchCamera,
          ),
        ],
      ),
    );
  }

  void _startRecording() async {
    if (_isRecording || _cameraController == null || !_cameraController!.value.isInitialized) return;

    // Haptic feedback
    HapticFeedback.mediumImpact();

    try {
      setState(() {
        _isRecording = true;
        _countdown = _selectedDuration;
      });

      _recordingController.forward();

      // Start video recording
      await _cameraController!.startVideoRecording();

      // Countdown timer
      for (int i = _selectedDuration; i > 0; i--) {
        if (!_isRecording) break;
        
        setState(() {
          _countdown = i;
        });
        
        await Future.delayed(const Duration(seconds: 1));
      }

      if (_isRecording) {
        _stopRecording();
      }
    } catch (e) {
      setState(() {
        _isRecording = false;
        _countdown = 0;
      });
      _recordingController.reverse();
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error starting recording: $e'),
            backgroundColor: AppTokens.error,
          ),
        );
      }
    }
  }

  void _stopRecording() async {
    if (!_isRecording || _cameraController == null) return;

    try {
      final XFile videoFile = await _cameraController!.stopVideoRecording();
      
      setState(() {
        _isRecording = false;
        _countdown = 0;
      });

      _recordingController.reverse();

      // Haptic feedback
      HapticFeedback.lightImpact();

      // Navigate to post-capture screen with actual video path
      if (mounted) {
        context.push('/post-capture', extra: {
          'videoPath': videoFile.path,
          'projectId': widget.projectId,
          'duration': _selectedDuration,
          'recordedDate': _selectedDate?.toIso8601String(),
        });
      }
    } catch (e) {
      setState(() {
        _isRecording = false;
        _countdown = 0;
      });
      _recordingController.reverse();
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error stopping recording: $e'),
            backgroundColor: AppTokens.error,
          ),
        );
      }
    }
  }

  void _openGallery() {
    // TODO: Implement gallery opening
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Gallery functionality coming soon'),
        backgroundColor: AppTokens.ink,
      ),
    );
  }

  void _switchCamera() async {
    if (_isRecording || _cameras.length <= 1) return;
    
    HapticFeedback.selectionClick();
    
    try {
      _selectedCameraIndex = (_selectedCameraIndex + 1) % _cameras.length;
      
      await _cameraController?.dispose();
      
      _cameraController = CameraController(
        _cameras[_selectedCameraIndex],
        ResolutionPreset.high,
        enableAudio: true,
      );

      await _cameraController!.initialize();
      
      if (mounted) {
        setState(() {});
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error switching camera: $e'),
            backgroundColor: AppTokens.error,
          ),
        );
      }
    }
  }
}