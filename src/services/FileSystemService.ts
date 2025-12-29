import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export interface StorageInfo {
  totalUsage: number;
  projectsUsage: number;
  tempUsage: number;
  availableSpace: number;
}

export interface FileInfo {
  exists: boolean;
  size: number;
  isDirectory: boolean;
  modificationTime: number;
}

export class FileSystemService {
  private static readonly BASE_DIR = `${FileSystem.documentDirectory}Mine/`;
  private static readonly PROJECTS_DIR = `${FileSystemService.BASE_DIR}projects/`;
  private static readonly TEMP_DIR = `${FileSystemService.BASE_DIR}temp/`;

  /**
   * Initialize the Mine app directory structure
   * Requirements: 4.1 - Store all video files in device Documents directory
   */
  public static async initializeDirectories(): Promise<void> {
    try {
      // Skip file system operations on web platform
      if (Platform.OS === 'web') {
        console.log('File system initialization skipped on web platform');
        return;
      }
      
      // Create base Mine directory
      await FileSystem.makeDirectoryAsync(FileSystemService.BASE_DIR, { intermediates: true });
      
      // Create projects directory
      await FileSystem.makeDirectoryAsync(FileSystemService.PROJECTS_DIR, { intermediates: true });
      
      // Create temp directory
      await FileSystem.makeDirectoryAsync(FileSystemService.TEMP_DIR, { intermediates: true });
      
      console.log('File system directories initialized successfully');
    } catch (error) {
      console.error('Failed to initialize directories:', error);
      throw new Error(`Directory initialization failed: ${error}`);
    }
  }

  /**
   * Create directory structure for a new project
   * Requirements: 4.1 - Organize video files by project
   */
  public static async createProjectDirectory(projectId: string): Promise<string> {
    if (!projectId || projectId.trim() === '') {
      throw new Error('Project ID cannot be empty');
    }

    const projectDir = FileSystemService.getProjectPath(projectId);
    const videosDir = `${projectDir}videos/`;
    const thumbnailsDir = `${projectDir}thumbnails/`;
    const compiledDir = `${projectDir}compiled/`;

    try {
      // Skip file system operations on web platform
      if (Platform.OS === 'web') {
        console.log(`Project directory creation skipped on web platform for ${projectId}`);
        return projectDir;
      }

      await FileSystem.makeDirectoryAsync(projectDir, { intermediates: true });
      await FileSystem.makeDirectoryAsync(videosDir, { intermediates: true });
      await FileSystem.makeDirectoryAsync(thumbnailsDir, { intermediates: true });
      await FileSystem.makeDirectoryAsync(compiledDir, { intermediates: true });
      
      return projectDir;
    } catch (error) {
      console.error(`Failed to create project directory for ${projectId}:`, error);
      throw new Error(`Project directory creation failed: ${error}`);
    }
  }

