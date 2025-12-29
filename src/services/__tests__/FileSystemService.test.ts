/**
 * FileSystemService Test
 * Tests file system operations, storage management, and cleanup utilities
 * Validates Requirements 4.1, 4.3, 4.6, 4.7
 */

import { FileSystemService, StorageInfo, FileInfo } from '../FileSystemService';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

// Mock expo-file-system
jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: '/mock/documents/',
  makeDirectoryAsync: jest.fn().mockResolvedValue(undefined),
  deleteAsync: jest.fn().mockResolvedValue(undefined),
  getInfoAsync: jest.fn(),
  copyAsync: jest.fn().mockResolvedValue(undefined),
  moveAsync: jest.fn().mockResolvedValue(undefined),
  readDirectoryAsync: jest.fn().mockResolvedValue([]),
  getFreeDiskStorageAsync: jest.fn().mockResolvedValue(1000000000), // 1GB
}));

// Mock Platform
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

describe('FileSystemService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Platform.OS to ios for most tests
    (Platform as any).OS = 'ios';
  });

  describe('Directory Initialization', () => {
    it('should initialize all required directories', async () => {
      await FileSystemService.initializeDirectories();

      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        '/mock/documents/Mine/',
        { intermediates: true }
      );
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        '/mock/documents/Mine/projects/',
        { intermediates: true }
      );
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        '/mock/documents/Mine/temp/',
        { intermediates: true }
      );
    });

    it('should skip initialization on web platform', async () => {
      (Platform as any).OS = 'web';

      await FileSystemService.initializeDirectories();

      expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled();
    });

    it('should handle initialization errors', async () => {
      const error = new Error('Permission denied');
      (FileSystem.makeDirectoryAsync as jest.Mock).mockRejectedValue(error);

      await expect(FileSystemService.initializeDirectories()).rejects.toThrow(
        'Directory initialization failed: Error: Permission denied'
      );
    });
  });

  describe('Project Directory Management', () => {
    it('should create project directory structure', async () => {
      const projectId = 'test-project-123';
      
      const result = await FileSystemService.createProjectDirectory(projectId);

      expect(result).toBe('/mock/documents/Mine/projects/test-project-123/');
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        '/mock/documents/Mine/projects/test-project-123/',
        { intermediates: true }
      );
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        '/mock/documents/Mine/projects/test-project-123/videos/',
        { intermediates: true }
      );
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        '/mock/documents/Mine/projects/test-project-123/thumbnails/',
        { intermediates: true }
      );
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        '/mock/documents/Mine/projects/test-project-123/compiled/',
        { intermediates: true }
      );
    });

    it('should handle empty project ID', async () => {
      await expect(FileSystemService.createProjectDirectory('')).rejects.toThrow(
        'Project ID cannot be empty'
      );
      await expect(FileSystemService.createProjectDirectory('   ')).rejects.toThrow(
        'Project ID cannot be empty'
      );
    });

    it('should skip directory creation on web platform', async () => {
      (Platform as any).OS = 'web';
      
      const result = await FileSystemService.createProjectDirectory('test-project');
      
      expect(result).toBe('/mock/documents/Mine/projects/test-project/');
      expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled();
    });

    it('should delete project directory', async () => {
      const projectId = 'test-project-123';
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });

      await FileSystemService.deleteProjectDirectory(projectId);

      expect(FileSystem.getInfoAsync).toHaveBeenCalledWith(
        '/mock/documents/Mine/projects/test-project-123/'
      );
      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        '/mock/documents/Mine/projects/test-project-123/',
        { idempotent: true }
      );
    });

    it('should handle non-existent directory deletion', async () => {
      const projectId = 'non-existent-project';
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });

      await FileSystemService.deleteProjectDirectory(projectId);

      expect(FileSystem.deleteAsync).not.toHaveBeenCalled();
    });

    it('should handle directory deletion errors', async () => {
      const projectId = 'test-project';
      const error = new Error('Permission denied');
      (FileSystem.getInfoAsync as jest.Mock).mockRejectedValue(error);

      await expect(FileSystemService.deleteProjectDirectory(projectId)).rejects.toThrow(
        'Project directory deletion failed: Error: Permission denied'
      );
    });
  });

  describe('Path Generation - Relative Paths for Portability', () => {
    it('should generate correct project path', () => {
      const path = FileSystemService.getProjectPath('my-project');
      expect(path).toBe('/mock/documents/Mine/projects/my-project/');
    });

    it('should generate correct video path', () => {
      const path = FileSystemService.getVideoPath('my-project', 'video.mp4');
      expect(path).toBe('/mock/documents/Mine/projects/my-project/videos/video.mp4');
    });

    it('should generate correct thumbnail path', () => {
      const path = FileSystemService.getThumbnailPath('my-project', 'thumb.jpg');
      expect(path).toBe('/mock/documents/Mine/projects/my-project/thumbnails/thumb.jpg');
    });

    it('should generate correct compiled video path', () => {
      const path = FileSystemService.getCompiledPath('my-project', 'timeline.mp4');
      expect(path).toBe('/mock/documents/Mine/projects/my-project/compiled/timeline.mp4');
    });

    it('should generate correct temp file path', () => {
      const path = FileSystemService.getTempPath('temp-file.mp4');
      expect(path).toBe('/mock/documents/Mine/temp/temp-file.mp4');
    });
  });

  describe('Storage Usage Calculation', () => {
    it('should calculate comprehensive storage usage', async () => {
      (FileSystem.getInfoAsync as jest.Mock)
        .mockResolvedValueOnce({ exists: true, isDirectory: true, size: 500000000 }) // base dir
        .mockResolvedValueOnce({ exists: true, isDirectory: true, size: 400000000 }) // projects dir
        .mockResolvedValueOnce({ exists: true, isDirectory: true, size: 50000000 }); // temp dir

      const storageInfo: StorageInfo = await FileSystemService.calculateStorageUsage();

      expect(storageInfo).toEqual({
        totalUsage: 500000000,
        projectsUsage: 400000000,
        tempUsage: 50000000,
        availableSpace: 1000000000
      });

      expect(FileSystem.getFreeDiskStorageAsync).toHaveBeenCalled();
    });

    it('should handle non-existent directories', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });

      const storageInfo = await FileSystemService.calculateStorageUsage();

      expect(storageInfo).toEqual({
        totalUsage: 0,
        projectsUsage: 0,
        tempUsage: 0,
        availableSpace: 1000000000
      });
    });

    it('should return mock data on web platform', async () => {
      (Platform as any).OS = 'web';

      const storageInfo = await FileSystemService.calculateStorageUsage();

      expect(storageInfo).toEqual({
        totalUsage: 0,
        projectsUsage: 0,
        tempUsage: 0,
        availableSpace: 1000000000
      });

      expect(FileSystem.getInfoAsync).not.toHaveBeenCalled();
    });

    it('should handle storage calculation errors', async () => {
      const error = new Error('Storage access failed');
      (FileSystem.getInfoAsync as jest.Mock).mockRejectedValue(error);

      const storageInfo = await FileSystemService.calculateStorageUsage();

      expect(storageInfo).toEqual({
        totalUsage: 0,
        projectsUsage: 0,
        tempUsage: 0,
        availableSpace: 0
      });
    });
  });

  describe('Temporary Files Cleanup', () => {
    it('should cleanup temporary files and recreate directory', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });

      await FileSystemService.cleanupTempFiles();

      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        '/mock/documents/Mine/temp/',
        { idempotent: true }
      );
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        '/mock/documents/Mine/temp/',
        { intermediates: true }
      );
    });

    it('should handle non-existent temp directory', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });

      await FileSystemService.cleanupTempFiles();

      expect(FileSystem.deleteAsync).not.toHaveBeenCalled();
      expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled();
    });

    it('should skip cleanup on web platform', async () => {
      (Platform as any).OS = 'web';

      await FileSystemService.cleanupTempFiles();

      expect(FileSystem.getInfoAsync).not.toHaveBeenCalled();
      expect(FileSystem.deleteAsync).not.toHaveBeenCalled();
    });

    it('should handle cleanup errors', async () => {
      const error = new Error('Cleanup failed');
      (FileSystem.getInfoAsync as jest.Mock).mockRejectedValue(error);

      await expect(FileSystemService.cleanupTempFiles()).rejects.toThrow(
        'Temp files cleanup failed: Error: Cleanup failed'
      );
    });
  });

  describe('File Operations', () => {
    it('should delete existing file', async () => {
      const filePath = '/path/to/file.mp4';
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });

      await FileSystemService.deleteFile(filePath);

      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(filePath, { idempotent: true });
    });

    it('should handle non-existent file deletion', async () => {
      const filePath = '/path/to/nonexistent.mp4';
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });

      await FileSystemService.deleteFile(filePath);

      expect(FileSystem.deleteAsync).not.toHaveBeenCalled();
    });

    it('should handle empty file path', async () => {
      await expect(FileSystemService.deleteFile('')).rejects.toThrow(
        'File path cannot be empty'
      );
    });

    it('should copy file from source to destination', async () => {
      const sourcePath = '/source/file.mp4';
      const destPath = '/dest/file.mp4';

      await FileSystemService.copyFile(sourcePath, destPath);

      expect(FileSystem.copyAsync).toHaveBeenCalledWith({
        from: sourcePath,
        to: destPath
      });
    });

    it('should move file from source to destination', async () => {
      const sourcePath = '/source/file.mp4';
      const destPath = '/dest/file.mp4';

      await FileSystemService.moveFile(sourcePath, destPath);

      expect(FileSystem.moveAsync).toHaveBeenCalledWith({
        from: sourcePath,
        to: destPath
      });
    });

    it('should handle copy/move with empty paths', async () => {
      await expect(FileSystemService.copyFile('', '/dest')).rejects.toThrow(
        'Source path cannot be empty'
      );
      await expect(FileSystemService.copyFile('/source', '')).rejects.toThrow(
        'Destination path cannot be empty'
      );
    });
  });

  describe('File Information', () => {
    it('should get file information', async () => {
      const filePath = '/path/to/file.mp4';
      const mockInfo = {
        exists: true,
        size: 1024000,
        isDirectory: false,
        modificationTime: 1640995200000
      };
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue(mockInfo);

      const fileInfo: FileInfo = await FileSystemService.getFileInfo(filePath);

      expect(fileInfo).toEqual({
        exists: true,
        size: 1024000,
        isDirectory: false,
        modificationTime: 1640995200000
      });
    });

    it('should handle missing file info properties', async () => {
      const filePath = '/path/to/file.mp4';
      const mockInfo = { exists: true }; // Missing optional properties
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue(mockInfo);

      const fileInfo = await FileSystemService.getFileInfo(filePath);

      expect(fileInfo).toEqual({
        exists: true,
        size: 0,
        isDirectory: false,
        modificationTime: expect.any(Number)
      });
    });

    it('should return mock data on web platform', async () => {
      (Platform as any).OS = 'web';

      const fileInfo = await FileSystemService.getFileInfo('/any/path');

      expect(fileInfo).toEqual({
        exists: false,
        size: 0,
        isDirectory: false,
        modificationTime: expect.any(Number)
      });

      expect(FileSystem.getInfoAsync).not.toHaveBeenCalled();
    });

    it('should handle file info errors', async () => {
      const error = new Error('Access denied');
      (FileSystem.getInfoAsync as jest.Mock).mockRejectedValue(error);

      const fileInfo = await FileSystemService.getFileInfo('/path/to/file');

      expect(fileInfo).toEqual({
        exists: false,
        size: 0,
        isDirectory: false,
        modificationTime: expect.any(Number)
      });
    });
  });

  describe('Directory Management', () => {
    it('should ensure directory exists', async () => {
      const dirPath = '/path/to/directory';
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });

      await FileSystemService.ensureDirectoryExists(dirPath);

      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(dirPath, { intermediates: true });
    });

    it('should not create directory if it already exists', async () => {
      const dirPath = '/path/to/existing/directory';
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });

      await FileSystemService.ensureDirectoryExists(dirPath);

      expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled();
    });

    it('should list directory contents', async () => {
      const dirPath = '/path/to/directory';
      const mockFiles = ['file1.mp4', 'file2.jpg', 'subdirectory'];
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true, isDirectory: true });
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValue(mockFiles);

      const files = await FileSystemService.listDirectory(dirPath);

      expect(files).toEqual(mockFiles);
      expect(FileSystem.readDirectoryAsync).toHaveBeenCalledWith(dirPath);
    });

    it('should return empty array for non-existent directory', async () => {
      const dirPath = '/path/to/nonexistent';
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });

      const files = await FileSystemService.listDirectory(dirPath);

      expect(files).toEqual([]);
      expect(FileSystem.readDirectoryAsync).not.toHaveBeenCalled();
    });

    it('should calculate directory size recursively', async () => {
      const dirPath = '/path/to/directory';
      const mockFiles = ['file1.mp4', 'file2.jpg', 'subdirectory'];
      
      (FileSystem.getInfoAsync as jest.Mock)
        .mockResolvedValueOnce({ exists: true, isDirectory: true }) // main directory
        .mockResolvedValueOnce({ exists: true, isDirectory: false, size: 1000000 }) // file1.mp4
        .mockResolvedValueOnce({ exists: true, isDirectory: false, size: 500000 }) // file2.jpg
        .mockResolvedValueOnce({ exists: true, isDirectory: true }); // subdirectory

      (FileSystem.readDirectoryAsync as jest.Mock)
        .mockResolvedValueOnce(mockFiles) // main directory contents
        .mockResolvedValueOnce([]); // subdirectory contents (empty)

      const size = await FileSystemService.calculateDirectorySize(dirPath);

      expect(size).toBe(1500000); // 1MB + 500KB
    });

    it('should return 0 for empty directory path', async () => {
      const size = await FileSystemService.calculateDirectorySize('');
      expect(size).toBe(0);
    });

    it('should return file size for non-directory', async () => {
      const filePath = '/path/to/file.mp4';
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ 
        exists: true, 
        isDirectory: false, 
        size: 2000000 
      });

      const size = await FileSystemService.calculateDirectorySize(filePath);

      expect(size).toBe(2000000);
    });
  });

  describe('Error Handling', () => {
    it('should handle file system errors gracefully', async () => {
      const error = new Error('File system error');
      (FileSystem.makeDirectoryAsync as jest.Mock).mockRejectedValue(error);

      await expect(FileSystemService.createProjectDirectory('test')).rejects.toThrow(
        'Project directory creation failed: Error: File system error'
      );
    });

    it('should handle copy operation errors', async () => {
      const error = new Error('Copy failed');
      (FileSystem.copyAsync as jest.Mock).mockRejectedValue(error);

      await expect(FileSystemService.copyFile('/source', '/dest')).rejects.toThrow(
        'File copy failed: Error: Copy failed'
      );
    });

    it('should handle move operation errors', async () => {
      const error = new Error('Move failed');
      (FileSystem.moveAsync as jest.Mock).mockRejectedValue(error);

      await expect(FileSystemService.moveFile('/source', '/dest')).rejects.toThrow(
        'File move failed: Error: Move failed'
      );
    });

    it('should handle directory creation errors', async () => {
      const error = new Error('Directory creation failed');
      (FileSystem.makeDirectoryAsync as jest.Mock).mockRejectedValue(error);

      await expect(FileSystemService.ensureDirectoryExists('/path')).rejects.toThrow(
        'Directory creation failed: Error: Directory creation failed'
      );
    });
  });
});