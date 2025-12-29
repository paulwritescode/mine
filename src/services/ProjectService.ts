import { Platform } from 'react-native';
import { Project, ProjectType, ProjectSettings } from '../types';
import { databaseService } from './DatabaseService';
import { FileSystemManager } from '../utils/fileSystem';

export class ProjectService {
  private static instance: ProjectService;

  private constructor() {}

  public static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  public async createProject(type: ProjectType, name: string, label?: string): Promise<Project> {
    if (Platform.OS === 'web') {
      // Return mock project for web platform
      const id = this.generateId();
      const now = Date.now();
      
      const defaultSettings: ProjectSettings = {
        clipDuration: 2,
        aspectRatio: '16:9',
        themeColor: '#007AFF',
      };

      return {
        id,
        name,
        label,
        type,
        createdAt: new Date(now),
        updatedAt: new Date(now),
        settings: defaultSettings,
      };
    }

    const db = databaseService.getDatabase();
    const id = this.generateId();
    const now = Date.now();
    
    const defaultSettings: ProjectSettings = {
      clipDuration: 2,
      aspectRatio: '16:9',
      themeColor: '#007AFF',
    };

    const project: Project = {
      id,
      name,
      label,
      type,
      createdAt: new Date(now),
      updatedAt: new Date(now),
      settings: defaultSettings,
    };

    try {
      // Create project directory structure
      await FileSystemManager.createProjectDirectory(id);

      // Insert into database
      await db.runAsync(
        `INSERT INTO projects (id, name, label, type, created_at, updated_at, settings) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, name, label || null, type, now, now, JSON.stringify(defaultSettings)]
      );

      return project;
    } catch (error) {
      console.error('Failed to create project:', error);
      // Cleanup directory if database insert failed
      try {
        await FileSystemManager.deleteProjectDirectory(id);
      } catch (cleanupError) {
        console.error('Failed to cleanup project directory:', cleanupError);
      }
      throw error;
    }
  }

  public async getProjects(): Promise<Project[]> {
    if (Platform.OS === 'web') {
      // Return empty array for web platform
      return [];
    }

    const db = databaseService.getDatabase();
    
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM projects ORDER BY updated_at DESC`
      );

      return result.map(this.mapRowToProject);
    } catch (error) {
      console.error('Failed to get projects:', error);
      throw error;
    }
  }

  public async getProject(id: string): Promise<Project | null> {
    const db = databaseService.getDatabase();
    
    try {
      const result = await db.getFirstAsync(
        `SELECT * FROM projects WHERE id = ?`,
        [id]
      );

      return result ? this.mapRowToProject(result) : null;
    } catch (error) {
      console.error('Failed to get project:', error);
      throw error;
    }
  }

  public async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const db = databaseService.getDatabase();
    const now = Date.now();
    
    try {
      const current = await this.getProject(id);
      if (!current) {
        throw new Error(`Project with id ${id} not found`);
      }

      const updatedProject = { ...current, ...updates, updatedAt: new Date(now) };
      
      await db.runAsync(
        `UPDATE projects SET 
         name = ?, 
         label = ?,
         thumbnail_path = ?, 
         settings = ?, 
         updated_at = ? 
         WHERE id = ?`,
        [
          updatedProject.name,
          updatedProject.label || null,
          updatedProject.thumbnailPath || null,
          JSON.stringify(updatedProject.settings),
          now,
          id
        ]
      );

      return updatedProject;
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  }

  public async deleteProject(id: string): Promise<void> {
    const db = databaseService.getDatabase();
    
    try {
      // Delete from database (cascades to snippets)
      await db.runAsync(`DELETE FROM projects WHERE id = ?`, [id]);
      
      // Delete project directory
      await FileSystemManager.deleteProjectDirectory(id);
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  }

  private mapRowToProject(row: any): Project {
    return {
      id: row.id,
      name: row.name,
      label: row.label || undefined,
      type: row.type as ProjectType,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      thumbnailPath: row.thumbnail_path || undefined,
      settings: row.settings ? JSON.parse(row.settings) : {
        clipDuration: 2,
        aspectRatio: '16:9',
        themeColor: '#007AFF',
      },
    };
  }

  private generateId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const projectService = ProjectService.getInstance();