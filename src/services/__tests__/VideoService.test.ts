/**
 * VideoService Tests
 * Tests video capture workflow functionality
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7
 */

import * as FileSystem from 'expo-file-system';
import { VideoService } from '../VideoService';
import { FileSystemService } from '../FileSystemService';
import { SnippetService } from '../SnippetService';

// Mock dependencies
jest.mock('expo-file-system');
jest.mock('expo-haptics');
jest.mock('expo-media-library');
jest.mock('../FileSystemService');
jest.mock('../SnippetService');

const mockFileSystem = FileSystem as jest.Mocked<typeof FileSystem>;
const mockFileSystemService = FileSystemService as jest.MockedClass<typeof FileSystemService>;
const mockSnippetService = SnippetService as jest.MockedClass<typeof SnippetService>;

describe('VideoService', () => {
  let videoService: VideoService;
  let mockFileSystemInstance: jest.Mocked<FileSystemService>;
  let mockSnippetInstance: jest.Mocked<SnippetService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock instances
    mockFileSystemInstance = {
      getProjectVideosDir: jest.fn(),
      getProjectThumbnailsDir: jest.fn(),
      getProjectsDir: jest.fn(),
    } as any;
    
    mockSnippetInstance = {
      addSnippet: jest.fn(),
    } as any;

    mockFileSystemService.getInstance.mockReturnValue(mockFileSystemInstance);
    mockSnippetService.getInstance.mockReturnValue(mockSnippetInstance);

    videoService = VideoService.getInstance();
  });

  describe('processRecordedVideo', () => {
    const mockVideoPath = '/cache/recorded_video.mp4';
    const mockOptions = {
      duration: 2,
      projectId: 'test-project-id',
      date: '2025-01-01',
    };

    beforeEach(() => {
      // Setup common mocks
      mockFileSystem.cacheDirectory = '/cache/';
      mockFileSystemInstance.getProjectThumbnailsDir.mockResolvedValue('/projects/test-project-id/thumbnails');
      mockFileSystemInstance.getProjectVideosDir.mockResolvedValue('/projects/test-project-id/videos');
      
      mockFileSystem.copyAsync.mockResolvedValue();
      mockFileSystem.moveAsync.mockResolvedValue();
      mockFileSystem.writeAsStringAsync.mockResolvedValue();
      
      mockSnippetInstance.addSnippet.mockResolvedValue({
        id: 'test-snippet-id',
        projectId: 'test-project-id',
        filePath: '/projects/test-project-id/videos/2025-01-01_123456.mp4',
        thumbnailPath: '/projects/test-project-id/thumbnails/thumbnail_123456.jpg',
        duration: 2,
        recordedDate: new Date(),
        createdAt: new Date(),
      });
    });

    it('should process video successfully with progress updates', async () => {
      const progressUpdates: any[] = [];
      const onProgress = jest.fn((progress) => progressUpdates.push(progress));

      const result = await videoService.processRecordedVideo(
        mockVideoPath,
        mockOptions,
        onProgress
      );

      // Verify progress updates were called
      expect(onProgress).toHaveBeenCalledWith({ progress: 10, stage: 'compressing' });
      expect(onProgress).toHaveBeenCalledWith({ progress: 50, stage: 'generating_thumbnail' });
      expect(onProgress).toHaveBeenCalledWith({ progress: 80, stage: 'saving' });
      expect(onProgress).toHaveBeenCalledWith({ progress: 100, stage: 'complete' });

      // Verify result structure
      expect(result).toEqual({
        id: 'test-snippet-id',
        filePath: expect.stringContaining('/projects/test-project-id/videos/'),
        thumbnailPath: expect.stringContaining('/projects/test-project-id/thumbnails/'),
        duration: 2,
        projectId: 'test-project-id',
      });

      // Verify file operations were called
      expect(mockFileSystem.copyAsync).toHaveBeenCalled(); // For compression
      expect(mockFileSystem.moveAsync).toHaveBeenCalled(); // For final save
      expect(mockSnippetInstance.addSnippet).toHaveBeenCalled();
    });

    it('should handle video compression errors', async () => {
      mockFileSystem.copyAsync.mockRejectedValueOnce(new Error('Compression failed'));

      await expect(
        videoService.processRecordedVideo(mockVideoPath, mockOptions)
      ).rejects.toThrow('Failed to process video: Video compression failed: Compression failed');
    });

    it('should handle thumbnail generation errors', async () => {
      mockFileSystem.copyAsync
        .mockResolvedValueOnce() // First call for compression succeeds
        .mockRejectedValueOnce(new Error('Thumbnail failed')); // Second call for thumbnail fails

      await expect(
        videoService.processRecordedVideo(mockVideoPath, mockOptions)
      ).rejects.toThrow('Failed to process video: Thumbnail generation failed: Thumbnail failed');
    });

    it('should handle snippet creation errors', async () => {
      mockSnippetInstance.addSnippet.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        videoService.processRecordedVideo(mockVideoPath, mockOptions)
      ).rejects.toThrow('Failed to process video: Database error');
    });
  });

  describe('getVideoDuration', () => {
    it('should return duration for existing video file', async () => {
      mockFileSystem.getInfoAsync.mockResolvedValue({
        exists: true,
        isDirectory: false,
        size: 1024000,
        modificationTime: Date.now(),
        uri: '/path/to/video.mp4',
      });

      const duration = await videoService.getVideoDuration('/path/to/video.mp4');
      expect(duration).toBe(2.0); // Default duration for now
    });

    it('should throw error for non-existent video file', async () => {
      mockFileSystem.getInfoAsync.mockResolvedValue({
        exists: false,
        isDirectory: false,
        size: 0,
        modificationTime: 0,
        uri: '/path/to/nonexistent.mp4',
      });

      await expect(
        videoService.getVideoDuration('/path/to/nonexistent.mp4')
      ).rejects.toThrow('Failed to get video duration: Video file does not exist');
    });
  });

  describe('deleteVideo', () => {
    it('should delete video and thumbnail files', async () => {
      mockFileSystem.getInfoAsync.mockResolvedValue({
        exists: true,
        isDirectory: false,
        size: 1024000,
        modificationTime: Date.now(),
        uri: '/path/to/file',
      });
      mockFileSystem.deleteAsync.mockResolvedValue();

      await videoService.deleteVideo('/path/to/video.mp4', '/path/to/thumbnail.jpg');

      expect(mockFileSystem.deleteAsync).toHaveBeenCalledWith('/path/to/video.mp4');
      expect(mockFileSystem.deleteAsync).toHaveBeenCalledWith('/path/to/thumbnail.jpg');
    });

    it('should handle deletion errors gracefully', async () => {
      mockFileSystem.getInfoAsync.mockResolvedValue({ exists: true } as any);
      mockFileSystem.deleteAsync.mockRejectedValue(new Error('Delete failed'));

      // Should not throw error
      await expect(
        videoService.deleteVideo('/path/to/video.mp4')
      ).resolves.toBeUndefined();
    });
  });

  describe('getStorageUsage', () => {
    beforeEach(() => {
      mockFileSystem.getInfoAsync.mockResolvedValue({
        exists: true,
        isDirectory: true,
        size: 0,
        modificationTime: Date.now(),
        uri: '/projects',
      });
      mockFileSystem.readDirectoryAsync.mockResolvedValue(['video1.mp4', 'video2.mp4']);
    });

    it('should calculate storage usage for specific project', async () => {
      mockFileSystemInstance.getProjectVideosDir.mockResolvedValue('/projects/test-project/videos');
      
      // Mock file info for each video
      mockFileSystem.getInfoAsync
        .mockResolvedValueOnce({ exists: true, isDirectory: true } as any) // Directory check
        .mockResolvedValueOnce({ exists: true, isDirectory: false, size: 1024000 } as any) // video1.mp4
        .mockResolvedValueOnce({ exists: true, isDirectory: false, size: 2048000 } as any); // video2.mp4

      const usage = await videoService.getStorageUsage('test-project');

      expect(usage).toEqual({
        totalSize: 3072000, // 1024000 + 2048000
        fileCount: 2,
      });
    });

    it('should calculate total storage usage across all projects', async () => {
      mockFileSystemInstance.getProjectsDir.mockResolvedValue('/projects');
      
      mockFileSystem.getInfoAsync
        .mockResolvedValueOnce({ exists: true, isDirectory: true } as any) // Directory check
        .mockResolvedValueOnce({ exists: true, isDirectory: false, size: 1024000 } as any) // video1.mp4
        .mockResolvedValueOnce({ exists: true, isDirectory: false, size: 2048000 } as any); // video2.mp4

      const usage = await videoService.getStorageUsage();

      expect(usage).toEqual({
        totalSize: 3072000,
        fileCount: 2,
      });
    });

    it('should handle storage calculation errors', async () => {
      mockFileSystemInstance.getProjectVideosDir.mockRejectedValue(new Error('Directory error'));

      const usage = await videoService.getStorageUsage('test-project');

      expect(usage).toEqual({
        totalSize: 0,
        fileCount: 0,
      });
    });
  });

  describe('cleanupTempFiles', () => {
    it('should clean up temporary files', async () => {
      mockFileSystem.cacheDirectory = '/cache/';
      mockFileSystem.readDirectoryAsync.mockResolvedValue([
        'compressed_123456.mp4',
        'placeholder_thumbnail.jpg',
        'other_file.txt',
      ]);
      mockFileSystem.deleteAsync.mockResolvedValue();

      await videoService.cleanupTempFiles();

      expect(mockFileSystem.deleteAsync).toHaveBeenCalledWith('/cache/compressed_123456.mp4', { idempotent: true });
      expect(mockFileSystem.deleteAsync).toHaveBeenCalledWith('/cache/placeholder_thumbnail.jpg', { idempotent: true });
      expect(mockFileSystem.deleteAsync).not.toHaveBeenCalledWith('/cache/other_file.txt', expect.any(Object));
    });

    it('should handle cleanup errors gracefully', async () => {
      mockFileSystem.cacheDirectory = '/cache/';
      mockFileSystem.readDirectoryAsync.mockRejectedValue(new Error('Read error'));

      // Should not throw error
      await expect(videoService.cleanupTempFiles()).resolves.toBeUndefined();
    });
  });
});