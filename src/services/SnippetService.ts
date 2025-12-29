import { Platform } from 'react-native';
import { VideoSnippet, SnippetMetadata } from '../types';
import { databaseService } from './DatabaseService';
import { FileSystemManager } from '../utils/fileSystem';

export class SnippetService {
  private static instance: SnippetService;

  private constructor() {}

  public static getInstance(): SnippetService {
    if (!SnippetService.instance) {
      SnippetService.instance = new SnippetService();
    }
    return SnippetService.instance;
  }

  public async addSnippet(
    projectId: string,
    filePath: string,
    thumbnailPath: string,
    duration: number,
    recordedDate: Date,
    calendarDate?: string,
    note?: string,
    orderIndex?: number,
    metadata?: SnippetMetadata
  ): Promise<VideoSnippet> {
    if (Platform.OS === 'web') {
      // Return mock snippet for web platform
      const id = this.generateId();
      const now = Date.now();
      
      return {
        id,
        projectId,
        filePath,
        thumbnailPath,
        duration,
        recordedDate,
        calendarDate,
        note,
        createdAt: new Date(now),
        orderIndex,
        metadata: metadata || {},
      };
    }

    const db = databaseService.getDatabase();
    const id = this.generateId();
    const now = Date.now();
    
    const snippet: VideoSnippet = {
      id,
      projectId,
      filePath,
      thumbnailPath,
      duration,
      recordedDate,
      calendarDate,
      note,
      createdAt: new Date(now),
      orderIndex,
      metadata: metadata || {},
    };

    try {
      // Insert into database
      await db.runAsync(
        `INSERT INTO snippets (
          id, project_id, file_path, thumbnail_path, duration, 
          recorded_date, calendar_date, note, created_at, order_index, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          projectId,
          filePath,
          thumbnailPath,
          duration,
          recordedDate.getTime(),
          calendarDate || null,
          note || null,
          now,
          orderIndex || null,
          JSON.stringify(snippet.metadata)
        ]
      );

      return snippet;
    } catch (error) {
      console.error('Failed to add snippet:', error);
      throw error;
    }
  }

  public async getSnippetsForProject(projectId: string): Promise<VideoSnippet[]> {
    if (Platform.OS === 'web') {
      // Return empty array for web platform
      return [];
    }

    const db = databaseService.getDatabase();
    
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM snippets 
         WHERE project_id = ? 
         ORDER BY calendar_date ASC, recorded_date ASC`,
        [projectId]
      );

      return result.map(this.mapRowToSnippet);
    } catch (error) {
      console.error('Failed to get snippets for project:', error);
      throw error;
    }
  }

  public async getSnippet(id: string): Promise<VideoSnippet | null> {
    if (Platform.OS === 'web') {
      return null;
    }

    const db = databaseService.getDatabase();
    
    try {
      const result = await db.getFirstAsync(
        `SELECT * FROM snippets WHERE id = ?`,
        [id]
      );

      return result ? this.mapRowToSnippet(result) : null;
    } catch (error) {
      console.error('Failed to get snippet:', error);
      throw error;
    }
  }

  public async updateSnippet(id: string, updates: Partial<VideoSnippet>): Promise<VideoSnippet> {
    if (Platform.OS === 'web') {
      throw new Error('Update not supported on web platform');
    }

    const db = databaseService.getDatabase();
    
    try {
      const current = await this.getSnippet(id);
      if (!current) {
        throw new Error(`Snippet with id ${id} not found`);
      }

      const updatedSnippet = { ...current, ...updates };
      
      await db.runAsync(
        `UPDATE snippets SET 
         note = ?, 
         order_index = ?, 
         metadata = ?
         WHERE id = ?`,
        [
          updatedSnippet.note || null,
          updatedSnippet.orderIndex || null,
          JSON.stringify(updatedSnippet.metadata),
          id
        ]
      );

      return updatedSnippet;
    } catch (error) {
      console.error('Failed to update snippet:', error);
      throw error;
    }
  }

  public async updateSnippetNote(id: string, note: string): Promise<VideoSnippet> {
    // Validate note length (500 character limit per requirements)
    if (note && note.length > 500) {
      throw new Error('Note cannot exceed 500 characters');
    }

    return this.updateSnippet(id, { note });
  }

  public async deleteSnippet(id: string): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    const db = databaseService.getDatabase();
    
