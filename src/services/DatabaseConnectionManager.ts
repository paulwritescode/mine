import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

/**
 * Database connection manager for handling SQLite connections
 * Provides connection pooling, error recovery, and transaction management
 */
export class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private database: SQLite.SQLiteDatabase | null = null;
  private isConnected: boolean = false;
  private connectionPromise: Promise<SQLite.SQLiteDatabase> | null = null;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  private constructor() {}

  public static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }

  /**
   * Get or create a database connection with retry logic
   */
  public async getConnection(): Promise<SQLite.SQLiteDatabase> {
    if (Platform.OS === 'web') {
      throw new Error('SQLite not available on web platform');
    }

    if (this.database && this.isConnected) {
      return this.database;
    }

    // If connection is in progress, wait for it
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Create new connection
    this.connectionPromise = this.createConnection();
    
    try {
      this.database = await this.connectionPromise;
      this.isConnected = true;
      return this.database;
    } finally {
      this.connectionPromise = null;
    }
  }

  /**
   * Create a new database connection with retry logic
   */
  private async createConnection(): Promise<SQLite.SQLiteDatabase> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`Attempting to connect to database (attempt ${attempt}/${this.maxRetries})`);
        
        const db = await SQLite.openDatabaseAsync('mine.db');
        
        // Test the connection
        await db.getFirstAsync('SELECT 1 as test;');
        
        console.log('Database connection established successfully');
        return db;
      } catch (error) {
        lastError = error as Error;
        console.error(`Database connection attempt ${attempt} failed:`, error);
        
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt); // Exponential backoff
        }
      }
    }

    throw new Error(`Failed to connect to database after ${this.maxRetries} attempts: ${lastError?.message}`);
  }

  /**
   * Execute a query with automatic retry on connection failure
   */
  public async executeQuery<T>(
    query: string,
    params?: any[]
  ): Promise<T | null> {
    const db = await this.getConnection();
    
    try {
      if (params) {
        return await db.getFirstAsync<T>(query, params);
      } else {
        return await db.getFirstAsync<T>(query);
      }
    } catch (error) {
      await this.handleConnectionError(error as Error);
      throw error;
    }
  }

  /**
   * Execute multiple queries with automatic retry on connection failure
   */
  public async executeQueries<T>(
    query: string,
    params?: any[]
  ): Promise<T[]> {
    const db = await this.getConnection();
    
    try {
      if (params) {
        return await db.getAllAsync<T>(query, params);
      } else {
        return await db.getAllAsync<T>(query);
      }
    } catch (error) {
      await this.handleConnectionError(error as Error);
      throw error;
    }
  }

  /**
   * Execute a statement (INSERT, UPDATE, DELETE) with automatic retry
   */
  public async executeStatement(
    query: string,
    params?: any[]
  ): Promise<SQLite.SQLiteRunResult> {
    const db = await this.getConnection();
    
    try {
      if (params) {
        return await db.runAsync(query, params);
      } else {
        return await db.runAsync(query);
      }
    } catch (error) {
      await this.handleConnectionError(error as Error);
      throw error;
    }
  }

  /**
   * Execute raw SQL with automatic retry
   */
  public async executeRaw(query: string): Promise<void> {
    const db = await this.getConnection();
    
    try {
      await db.execAsync(query);
    } catch (error) {
      await this.handleConnectionError(error as Error);
      throw error;
    }
  }

  /**
   * Execute a transaction with automatic rollback on failure
   */
  public async executeTransaction<T>(
    callback: (db: SQLite.SQLiteDatabase) => Promise<T>
  ): Promise<T> {
    const db = await this.getConnection();
    
    try {
      await db.execAsync('BEGIN TRANSACTION;');
      
      const result = await callback(db);
      
      await db.execAsync('COMMIT;');
      
      return result;
    } catch (error) {
      try {
        await db.execAsync('ROLLBACK;');
      } catch (rollbackError) {
        console.error('Failed to rollback transaction:', rollbackError);
      }
      
      await this.handleConnectionError(error as Error);
      throw error;
    }
  }

  /**
   * Handle connection errors and attempt recovery
   */
  private async handleConnectionError(error: Error): Promise<void> {
    console.error('Database connection error:', error);
    
    // Check if it's a connection-related error
    const connectionErrors = [
      'database is locked',
      'database disk image is malformed',
      'no such table',
      'database connection'
    ];
    
    const isConnectionError = connectionErrors.some(errorType => 
      error.message.toLowerCase().includes(errorType)
    );
    
    if (isConnectionError) {
      console.log('Attempting to recover database connection...');
      await this.disconnect();
      // Next call to getConnection() will create a new connection
    }
  }

  /**
   * Check if the database connection is healthy
   */
  public async isHealthy(): Promise<boolean> {
    try {
      if (!this.database || !this.isConnected) {
        return false;
      }
      
      await this.database.getFirstAsync('SELECT 1 as test;');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  /**
   * Get database statistics
   */
  public async getStats(): Promise<{
    pageCount: number;
    pageSize: number;
    freePages: number;
    totalSize: number;
  }> {
    const db = await this.getConnection();
    
    const pageCount = await db.getFirstAsync<{ page_count: number }>('PRAGMA page_count;');
    const pageSize = await db.getFirstAsync<{ page_size: number }>('PRAGMA page_size;');
    const freePages = await db.getFirstAsync<{ freelist_count: number }>('PRAGMA freelist_count;');
    
    return {
      pageCount: pageCount?.page_count || 0,
      pageSize: pageSize?.page_size || 0,
      freePages: freePages?.freelist_count || 0,
      totalSize: (pageCount?.page_count || 0) * (pageSize?.page_size || 0)
    };
  }

  /**
   * Optimize database performance
   */
  public async optimize(): Promise<void> {
    const db = await this.getConnection();
    
    try {
      console.log('Optimizing database...');
      
      // Analyze query performance
      await db.execAsync('ANALYZE;');
      
      // Vacuum to reclaim space
      await db.execAsync('VACUUM;');
      
      // Update statistics
      await db.execAsync('PRAGMA optimize;');
      
      console.log('Database optimization completed');
    } catch (error) {
      console.error('Database optimization failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from the database
   */
  public async disconnect(): Promise<void> {
    if (this.database) {
      try {
        await this.database.closeAsync();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
      
      this.database = null;
      this.isConnected = false;
    }
    
    console.log('Database connection closed');
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const connectionManager = DatabaseConnectionManager.getInstance();