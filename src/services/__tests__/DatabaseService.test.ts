import { DatabaseService } from '../DatabaseService';
import { connectionManager } from '../DatabaseConnectionManager';
import * as SQLite from 'expo-sqlite';

// Mock the connection manager
jest.mock('../DatabaseConnectionManager', () => ({
  connectionManager: {
    getConnection: jest.fn(),
    executeQuery: jest.fn(),
    executeQueries: jest.fn(),
    executeStatement: jest.fn(),
    executeRaw: jest.fn(),
    executeTransaction: jest.fn(),
    disconnect: jest.fn(),
  },
}));

// Mock FileSystemManager
jest.mock('../../utils/fileSystem', () => ({
  FileSystemManager: {
    initializeDirectories: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('DatabaseService', () => {
  let databaseService: DatabaseService;
  let mockDb: jest.Mocked<SQLite.SQLiteDatabase>;

  beforeEach(() => {
    databaseService = DatabaseService.getInstance();
    
    // Create mock database
    mockDb = {
      execAsync: jest.fn().mockResolvedValue(undefined),
      runAsync: jest.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 1 }),
      getAllAsync: jest.fn().mockResolvedValue([]),
      getFirstAsync: jest.fn().mockResolvedValue(null),
      closeAsync: jest.fn().mockResolvedValue(undefined),
    } as any;

    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (connectionManager.getConnection as jest.Mock).mockResolvedValue(mockDb);
    (connectionManager.executeQuery as jest.Mock).mockResolvedValue({ version: 0 });
    (connectionManager.executeQueries as jest.Mock).mockResolvedValue([]);
    (connectionManager.executeRaw as jest.Mock).mockResolvedValue(undefined);
    (connectionManager.executeTransaction as jest.Mock).mockImplementation(async (callback) => {
      return await callback(mockDb);
    });
  });

  describe('initialization', () => {
    it('should initialize successfully on native platforms', async () => {
      // Mock Platform.OS to be 'ios'
      jest.doMock('react-native', () => ({
        Platform: { OS: 'ios' },
      }));

      await databaseService.initialize();

      expect(connectionManager.getConnection).toHaveBeenCalled();
      expect(connectionManager.executeRaw).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS schema_migrations')
      );
    });

    it('should initialize successfully on web platform', async () => {
      // Mock Platform.OS to be 'web'
      jest.doMock('react-native', () => ({
        Platform: { OS: 'web' },
      }));

      await databaseService.initialize();

      // Should not call database operations on web
      expect(connectionManager.getConnection).not.toHaveBeenCalled();
    });

    it('should handle initialization errors gracefully', async () => {
      const error = new Error('Database connection failed');
      (connectionManager.getConnection as jest.Mock).mockRejectedValue(error);

      await expect(databaseService.initialize()).rejects.toThrow('Database connection failed');
    });
  });

  describe('migrations', () => {
    beforeEach(async () => {
      // Initialize the service first
      await databaseService.initialize();
    });

    it('should run initial migration when database is empty', async () => {
      // Mock empty database (version 0)
      (connectionManager.executeQuery as jest.Mock).mockResolvedValue({ version: 0 });

      await databaseService.initialize();

      // Should create schema_migrations table
      expect(connectionManager.executeRaw).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS schema_migrations')
      );

      // Should run the initial migration
      expect(connectionManager.executeTransaction).toHaveBeenCalled();
    });

    it('should skip migrations when database is up to date', async () => {
      // Mock current database version
      (connectionManager.executeQuery as jest.Mock).mockResolvedValue({ version: 1 });

      await databaseService.initialize();

      // Should still create schema_migrations table but not run migrations
      expect(connectionManager.executeRaw).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS schema_migrations')
      );
    });

    it('should get current database version', async () => {
      const mockVersion = 1;
      (connectionManager.executeQuery as jest.Mock).mockResolvedValue({ version: mockVersion });

      const version = await databaseService.getDatabaseVersion();

      expect(version).toBe(mockVersion);
      expect(connectionManager.executeQuery).toHaveBeenCalledWith(
        'SELECT MAX(version) as version FROM schema_migrations;'
      );
    });

    it('should return migration history', async () => {
      const mockHistory = [
        { version: 1, name: 'initial_schema', applied_at: 1640995200000 }
      ];
      (connectionManager.executeQueries as jest.Mock).mockResolvedValue(mockHistory);

      const history = await databaseService.getMigrationHistory();

      expect(history).toEqual(mockHistory);
      expect(connectionManager.executeQueries).toHaveBeenCalledWith(
        'SELECT version, name, applied_at FROM schema_migrations ORDER BY version;'
      );
    });
  });

  describe('rollback functionality', () => {
    beforeEach(async () => {
      await databaseService.initialize();
    });

    it('should skip rollback when target version is current or higher', async () => {
      (connectionManager.executeQuery as jest.Mock).mockResolvedValue({ version: 1 });

      await databaseService.rollbackMigration(1);

      // Should not execute any rollback transactions
      expect(connectionManager.executeTransaction).not.toHaveBeenCalled();
    });

    it('should throw error for migrations without rollback support', async () => {
      (connectionManager.executeQuery as jest.Mock).mockResolvedValue({ version: 1 });

      // The initial migration doesn't have a down method in our implementation
      // This test verifies the error handling for unsupported rollbacks
      await expect(databaseService.rollbackMigration(0)).rejects.toThrow(
        'Migration 1 does not support rollback'
      );
    });
  });

  describe('database integrity', () => {
    beforeEach(async () => {
      await databaseService.initialize();
    });

    it('should validate database integrity successfully', async () => {
      (connectionManager.executeQuery as jest.Mock).mockResolvedValue({ integrity_check: 'ok' });
      (connectionManager.executeQueries as jest.Mock).mockResolvedValue([]);

      const isValid = await databaseService.validateDatabaseIntegrity();

      expect(isValid).toBe(true);
      expect(connectionManager.executeQuery).toHaveBeenCalledWith('PRAGMA integrity_check;');
      expect(connectionManager.executeQueries).toHaveBeenCalledWith('PRAGMA foreign_key_check;');
    });

    it('should detect integrity check failures', async () => {
      (connectionManager.executeQuery as jest.Mock).mockResolvedValue({ integrity_check: 'corrupt' });

      const isValid = await databaseService.validateDatabaseIntegrity();

      expect(isValid).toBe(false);
    });

    it('should detect foreign key constraint violations', async () => {
      (connectionManager.executeQuery as jest.Mock).mockResolvedValue({ integrity_check: 'ok' });
      (connectionManager.executeQueries as jest.Mock).mockResolvedValue([
        { table: 'snippets', rowid: 1, parent: 'projects', fkid: 0 }
      ]);

      const isValid = await databaseService.validateDatabaseIntegrity();

      expect(isValid).toBe(false);
    });

    it('should handle integrity validation errors', async () => {
      const error = new Error('Database error');
      (connectionManager.executeQuery as jest.Mock).mockRejectedValue(error);

      const isValid = await databaseService.validateDatabaseIntegrity();

      expect(isValid).toBe(false);
    });
  });

  describe('database connection management', () => {
    it('should throw error when getting database on web platform', () => {
      // Mock Platform.OS to be 'web'
      jest.doMock('react-native', () => ({
        Platform: { OS: 'web' },
      }));

      expect(() => databaseService.getDatabase()).toThrow('SQLite not available on web platform');
    });

    it('should throw error when database not initialized', () => {
      // Create a fresh instance that hasn't been initialized
      const freshService = DatabaseService.getInstance();
      
      expect(() => freshService.getDatabase()).toThrow('Database not initialized. Call initialize() first.');
    });

    it('should close database connection properly', async () => {
      await databaseService.initialize();
      await databaseService.close();

      expect(connectionManager.disconnect).toHaveBeenCalled();
    });
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = DatabaseService.getInstance();
      const instance2 = DatabaseService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });
});