  /**
   * Delete project directory and all associated files
   * Requirements: 4.7 - Cleanup utilities for file management
   */
  public static async deleteProjectDirectory(projectId: string): Promise<void> {
    if (!projectId || projectId.trim() === '') {
      throw new Error('Project ID cannot be empty');
    }

    const projectDir = FileSystemService.getProjectPath(projectId);
    
    try {
      // Skip file system operations on web platform
      if (Platform.OS === 'web') {
        console.log(`Project directory deletion skipped on web platform for ${projectId}`);
        return;
      }

      const dirInfo = await FileSystem.getInfoAsync(projectDir);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(projectDir, { idempotent: true });
        console.log(`Deleted project directory: ${projectDir}`);
      }
    } catch (error) {
      console.error(`Failed to delete project directory for ${projectId}:`, error);
      throw new Error(`Project directory deletion failed: ${error}`);
    }
  }

  /**
   * Get relative path for project directory
   * Requirements: 4.3 - Use relative file paths for portability
   */
  public static getProjectPath(projectId: string): string {
    return `${FileSystemService.PROJECTS_DIR}${projectId}/`;
  }

  /**
   * Get relative path for video file
   * Requirements: 4.3 - Use relative file paths for portability
   */
  public static getVideoPath(projectId: string, filename: string): string {
    return `${FileSystemService.PROJECTS_DIR}${projectId}/videos/${filename}`;
  }

  /**
   * Get relative path for thumbnail file
   * Requirements: 4.3 - Use relative file paths for portability
   */
  public static getThumbnailPath(projectId: string, filename: string): string {
    return `${FileSystemService.PROJECTS_DIR}${projectId}/thumbnails/${filename}`;
  }

  /**
   * Get relative path for compiled video file
   * Requirements: 4.3 - Use relative file paths for portability
   */
  public static getCompiledPath(projectId: string, filename: string): string {
    return `${FileSystemService.PROJECTS_DIR}${projectId}/compiled/${filename}`;
  }

  /**
   * Get relative path for temporary file
   * Requirements: 4.3 - Use relative file paths for portability
   */
  public static getTempPath(filename: string): string {
    return `${FileSystemService.TEMP_DIR}${filename}`;
  }

  /**
   * Calculate comprehensive storage usage information
   * Requirements: 4.6 - Display current storage usage
   */
  public static async calculateStorageUsage(): Promise<StorageInfo> {
    try {
      // Return mock data for web platform
      if (Platform.OS === 'web') {
        return {
          totalUsage: 0,
          projectsUsage: 0,
          tempUsage: 0,
          availableSpace: 1000000000 // 1GB mock available space
        };
      }

      const [baseInfo, projectsInfo, tempInfo, freeSpace] = await Promise.all([
        FileSystem.getInfoAsync(FileSystemService.BASE_DIR),
        FileSystem.getInfoAsync(FileSystemService.PROJECTS_DIR),
        FileSystem.getInfoAsync(FileSystemService.TEMP_DIR),
        FileSystem.getFreeDiskStorageAsync()
      ]);

      const totalUsage = baseInfo.exists && baseInfo.isDirectory ? (baseInfo.size || 0) : 0;
      const projectsUsage = projectsInfo.exists && projectsInfo.isDirectory ? (projectsInfo.size || 0) : 0;
      const tempUsage = tempInfo.exists && tempInfo.isDirectory ? (tempInfo.size || 0) : 0;

      return {
        totalUsage,
        projectsUsage,
        tempUsage,
        availableSpace: freeSpace
      };
    } catch (error) {
      console.error('Failed to calculate storage usage:', error);
      // Return default values on error
      return {
        totalUsage: 0,
        projectsUsage: 0,
        tempUsage: 0,
        availableSpace: 0
      };
    }
  }

  /**
   * Clean up temporary files and cache
   * Requirements: 4.7 - Provide option to clear temporary files and cache
   */
  public static async cleanupTempFiles(): Promise<void> {
    try {
      // Skip file system operations on web platform
      if (Platform.OS === 'web') {
        console.log('Temp files cleanup skipped on web platform');
        return;
      }

      const dirInfo = await FileSystem.getInfoAsync(FileSystemService.TEMP_DIR);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(FileSystemService.TEMP_DIR, { idempotent: true });
        await FileSystem.makeDirectoryAsync(FileSystemService.TEMP_DIR, { intermediates: true });
        console.log('Temporary files cleaned up successfully');
      }
    } catch (error) {
      console.error('Failed to cleanup temp files:', error);
      throw new Error(`Temp files cleanup failed: ${error}`);
    }
  }

  /**
   * Delete a specific file
   * Requirements: 4.7 - File management utilities
   */
  public static async deleteFile(filePath: string): Promise<void> {
    if (!filePath || filePath.trim() === '') {
      throw new Error('File path cannot be empty');
    }

    try {
      // Skip file system operations on web platform
      if (Platform.OS === 'web') {
        console.log(`File deletion skipped on web platform for ${filePath}`);
        return;
      }

      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(filePath, { idempotent: true });
        console.log(`Deleted file: ${filePath}`);
      }
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error);
      throw new Error(`File deletion failed: ${error}`);
    }
  }

  /**
   * Get file information
   * Requirements: 4.6, 4.7 - File management and storage monitoring
   */
  public static async getFileInfo(filePath: string): Promise<FileInfo> {
    if (!filePath || filePath.trim() === '') {
      throw new Error('File path cannot be empty');
    }

    try {
      // Return mock data for web platform
      if (Platform.OS === 'web') {
        return {
          exists: false,
          size: 0,
          isDirectory: false,
          modificationTime: Date.now()
        };
      }

      const info = await FileSystem.getInfoAsync(filePath);
      return {
        exists: info.exists,
        size: (info as any).size || 0,
        isDirectory: info.isDirectory || false,
        modificationTime: (info as any).modificationTime || Date.now()
      };
    } catch (error) {
      console.error(`Failed to get file info for ${filePath}:`, error);
      return {
        exists: false,
        size: 0,
        isDirectory: false,
        modificationTime: Date.now()
      };
    }
  }

  /**
   * Copy file from source to destination
   * Requirements: 4.1, 4.3 - File operations with relative paths
   */
  public static async copyFile(sourcePath: string, destinationPath: string): Promise<void> {
    if (!sourcePath || sourcePath.trim() === '') {
      throw new Error('Source path cannot be empty');
    }
    if (!destinationPath || destinationPath.trim() === '') {
      throw new Error('Destination path cannot be empty');
    }

    try {
      // Skip file system operations on web platform
      if (Platform.OS === 'web') {
        console.log(`File copy skipped on web platform from ${sourcePath} to ${destinationPath}`);
        return;
      }

      await FileSystem.copyAsync({
        from: sourcePath,
        to: destinationPath
      });
      console.log(`Copied file from ${sourcePath} to ${destinationPath}`);
    } catch (error) {
      console.error(`Failed to copy file from ${sourcePath} to ${destinationPath}:`, error);
      throw new Error(`File copy failed: ${error}`);
    }
  }

  /**
   * Move file from source to destination
   * Requirements: 4.1, 4.3 - File operations with relative paths
   */
  public static async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    if (!sourcePath || sourcePath.trim() === '') {
      throw new Error('Source path cannot be empty');
    }
    if (!destinationPath || destinationPath.trim() === '') {
      throw new Error('Destination path cannot be empty');
    }

    try {
      // Skip file system operations on web platform
      if (Platform.OS === 'web') {
        console.log(`File move skipped on web platform from ${sourcePath} to ${destinationPath}`);
        return;
      }

      await FileSystem.moveAsync({
        from: sourcePath,
        to: destinationPath
      });
      console.log(`Moved file from ${sourcePath} to ${destinationPath}`);
    } catch (error) {
      console.error(`Failed to move file from ${sourcePath} to ${destinationPath}:`, error);
      throw new Error(`File move failed: ${error}`);
    }
  }

  /**
   * Ensure directory exists, create if it doesn't
   * Requirements: 4.1 - Directory management
   */
  public static async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!dirPath || dirPath.trim() === '') {
      throw new Error('Directory path cannot be empty');
    }

    try {
      // Skip file system operations on web platform
      if (Platform.OS === 'web') {
        console.log(`Directory creation skipped on web platform for ${dirPath}`);
        return;
      }

      const dirInfo = await FileSystem.getInfoAsync(dirPath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
        console.log(`Created directory: ${dirPath}`);
      }
    } catch (error) {
      console.error(`Failed to ensure directory exists ${dirPath}:`, error);
      throw new Error(`Directory creation failed: ${error}`);
    }
  }

  /**
   * Get list of files in a directory
   * Requirements: 4.6, 4.7 - File management and storage monitoring
   */
  public static async listDirectory(dirPath: string): Promise<string[]> {
    if (!dirPath || dirPath.trim() === '') {
      throw new Error('Directory path cannot be empty');
    }

    try {
      // Return empty array for web platform
      if (Platform.OS === 'web') {
        console.log(`Directory listing skipped on web platform for ${dirPath}`);
        return [];
      }

      const dirInfo = await FileSystem.getInfoAsync(dirPath);
      if (!dirInfo.exists || !dirInfo.isDirectory) {
        return [];
      }

      const files = await FileSystem.readDirectoryAsync(dirPath);
      return files;
    } catch (error) {
      console.error(`Failed to list directory ${dirPath}:`, error);
      return [];
    }
  }

  /**
   * Calculate directory size recursively
   * Requirements: 4.6 - Storage usage calculation
   */
  public static async calculateDirectorySize(dirPath: string): Promise<number> {
    if (!dirPath || dirPath.trim() === '') {
      return 0;
    }

    try {
      // Return 0 for web platform
      if (Platform.OS === 'web') {
        return 0;
      }

      const dirInfo = await FileSystem.getInfoAsync(dirPath);
      if (!dirInfo.exists) {
        return 0;
      }

      if (!dirInfo.isDirectory) {
        return (dirInfo as any).size || 0;
      }

      const files = await FileSystem.readDirectoryAsync(dirPath);
      let totalSize = 0;

      for (const file of files) {
        const filePath = `${dirPath}/${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        
        if (fileInfo.isDirectory) {
          totalSize += await FileSystemService.calculateDirectorySize(filePath);
        } else {
          totalSize += (fileInfo as any).size || 0;
        }
      }

      return totalSize;
    } catch (error) {
      console.error(`Failed to calculate directory size for ${dirPath}:`, error);
      return 0;
    }
  }
}