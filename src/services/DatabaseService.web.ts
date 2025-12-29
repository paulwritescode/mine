import { FileSystemManager } from '../utils/fileSystem';

export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      // Initialize file system directories first
      await FileSystemManager.initializeDirectories();
      
      console.log('Web database service initialized (SQLite disabled)');
    } catch (error) {
      console.error('Failed to initialize web database service:', error);
      throw error;
    }
  }

  public getDatabase(): any {
    throw new Error('SQLite not available on web platform');
  }

  public async close(): Promise<void> {
    // No-op for web
  }
}

export const databaseService = DatabaseService.getInstance();