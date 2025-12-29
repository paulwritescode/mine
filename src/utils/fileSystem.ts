import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export class FileSystemManager {
  private static readonly BASE_DIR = `${FileSystem.documentDirectory}Mine/`;
  private static readonly PROJECTS_DIR = `${FileSystemManager.BASE_DIR}projects/`;
  private static readonly TEMP_DIR = `${FileSystemManager.BASE_DIR}temp/`;

  public static async initializeDirectories(): Promise<void> {
    try {
      // Skip file system operations on web
      if (Platform.OS === 'web') {
        console.log('File system initialization skipped on web platform');
        return;
      }
      
      // Create base Mine directory
      await FileSystem.makeDirectoryAsync(FileSystemManager.BASE_DIR, { intermediates: true });
      
      // Create projects directory
      await FileSystem.makeDirectoryAsync(FileSystemManager.PROJECTS_DIR, { intermediates: true });
      
      // Create temp directory
      await FileSystem.makeDirectoryAsync(FileSystemManager.TEMP_DIR, { intermediates: true });
      
      console.log('File system directories initialized successfully');
    } catch (error) {
      console.error('Failed to initialize directories:', error);
      throw error;
    }
  }

  public static async createProjectDirectory(projectId: string): Promise<string> {
    const projectDir = `${FileSystemManager.PROJECTS_DIR}${projectId}/`;
    const videosDir = `${projectDir}videos/`;
    const thumbnailsDir = `${projectDir}thumbnails/`;
    const compiledDir = `${projectDir}compiled/`;

    try {
      await FileSystem.makeDirectoryAsync(projectDir, { intermediates: true });
      await FileSystem.makeDirectoryAsync(videosDir, { intermediates: true });
      await FileSystem.makeDirectoryAsync(thumbnailsDir, { intermediates: true });
      await FileSystem.makeDirectoryAsync(compiledDir, { intermediates: true });
      
      return projectDir;
    } catch (error) {
      console.error(`Failed to create project directory for ${projectId}:`, error);
      throw error;
    }
  }

  public static async deleteProjectDirectory(projectId: string): Promise<void> {
    const projectDir = `${FileSystemManager.PROJECTS_DIR}${projectId}/`;
    
    try {
      const dirInfo = await FileSystem.getInfoAsync(projectDir);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(projectDir, { idempotent: true });
      }
    } catch (error) {
      console.error(`Failed to delete project directory for ${projectId}:`, error);
      throw error;
    }
  }

  public static getProjectPath(projectId: string): string {
    return `${FileSystemManager.PROJECTS_DIR}${projectId}/`;
  }

  public static getVideoPath(projectId: string, filename: string): string {
    return `${FileSystemManager.PROJECTS_DIR}${projectId}/videos/${filename}`;
  }

  public static getThumbnailPath(projectId: string, filename: string): string {
    return `${FileSystemManager.PROJECTS_DIR}${projectId}/thumbnails/${filename}`;
  }

  public static getCompiledPath(projectId: string, filename: string): string {
    return `${FileSystemManager.PROJECTS_DIR}${projectId}/compiled/${filename}`;
  }

  public static getTempPath(filename: string): string {
    return `${FileSystemManager.TEMP_DIR}${filename}`;
  }

  public static async calculateStorageUsage(): Promise<number> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(FileSystemManager.BASE_DIR);
      return dirInfo.exists && dirInfo.isDirectory ? dirInfo.size || 0 : 0;
    } catch (error) {
      console.error('Failed to calculate storage usage:', error);
      return 0;
    }
  }

  public static async cleanupTempFiles(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(FileSystemManager.TEMP_DIR);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(FileSystemManager.TEMP_DIR, { idempotent: true });
        await FileSystem.makeDirectoryAsync(FileSystemManager.TEMP_DIR, { intermediates: true });
      }
    } catch (error) {
      console.error('Failed to cleanup temp files:', error);
      throw error;
    }
  }

  public static async deleteFile(filePath: string): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(filePath, { idempotent: true });
      }
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error);
      throw error;
    }
  }
}