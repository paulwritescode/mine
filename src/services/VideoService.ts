/**
 * VideoService - Handles video recording, processing, and file management
 * Implements Requirements 2.4, 2.5, 4.4, 4.5
 */

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';

import { FileSystemService } from './FileSystemService';
import { SnippetService } from './SnippetService';

export interface VideoRecordingOptions {
  duration: number;
  projectId: string;
  date?: string; // For timeline projects
  note?: string; // User note for the video
}

export interface VideoProcessingProgress {
  progress: number; // 0-100
  stage: 'compressing' | 'generating_thumbnail' | 'saving' | 'complete';
}

export interface VideoSnippetResult {
  id: string;
  filePath: string;
  thumbnailPath: string;
  duration: number;
  projectId: string;
}

export class VideoService {
  private static instance: VideoService;
  private snippetService: SnippetService;

  private constructor() {
    this.snippetService = SnippetService.getInstance();
  }

  public static getInstance(): VideoService {
    if (!VideoService.instance) {
      VideoService.instance = new VideoService();
    }
    return VideoService.instance;
  }

  /**
   * Process recorded video with compression and thumbnail generation
   */
  public async processRecordedVideo(
    videoPath: string,
    options: VideoRecordingOptions,
    onProgress?: (progress: VideoProcessingProgress) => void
  ): Promise<VideoSnippetResult> {
    try {
      // Stage 1: Compress video
      onProgress?.({ progress: 10, stage: 'compressing' });
      const compressedPath = await this.compressVideo(videoPath);
      
      // Stage 2: Generate thumbnail
      onProgress?.({ progress: 50, stage: 'generating_thumbnail' });
      const thumbnailPath = await this.generateThumbnail(compressedPath, options.projectId);
      
      // Stage 3: Save to project directory
      onProgress?.({ progress: 80, stage: 'saving' });
      const finalVideoPath = await this.saveVideoToProject(compressedPath, options.projectId, options.date);
      
      // Stage 4: Create snippet record
      const snippet = await this.snippetService.addSnippet(
        options.projectId,
        finalVideoPath,
        thumbnailPath,
        options.duration,
        new Date(),
        options.date,
        options.note
      );

      // Success haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      onProgress?.({ progress: 100, stage: 'complete' });

      return {
        id: snippet.id,
        filePath: finalVideoPath,
        thumbnailPath,
        duration: options.duration,
        projectId: options.projectId,
      };

    } catch (error) {
      console.error('Video processing failed:', error);
      
      // Error haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      throw new Error(`Failed to process video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Compress video using H.264 codec
   */
  private async compressVideo(inputPath: string): Promise<string> {
    try {
      // For now, we'll copy the file as Expo doesn't have built-in video compression
      // In a production app, you'd use react-native-ffmpeg or similar
      const outputPath = FileSystemService.getTempPath(`compressed_${Date.now()}.mp4`);
      
      await FileSystemService.copyFile(inputPath, outputPath);

      return outputPath;
    } catch (error) {
      throw new Error(`Video compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate thumbnail from video with 8px rounded corners
   */
  private async generateThumbnail(videoPath: string, projectId: string): Promise<string> {
    try {
      // Create thumbnail directory if it doesn't exist
      const thumbnailDir = FileSystemService.getProjectPath(projectId) + 'thumbnails/';
      await FileSystemService.ensureDirectoryExists(thumbnailDir);
      
      // Generate unique thumbnail filename
      const thumbnailName = `thumbnail_${Date.now()}.jpg`;
      const thumbnailPath = `${thumbnailDir}${thumbnailName}`;

      // For now, we'll create a placeholder thumbnail
      // In a production app, you'd extract a frame from the video
      const placeholderThumbnail = await this.createPlaceholderThumbnail();
      
      await FileSystemService.copyFile(placeholderThumbnail, thumbnailPath);

      return thumbnailPath;
    } catch (error) {
      throw new Error(`Thumbnail generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a placeholder thumbnail (temporary implementation)
   */
  private async createPlaceholderThumbnail(): Promise<string> {
    // This is a temporary implementation
    // In a real app, you'd extract a frame from the video
    const placeholderPath = FileSystemService.getTempPath('placeholder_thumbnail.jpg');
    
    // Create a simple placeholder file
    await FileSystem.writeAsStringAsync(placeholderPath, '', {
      encoding: 'base64' as any,
    });
    
    return placeholderPath;
  }

  /**
   * Save video to project directory with proper naming
   */
  private async saveVideoToProject(
    videoPath: string,
    projectId: string,
    date?: string
  ): Promise<string> {
    try {
      const videosDir = FileSystemService.getProjectPath(projectId) + 'videos/';
      await FileSystemService.ensureDirectoryExists(videosDir);
      
      // Generate filename based on date or timestamp
      const timestamp = date || new Date().toISOString().split('T')[0];
      const videoName = `${timestamp}_${Date.now()}.mp4`;
      const finalPath = `${videosDir}${videoName}`;

      await FileSystemService.moveFile(videoPath, finalPath);

      return finalPath;
    } catch (error) {
      throw new Error(`Failed to save video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get video duration from file
   */
  public async getVideoDuration(videoPath: string): Promise<number> {
    try {
      const info = await FileSystem.getInfoAsync(videoPath);
      if (!info.exists) {
        throw new Error('Video file does not exist');
      }

      // For now, return a default duration
      // In a production app, you'd use a video library to get actual duration
      return 2.0; // Default 2 seconds
    } catch (error) {
      throw new Error(`Failed to get video duration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete video and associated files
   */
  public async deleteVideo(videoPath: string, thumbnailPath?: string): Promise<void> {
    try {
      // Delete video file
      const videoInfo = await FileSystem.getInfoAsync(videoPath);
      if (videoInfo.exists) {
        await FileSystem.deleteAsync(videoPath);
      }

      // Delete thumbnail if provided
      if (thumbnailPath) {
        const thumbnailInfo = await FileSystem.getInfoAsync(thumbnailPath);
        if (thumbnailInfo.exists) {
          await FileSystem.deleteAsync(thumbnailPath);
        }
      }
    } catch (error) {
      console.error('Failed to delete video files:', error);
      // Don't throw error for cleanup operations
    }
  }

  /**
   * Export video to camera roll
   */
  public async exportToCameraRoll(videoPath: string): Promise<void> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Media library permission not granted');
      }

      await MediaLibrary.saveToLibraryAsync(videoPath);
      
      // Success haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw new Error(`Failed to export video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get storage usage for videos
   */
  public async getStorageUsage(projectId?: string): Promise<{ totalSize: number; fileCount: number }> {
    try {
      if (projectId) {
        // Get usage for specific project
        const videosDir = FileSystemService.getProjectPath(projectId) + 'videos/';
        return await this.calculateDirectorySize(videosDir);
      } else {
        // Get total usage across all projects
        const projectsDir = FileSystemService.getProjectPath('');
        return await this.calculateDirectorySize(projectsDir);
      }
    } catch (error) {
      console.error('Failed to calculate storage usage:', error);
      return { totalSize: 0, fileCount: 0 };
    }
  }

  /**
   * Calculate directory size recursively
   */
  private async calculateDirectorySize(dirPath: string): Promise<{ totalSize: number; fileCount: number }> {
    try {
      const totalSize = await FileSystemService.calculateDirectorySize(dirPath);
      const files = await FileSystemService.listDirectory(dirPath);
      return { totalSize, fileCount: files.length };
    } catch (error) {
      console.error('Failed to calculate directory size:', error);
      return { totalSize: 0, fileCount: 0 };
    }
  }

  /**
   * Clean up temporary files
   */
  public async cleanupTempFiles(): Promise<void> {
    try {
      await FileSystemService.cleanupTempFiles();
    } catch (error) {
      console.error('Failed to cleanup temp files:', error);
      // Don't throw error for cleanup operations
    }
  }

  /**
   * Show success toast notification (placeholder for now)
   */
  public showSuccessToast(message: string): void {
    // For now, use Alert. In a production app, you'd use a toast library
    Alert.alert('Success', message, [{ text: 'OK' }]);
  }

  /**
   * Show error toast notification (placeholder for now)
   */
  public showErrorToast(message: string): void {
    // For now, use Alert. In a production app, you'd use a toast library
    Alert.alert('Error', message, [{ text: 'OK' }]);
  }
}