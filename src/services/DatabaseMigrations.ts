import * as SQLite from 'expo-sqlite';

/**
 * Database migration utilities for the Mine app
 * This module provides helper functions for creating and managing database migrations
 */

export interface MigrationDefinition {
  version: number;
  name: string;
  up: (db: SQLite.SQLiteDatabase) => Promise<void>;
  down?: (db: SQLite.SQLiteDatabase) => Promise<void>;
}

/**
 * Helper function to create a new migration
 */
export function createMigration(
  version: number,
  name: string,
  up: (db: SQLite.SQLiteDatabase) => Promise<void>,
  down?: (db: SQLite.SQLiteDatabase) => Promise<void>
): MigrationDefinition {
  return {
    version,
    name,
    up,
    down
  };
}

/**
 * Helper function to add a new table
 */
export async function addTable(
  db: SQLite.SQLiteDatabase,
  tableName: string,
  columns: string[]
): Promise<void> {
  const columnDefinitions = columns.join(', ');
  await db.execAsync(`CREATE TABLE ${tableName} (${columnDefinitions});`);
}

/**
 * Helper function to add a new column to an existing table
 */
export async function addColumn(
  db: SQLite.SQLiteDatabase,
  tableName: string,
  columnName: string,
  columnDefinition: string
): Promise<void> {
  await db.execAsync(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition};`);
}

/**
 * Helper function to create an index
 */
export async function createIndex(
  db: SQLite.SQLiteDatabase,
  indexName: string,
  tableName: string,
  columns: string[]
): Promise<void> {
  const columnList = columns.join(', ');
  await db.execAsync(`CREATE INDEX IF NOT EXISTS ${indexName} ON ${tableName}(${columnList});`);
}

/**
 * Helper function to drop an index
 */
export async function dropIndex(
  db: SQLite.SQLiteDatabase,
  indexName: string
): Promise<void> {
  await db.execAsync(`DROP INDEX IF EXISTS ${indexName};`);
}

/**
 * Helper function to drop a table
 */
export async function dropTable(
  db: SQLite.SQLiteDatabase,
  tableName: string
): Promise<void> {
  await db.execAsync(`DROP TABLE IF EXISTS ${tableName};`);
}

/**
 * Helper function to check if a table exists
 */
export async function tableExists(
  db: SQLite.SQLiteDatabase,
  tableName: string
): Promise<boolean> {
  const result = await db.getFirstAsync<{ count: number }>(`
    SELECT COUNT(*) as count FROM sqlite_master 
    WHERE type='table' AND name=?;
  `, [tableName]);
  
  return (result?.count || 0) > 0;
}

/**
 * Helper function to check if a column exists in a table
 */
export async function columnExists(
  db: SQLite.SQLiteDatabase,
  tableName: string,
  columnName: string
): Promise<boolean> {
  const result = await db.getAllAsync(`PRAGMA table_info(${tableName});`);
  return result.some((column: any) => column.name === columnName);
}

/**
 * Helper function to get table schema information
 */
export async function getTableInfo(
  db: SQLite.SQLiteDatabase,
  tableName: string
): Promise<any[]> {
  return await db.getAllAsync(`PRAGMA table_info(${tableName});`);
}

/**
 * Helper function to backup data before migration
 */
export async function backupTable(
  db: SQLite.SQLiteDatabase,
  tableName: string,
  backupTableName?: string
): Promise<void> {
  const backupName = backupTableName || `${tableName}_backup_${Date.now()}`;
  await db.execAsync(`CREATE TABLE ${backupName} AS SELECT * FROM ${tableName};`);
}

/**
 * Helper function to restore data after migration
 */
export async function restoreTable(
  db: SQLite.SQLiteDatabase,
  tableName: string,
  backupTableName: string,
  columnMapping?: Record<string, string>
): Promise<void> {
  if (columnMapping) {
    const columns = Object.keys(columnMapping).join(', ');
    const backupColumns = Object.values(columnMapping).join(', ');
    await db.execAsync(`INSERT INTO ${tableName} (${columns}) SELECT ${backupColumns} FROM ${backupTableName};`);
  } else {
    await db.execAsync(`INSERT INTO ${tableName} SELECT * FROM ${backupTableName};`);
  }
}

/**
 * Example migration templates for common operations
 */
export const MigrationTemplates = {
  /**
   * Template for adding a new table
   */
  addTable: (version: number, tableName: string, columns: string[]) => 
    createMigration(
      version,
      `add_${tableName}_table`,
      async (db) => {
        await addTable(db, tableName, columns);
      },
      async (db) => {
        await dropTable(db, tableName);
      }
    ),

  /**
   * Template for adding a new column
   */
  addColumn: (version: number, tableName: string, columnName: string, columnDefinition: string) =>
    createMigration(
      version,
      `add_${columnName}_to_${tableName}`,
      async (db) => {
        await addColumn(db, tableName, columnName, columnDefinition);
      }
      // Note: SQLite doesn't support DROP COLUMN, so no down migration
    ),

  /**
   * Template for creating an index
   */
  addIndex: (version: number, tableName: string, columns: string[], indexName?: string) => {
    const name = indexName || `idx_${tableName}_${columns.join('_')}`;
    return createMigration(
      version,
      `add_index_${name}`,
      async (db) => {
        await createIndex(db, name, tableName, columns);
      },
      async (db) => {
        await dropIndex(db, name);
      }
    );
  }
};