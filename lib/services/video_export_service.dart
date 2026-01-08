import 'dart:io';
import 'package:path/path.dart' as path;
import 'package:path_provider/path_provider.dart';
import 'package:ffmpeg_kit_flutter_new/ffmpeg_kit.dart';
import 'package:ffmpeg_kit_flutter_new/return_code.dart';
import 'package:gal/gal.dart';
import '../core/models/snippet.dart';

class VideoExportService {
  Future<String> concatenateVideos(
    List<Snippet> snippets, {
    required Function(double progress, String status) onProgress,
  }) async {
    if (snippets.isEmpty) {
      throw Exception('No videos to concatenate');
    }

    // Sort snippets by recorded date
    final sortedSnippets = List<Snippet>.from(snippets)
      ..sort((a, b) => a.recordedAt.compareTo(b.recordedAt));

    onProgress(0.1, 'Preparing video files...');

    // Get output directory
    final documentsDir = await getApplicationDocumentsDirectory();
    final outputDir = Directory(path.join(documentsDir.path, 'exports'));
    if (!await outputDir.exists()) {
      await outputDir.create(recursive: true);
    }

    // Generate output filename
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final outputPath = path.join(outputDir.path, 'export_$timestamp.mp4');

    onProgress(0.2, 'Validating video files...');

    // Validate all video files exist
    for (final snippet in sortedSnippets) {
      final videoFile = File(snippet.videoPath);
      if (!await videoFile.exists()) {
        throw Exception('Video file not found: ${snippet.videoPath}');
      }
    }

    if (sortedSnippets.length == 1) {
      // Single video - just copy it
      onProgress(0.5, 'Copying single video...');
      final sourceFile = File(sortedSnippets.first.videoPath);
      await sourceFile.copy(outputPath);
      onProgress(1.0, 'Export completed!');
      return outputPath;
    }

    // Multiple videos - concatenate using ffmpeg
    onProgress(0.3, 'Creating file list...');

    // Create a temporary file list for ffmpeg concat
    final tempDir = await getTemporaryDirectory();
    final fileListPath = path.join(tempDir.path, 'concat_list_$timestamp.txt');
    final fileListContent = sortedSnippets
        .map((snippet) => "file '${snippet.videoPath}'")
        .join('\n');
    
    await File(fileListPath).writeAsString(fileListContent);

    onProgress(0.4, 'Starting video concatenation...');

    try {
      // FFmpeg command to concatenate videos
      final command = '-f concat -safe 0 -i "$fileListPath" -c copy "$outputPath"';
      
      final session = await FFmpegKit.execute(command);
      final returnCode = await session.getReturnCode();

      onProgress(0.9, 'Finalizing export...');

      if (ReturnCode.isSuccess(returnCode)) {
        // Clean up temporary file
        await File(fileListPath).delete();
        onProgress(1.0, 'Export completed successfully!');
        return outputPath;
      } else {
        final logs = await session.getLogs();
        final errorMessage = logs.map((log) => log.getMessage()).join('\n');
        throw Exception('FFmpeg failed: $errorMessage');
      }
    } catch (e) {
      // Clean up temporary file on error
      try {
        await File(fileListPath).delete();
      } catch (_) {}
      
      // If concat fails, try alternative method
      return await _concatenateWithReencoding(sortedSnippets, outputPath, onProgress);
    }
  }

  Future<String> _concatenateWithReencoding(
    List<Snippet> snippets,
    String outputPath,
    Function(double progress, String status) onProgress,
  ) async {
    onProgress(0.5, 'Using alternative concatenation method...');

    // Create input arguments for ffmpeg
    final inputArgs = <String>[];
    final filterComplex = <String>[];
    
    for (int i = 0; i < snippets.length; i++) {
      inputArgs.addAll(['-i', snippets[i].videoPath]);
      filterComplex.add('[$i:v][$i:a]');
    }
    
    final filterString = '${filterComplex.join('')}concat=n=${snippets.length}:v=1:a=1[outv][outa]';
    
    final command = [
      ...inputArgs,
      '-filter_complex', filterString,
      '-map', '[outv]',
      '-map', '[outa]',
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-preset', 'fast',
      outputPath,
    ].join(' ');

    onProgress(0.6, 'Re-encoding and concatenating videos...');

    final session = await FFmpegKit.execute(command);
    final returnCode = await session.getReturnCode();

    if (ReturnCode.isSuccess(returnCode)) {
      onProgress(1.0, 'Export completed with re-encoding!');
      return outputPath;
    } else {
      final logs = await session.getLogs();
      final errorMessage = logs.map((log) => log.getMessage()).join('\n');
      throw Exception('Video concatenation failed: $errorMessage');
    }
  }

  Future<List<String>> getExportedVideos() async {
    try {
      final documentsDir = await getApplicationDocumentsDirectory();
      final exportDir = Directory(path.join(documentsDir.path, 'exports'));
      
      if (!await exportDir.exists()) {
        return [];
      }

      final files = await exportDir.list().toList();
      return files
          .where((file) => file is File && file.path.endsWith('.mp4'))
          .map((file) => file.path)
          .toList();
    } catch (e) {
      return [];
    }
  }

  Future<void> deleteExportedVideo(String filePath) async {
    try {
      final file = File(filePath);
      if (await file.exists()) {
        await file.delete();
      }
    } catch (e) {
      throw Exception('Failed to delete exported video: $e');
    }
  }

  Future<int> getExportedVideoSize(String filePath) async {
    try {
      final file = File(filePath);
      if (await file.exists()) {
        return await file.length();
      }
      return 0;
    } catch (e) {
      return 0;
    }
  }

  /// Save exported video to device gallery
  Future<bool> saveToGallery(String filePath) async {
    try {
      // Check if file exists
      final file = File(filePath);
      if (!await file.exists()) {
        throw Exception('Video file not found');
      }

      // Save to gallery using gal package
      await Gal.putVideo(filePath);
      return true;
    } on GalException catch (e) {
      throw Exception('Failed to save to gallery: ${e.type.message}');
    } catch (e) {
      throw Exception('Failed to save to gallery: $e');
    }
  }

  /// Check if gallery save permission is available
  Future<bool> hasGalleryPermission() async {
    try {
      return await Gal.hasAccess();
    } catch (e) {
      return false;
    }
  }

  /// Request gallery save permission
  Future<bool> requestGalleryPermission() async {
    try {
      return await Gal.requestAccess();
    } catch (e) {
      return false;
    }
  }

  String formatFileSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    if (bytes < 1024 * 1024 * 1024) return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
    return '${(bytes / (1024 * 1024 * 1024)).toStringAsFixed(1)} GB';
  }
}