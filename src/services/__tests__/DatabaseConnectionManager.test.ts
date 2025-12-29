import { DatabaseConnectionManager } from '../DatabaseConnectionManager';
import * as SQLite from 'expo-sqlite';

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

// Mock Platform
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

describe('DatabaseConnectionManager', () => {
  let connectionManager: DatabaseConnectionManager;
  let mockDb: jest.Mocked<SQLite.SQLiteDatabase>;

  beforeEach(() => {
    connectionManager = DatabaseConnectionManager.getInstance();
    
    // Create mock database
    mockDb = {
      execAsync: jest.fn().mockResolvedValue(undefined),
      runAsync: jest.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 1 }),
      getAllAsync: jest.fn().mockResolvedValue([]),
      getFirstAsync: jest.fn().mockResolvedValue({ test: 1 }),
      closeAsync: jest.fn().mockResolvedValue(undefined),
    } as any;

    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup default mock implementation
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);
  });

  afterEach(async () => {
    await connectionManager.disconnect();
  });

  describe('connection management', () => {
    it('should create a new database connection successfully', async () => {
      const db = await connectionManager.getConnection();

      expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith('mine.db');
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith('SELECT 1 as test;');
      expect(db).toBe(mockDb);
    });

    it('should reuse existing connection', async () => {
      const db1 = await connectionManager.getConnection();
      const db2 = await connectionManager.getConnection();

      expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(1);
      expect(db1).toBe(db2);
    });

    it('should throw error on web platform', async () => {
      // Mock Platform.OS to be 'web'
      jest.doMock('react-native', () => ({
        Platform: { OS: 'web' },
      }));

      await expect(connectionManager.getConnection()).rejects.toThrow(
        'SQLite not available on web platform'
      );
    });

    it('should retry connection on failure', async () => {
      const error = new Error('Connection failed');
      (SQLite.openDatabaseAsync as jest.Mock)
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(mockDb);

      const db = await connectionManager.getConnection();

      expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(3);
      expect(db).toBe(mockDb);
    });

    it('should fail after max retries', async () => {
      const error = new Error('Connection failed');
      (SQLite.openDatabaseAsync as jest.Mock).mockRejectedValue(error);

      await expect(connectionManager.getConnection()).rejects.toThrow(
        'Failed to connect to database after 3 attempts'
      );

      expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(3);
    });
  });

  describe('query execution', () => {
    beforeEach(async () => {
      await connectionManager.getConnection();
    });

    it('should execute single query successfully', async () => {
      const mockResult = { id: 1, name: 'test' };
      mockDb.getFirstAsync.mockResolvedValue(mockResult);

      const result = await connectionManager.executeQuery('SELECT * FROM test WHERE id = ?', [1]);

      expect(mockDb.getFirstAsync).toHaveBeenCalledWith('SELECT * FROM test WHERE id = ?', [1]);
      expect(result).toBe(mockResult);
    });

    it('should execute multiple queries successfully', async () => {
      const mockResults = [{ id: 1 }, { id: 2 }];
      mockDb.getAllAsync.mockResolvedValue(mockResults);

      const results = await connectionManager.executeQueries('SELECT * FROM test');

      expect(mockDb.getAllAsync).toHaveBeenCalledWith('SELECT * FROM test');
      expect(results).toBe(mockResults);
    });

    it('should execute statements successfully', async () => {
      const mockResult = { changes: 1, lastInsertRowId: 1 };
      mockDb.runAsync.mockResolvedValue(mockResult);

      const result = await connectionManager.executeStatement('INSERT INTO test (name) VALUES (?)', ['test']);

      expect(mockDb.runAsync).toHaveBeenCalledWith('INSERT INTO test (name) VALUES (?)', ['test']);
      expect(result).toBe(mockResult);
    });

    it('should execute raw SQL successfully', async () => {
      await connectionManager.executeRaw('CREATE TABLE test (id INTEGER PRIMARY KEY)');

      expect(mockDb.execAsync).toHaveBeenCalledWith('CREATE TABLE test (id INTEGER PRIMARY KEY)');
    });
  });

  describe('transaction management', () => {
    beforeEach(async () => {
      await connectionManager.getConnection();
    });

    it('should execute transaction successfully', async () => {
      const callback = jest.fn().mockResolvedValue('success');

      const result = await connectionManager.executeTransaction(callback);

      expect(mockDb.execAsync).toHaveBeenCalledWith('BEGIN TRANSACTION;');
      expect(callback).toHaveBeenCalledWith(mockDb);
      expect(mockDb.execAsync).toHaveBeenCalledWith('COMMIT;');
      expect(result).toBe('success');
    });

    it('should rollback transaction on error', async () => {
      const error = new Error('Transaction failed');
      const callback = jest.fn().mockRejectedValue(error);

      await expect(connectionManager.executeTransaction(callback)).rejects.toThrow('Transaction failed');

      expect(mockDb.execAsync).toHaveBeenCalledWith('BEGIN TRANSACTION;');
      expect(callback).toHaveBeenCalledWith(mockDb);
      expect(mockDb.execAsync).toHaveBeenCalledWith('ROLLBACK;');
    });

    it('should handle rollback errors gracefully', async () => {
      const transactionError = new Error('Transaction failed');
      const rollbackError = new Error('Rollback failed');
      const callback = jest.fn().mockRejectedValue(transactionError);
      
      mockDb.execAsync.mockImplementation((sql) => {
        if (sql === 'ROLLBACK;') {
          return Promise.reject(rollbackError);
        }
        return Promise.resolve();
      });

      await expect(connectionManager.executeTransaction(callback)).rejects.toThrow('Transaction failed');
    });
  });

  describe('health monitoring', () => {
    it('should return true for healthy connection', async () => {
      await connectionManager.getConnection();
      mockDb.getFirstAsync.mockResolvedValue({ test: 1 });

      const isHealthy = await connectionManager.isHealthy();

      expect(isHealthy).toBe(true);
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith('SELECT 1 as test;');
    });

    it('should return false for unhealthy connection', async () => {
      await connectionManager.getConnection();
      mockDb.getFirstAsync.mockRejectedValue(new Error('Connection lost'));

      const isHealthy = await connectionManager.isHealthy();

      expect(isHealthy).toBe(false);
    });

    it('should return false when not connected', async () => {
      const isHealthy = await connectionManager.isHealthy();

      expect(isHealthy).toBe(false);
    });
  });

  describe('database statistics', () => {
    beforeEach(async () => {
      await connectionManager.getConnection();
    });

    it('should get database statistics', async () => {
      mockDb.getFirstAsync
        .mockResolvedValueOnce({ page_count: 100 })
        .mockResolvedValueOnce({ page_size: 4096 })
        .mockResolvedValueOnce({ freelist_count: 5 });

      const stats = await connectionManager.getStats();

      expect(stats).toEqual({
        pageCount: 100,
        pageSize: 4096,
        freePages: 5,
        totalSize: 409600
      });
    });

    it('should handle missing statistics gracefully', async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);

      const stats = await connectionManager.getStats();

      expect(stats).toEqual({
        pageCount: 0,
        pageSize: 0,
        freePages: 0,
        totalSize: 0
      });
    });
  });

  describe('database optimization', () => {
    beforeEach(async () => {
      await connectionManager.getConnection();
    });

    it('should optimize database successfully', async () => {
      await connectionManager.optimize();

      expect(mockDb.execAsync).toHaveBeenCalledWith('ANALYZE;');
      expect(mockDb.execAsync).toHaveBeenCalledWith('VACUUM;');
      expect(mockDb.execAsync).toHaveBeenCalledWith('PRAGMA optimize;');
    });

    it('should handle optimization errors', async () => {
      const error = new Error('Optimization failed');
      mockDb.execAsync.mockRejectedValue(error);

      await expect(connectionManager.optimize()).rejects.toThrow('Optimization failed');
    });
  });

  describe('connection cleanup', () => {
    it('should disconnect properly', async () => {
      await connectionManager.getConnection();
      await connectionManager.disconnect();

      expect(mockDb.closeAsync).toHaveBeenCalled();
    });

    it('should handle disconnect errors gracefully', async () => {
      await connectionManager.getConnection();
      mockDb.closeAsync.mockRejectedValue(new Error('Close failed'));

      // Should not throw
      await connectionManager.disconnect();

      expect(mockDb.closeAsync).toHaveBeenCalled();
    });
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = DatabaseConnectionManager.getInstance();
      const instance2 = DatabaseConnectionManager.getInstance();

      expect(instance1).toBe(instance2);
    });
  });
});