    try {
      // Get snippet to find file paths for cleanup
      const snippet = await this.getSnippet(id);
      
      // Delete from database
      await db.runAsync(`DELETE FROM snippets WHERE id = ?`, [id]);
      
      // Delete associated files
      if (snippet) {
        try {
          await FileSystemManager.deleteFile(snippet.filePath);
          await FileSystemManager.deleteFile(snippet.thumbnailPath);
        } catch (fileError) {
          console.warn('Failed to delete snippet files:', fileError);
          // Don't throw error for file cleanup failures
        }
      }
    } catch (error) {
      console.error('Failed to delete snippet:', error);
      throw error;
    }
  }

  public async searchSnippetsByNote(query: string, projectId?: string): Promise<VideoSnippet[]> {
    if (Platform.OS === 'web') {
      return [];
    }

    const db = databaseService.getDatabase();
    
    try {
      let sql = `SELECT * FROM snippets WHERE note LIKE ? `;
      const params: any[] = [`%${query}%`];
      
      if (projectId) {
        sql += `AND project_id = ? `;
        params.push(projectId);
      }
      
      sql += `ORDER BY recorded_date DESC`;

      const result = await db.getAllAsync(sql, params);
      return result.map(this.mapRowToSnippet);
    } catch (error) {
      console.error('Failed to search snippets by note:', error);
      throw error;
    }
  }

  public async getSnippetsByDateRange(
    projectId: string,
    startDate: Date,
    endDate: Date
  ): Promise<VideoSnippet[]> {
    if (Platform.OS === 'web') {
      return [];
    }

    const db = databaseService.getDatabase();
    
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM snippets 
         WHERE project_id = ? 
         AND recorded_date >= ? 
         AND recorded_date <= ?
         ORDER BY recorded_date ASC`,
        [projectId, startDate.getTime(), endDate.getTime()]
      );

      return result.map(this.mapRowToSnippet);
    } catch (error) {
      console.error('Failed to get snippets by date range:', error);
      throw error;
    }
  }

  public async getSnippetsByCalendarDate(
    projectId: string,
    calendarDate: string
  ): Promise<VideoSnippet[]> {
    if (Platform.OS === 'web') {
      return [];
    }

    const db = databaseService.getDatabase();
    
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM snippets 
         WHERE project_id = ? 
         AND calendar_date = ?
         ORDER BY recorded_date ASC`,
        [projectId, calendarDate]
      );

      return result.map(this.mapRowToSnippet);
    } catch (error) {
      console.error('Failed to get snippets by calendar date:', error);
      throw error;
    }
  }

  public async updateSnippetMetadata(
    id: string,
    metadata: Partial<SnippetMetadata>
  ): Promise<VideoSnippet> {
    const current = await this.getSnippet(id);
    if (!current) {
      throw new Error(`Snippet with id ${id} not found`);
    }

    const updatedMetadata = { ...current.metadata, ...metadata };
    return this.updateSnippet(id, { metadata: updatedMetadata });
  }

  public async addMoodTag(id: string, mood: string): Promise<VideoSnippet> {
    return this.updateSnippetMetadata(id, { mood });
  }

  public async addLocationMetadata(
    id: string,
    location: { latitude: number; longitude: number }
  ): Promise<VideoSnippet> {
    return this.updateSnippetMetadata(id, { location });
  }

  public async getSnippetsWithMood(projectId: string, mood: string): Promise<VideoSnippet[]> {
    const snippets = await this.getSnippetsForProject(projectId);
    return snippets.filter(snippet => snippet.metadata.mood === mood);
  }

  public async reorderSnippets(projectId: string, snippetIds: string[]): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    const db = databaseService.getDatabase();
    
    try {
      // Update order_index for each snippet
      for (let i = 0; i < snippetIds.length; i++) {
        await db.runAsync(
          `UPDATE snippets SET order_index = ? WHERE id = ? AND project_id = ?`,
          [i, snippetIds[i], projectId]
        );
      }
    } catch (error) {
      console.error('Failed to reorder snippets:', error);
      throw error;
    }
  }

  private mapRowToSnippet(row: any): VideoSnippet {
    return {
      id: row.id,
      projectId: row.project_id,
      filePath: row.file_path,
      thumbnailPath: row.thumbnail_path,
      duration: row.duration,
      recordedDate: new Date(row.recorded_date),
      calendarDate: row.calendar_date || undefined,
      note: row.note || undefined,
      createdAt: new Date(row.created_at),
      orderIndex: row.order_index || undefined,
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
    };
  }

  private generateId(): string {
    return `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const snippetService = SnippetService.getInstance();