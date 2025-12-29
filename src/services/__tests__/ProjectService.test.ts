/**
 * ProjectService Test
 * Tests project CRUD operations and project type handling
 * Validates Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 */

import { ProjectService } from '../ProjectService';
import { databaseService } from '../DatabaseService';
import { FileSystemManager } from '../../utils/fileSystem';
import { Project, ProjectType } from '../../types';

// Mock Platform to simulate native environment
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

// Mock DatabaseService
jest.mock('../DatabaseService', () => ({
  databaseService: {
    getDatabase: jest.fn(),
  },
}));

// Mock FileSystemManager
jest.mock('../../utils/fileSystem', () => ({
  FileSystemManager: {
    createProjectDirectory: jest.fn().mockResolvedValue(undefined),
    deleteProjectDirectory: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('ProjectService', () => {
  let projectService: ProjectService;
  let mockDb: any;

  beforeEach(() => {
    // Create mock database
    mockDb = {
      runAsync: jest.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 1 }),
      getAllAsync: jest.fn().mockResolvedValue([]),
      getFirstAsync: jest.fn().mockResolvedValue(null),
    };

    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup mock implementations
    (databaseService.getDatabase as jest.Mock).mockReturnValue(mockDb);
    
    // Get ProjectService instance
    projectService = ProjectService.getInstance();
  });

  describe('Project Creation', () => {
    it('should create a timeline project with correct properties', async () => {
      const projectName = 'My Timeline Project';
      const projectType: ProjectType = 'timeline';

      const project = await projectService.createProject(projectType, projectName);

      expect(project.name).toBe(projectName);
      expect(project.type).toBe(projectType);
      expect(project.id).toMatch(/^project_\d+_[a-z0-9]+$/);
      expect(project.createdAt).toBeInstanceOf(Date);
      expect(project.updatedAt).toBeInstanceOf(Date);
      expect(project.settings).toEqual({
        clipDuration: 2,
        aspectRatio: '16:9',
        themeColor: '#007AFF',
      });

      // Verify database insertion
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO projects'),
        expect.arrayContaining([project.id, projectName, projectType])
      );

      // Verify directory creation
      expect(FileSystemManager.createProjectDirectory).toHaveBeenCalledWith(project.id);
    });

    it('should create a freestyle project with correct properties', async () => {
      const projectName = 'My Freestyle Project';
      const projectType: ProjectType = 'freestyle';

      const project = await projectService.createProject(projectType, projectName);

      expect(project.name).toBe(projectName);
      expect(project.type).toBe(projectType);
      expect(project.settings.clipDuration).toBe(2);
      expect(project.settings.aspectRatio).toBe('16:9');

      // Verify database insertion with correct type
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO projects'),
        expect.arrayContaining([project.id, projectName, 'freestyle'])
      );
    });

    it('should handle project creation failure and cleanup directory', async () => {
      const error = new Error('Database insertion failed');
      mockDb.runAsync.mockRejectedValue(error);

      await expect(
        projectService.createProject('timeline', 'Test Project')
      ).rejects.toThrow('Database insertion failed');

      // Verify cleanup was attempted
      expect(FileSystemManager.deleteProjectDirectory).toHaveBeenCalled();
    });

    it('should return mock project on web platform', async () => {
      // Mock Platform.OS to be 'web'
      jest.doMock('react-native', () => ({
        Platform: { OS: 'web' },
      }));

      const project = await projectService.createProject('timeline', 'Web Project');

      expect(project.name).toBe('Web Project');
      expect(project.type).toBe('timeline');
      expect(project.id).toMatch(/^project_\d+_[a-z0-9]+$/);
      
      // Should not call database operations on web
      expect(mockDb.runAsync).not.toHaveBeenCalled();
    });
  });

  describe('Project Retrieval', () => {
    it('should get all projects ordered by updated date', async () => {
      const mockProjects = [
        {
          id: 'project-1',
          name: 'Recent Project',
          type: 'timeline',
          created_at: 1640995200000,
          updated_at: 1640995300000,
          settings: '{"clipDuration": 2, "aspectRatio": "16:9", "themeColor": "#007AFF"}'
        },
        {
          id: 'project-2',
          name: 'Older Project',
          type: 'freestyle',
          created_at: 1640995100000,
          updated_at: 1640995200000,
          thumbnail_path: '/path/to/thumbnail.jpg',
          settings: '{"clipDuration": 3, "aspectRatio": "4:3", "themeColor": "#FF0000"}'
        }
      ];

      mockDb.getAllAsync.mockResolvedValue(mockProjects);

      const projects = await projectService.getProjects();

      expect(projects).toHaveLength(2);
      expect(projects[0].name).toBe('Recent Project');
      expect(projects[0].type).toBe('timeline');
      expect(projects[0].createdAt).toEqual(new Date(1640995200000));
      expect(projects[0].settings.clipDuration).toBe(2);
      
      expect(projects[1].name).toBe('Older Project');
      expect(projects[1].type).toBe('freestyle');
      expect(projects[1].thumbnailPath).toBe('/path/to/thumbnail.jpg');
      expect(projects[1].settings.clipDuration).toBe(3);

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM projects ORDER BY updated_at DESC'
      );
    });

    it('should return empty array on web platform', async () => {
      // Mock Platform.OS to be 'web'
      jest.doMock('react-native', () => ({
        Platform: { OS: 'web' },
      }));

      const projects = await projectService.getProjects();

      expect(projects).toEqual([]);
      expect(mockDb.getAllAsync).not.toHaveBeenCalled();
    });

    it('should get a specific project by id', async () => {
      const mockProject = {
        id: 'project-123',
        name: 'Test Project',
        type: 'timeline',
        created_at: 1640995200000,
        updated_at: 1640995200000,
        settings: '{"clipDuration": 2, "aspectRatio": "16:9", "themeColor": "#007AFF"}'
      };

      mockDb.getFirstAsync.mockResolvedValue(mockProject);

      const project = await projectService.getProject('project-123');

      expect(project).not.toBeNull();
      expect(project!.id).toBe('project-123');
      expect(project!.name).toBe('Test Project');
      expect(project!.type).toBe('timeline');

      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        'SELECT * FROM projects WHERE id = ?',
        ['project-123']
      );
    });

    it('should return null for non-existent project', async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);

      const project = await projectService.getProject('non-existent');

      expect(project).toBeNull();
    });
  });

  describe('Project Updates', () => {
    it('should update project properties', async () => {
      const existingProject = {
        id: 'project-123',
        name: 'Original Name',
        type: 'timeline',
        created_at: 1640995200000,
        updated_at: 1640995200000,
        settings: '{"clipDuration": 2, "aspectRatio": "16:9", "themeColor": "#007AFF"}'
      };

      mockDb.getFirstAsync.mockResolvedValue(existingProject);

      const updates = {
        name: 'Updated Name',
        thumbnailPath: '/path/to/new/thumbnail.jpg',
        settings: {
          clipDuration: 3 as const,
          aspectRatio: '4:3' as const,
          themeColor: '#FF0000',
        }
      };

      const updatedProject = await projectService.updateProject('project-123', updates);

      expect(updatedProject.name).toBe('Updated Name');
      expect(updatedProject.thumbnailPath).toBe('/path/to/new/thumbnail.jpg');
      expect(updatedProject.settings.clipDuration).toBe(3);
      expect(updatedProject.settings.aspectRatio).toBe('4:3');
      expect(updatedProject.updatedAt.getTime()).toBeGreaterThan(1640995200000);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE projects SET'),
        expect.arrayContaining(['Updated Name', '/path/to/new/thumbnail.jpg'])
      );
    });

    it('should throw error when updating non-existent project', async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);

      await expect(
        projectService.updateProject('non-existent', { name: 'New Name' })
      ).rejects.toThrow('Project with id non-existent not found');
    });

    it('should handle partial updates', async () => {
      const existingProject = {
        id: 'project-123',
        name: 'Original Name',
        type: 'timeline',
        created_at: 1640995200000,
        updated_at: 1640995200000,
        settings: '{"clipDuration": 2, "aspectRatio": "16:9", "themeColor": "#007AFF"}'
      };

      mockDb.getFirstAsync.mockResolvedValue(existingProject);

      const updates = { name: 'Updated Name Only' };
      const updatedProject = await projectService.updateProject('project-123', updates);

      expect(updatedProject.name).toBe('Updated Name Only');
      expect(updatedProject.type).toBe('timeline'); // Should remain unchanged
      expect(updatedProject.settings.clipDuration).toBe(2); // Should remain unchanged
    });
  });

  describe('Project Deletion', () => {
    it('should delete project and associated files', async () => {
      await projectService.deleteProject('project-123');

      // Verify database deletion
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'DELETE FROM projects WHERE id = ?',
        ['project-123']
      );

      // Verify directory deletion
      expect(FileSystemManager.deleteProjectDirectory).toHaveBeenCalledWith('project-123');
    });

    it('should handle deletion errors gracefully', async () => {
      const error = new Error('Deletion failed');
      mockDb.runAsync.mockRejectedValue(error);

      await expect(
        projectService.deleteProject('project-123')
      ).rejects.toThrow('Deletion failed');
    });

    it('should cascade delete associated snippets', async () => {
      // This is handled by the database foreign key constraint
      // The test verifies that the DELETE statement is called
      await projectService.deleteProject('project-123');

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'DELETE FROM projects WHERE id = ?',
        ['project-123']
      );
    });
  });

  describe('Project Settings Handling', () => {
    it('should handle projects with default settings when settings is null', async () => {
      const mockProject = {
        id: 'project-123',
        name: 'Test Project',
        type: 'timeline',
        created_at: 1640995200000,
        updated_at: 1640995200000,
        settings: null // No settings stored
      };

      mockDb.getFirstAsync.mockResolvedValue(mockProject);

      const project = await projectService.getProject('project-123');

      expect(project!.settings).toEqual({
        clipDuration: 2,
        aspectRatio: '16:9',
        themeColor: '#007AFF',
      });
    });

    it('should parse JSON settings correctly', async () => {
      const mockProject = {
        id: 'project-123',
        name: 'Test Project',
        type: 'freestyle',
        created_at: 1640995200000,
        updated_at: 1640995200000,
        settings: '{"clipDuration": 3, "aspectRatio": "1:1", "themeColor": "#00FF00", "musicPath": "/music/track.mp3"}'
      };

      mockDb.getFirstAsync.mockResolvedValue(mockProject);

      const project = await projectService.getProject('project-123');

      expect(project!.settings).toEqual({
        clipDuration: 3,
        aspectRatio: '1:1',
        themeColor: '#00FF00',
        musicPath: '/music/track.mp3',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors during project creation', async () => {
      const error = new Error('Database connection failed');
      (databaseService.getDatabase as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await expect(
        projectService.createProject('timeline', 'Test Project')
      ).rejects.toThrow('Database connection failed');
    });

    it('should handle database errors during project retrieval', async () => {
      const error = new Error('Database query failed');
      mockDb.getAllAsync.mockRejectedValue(error);

      await expect(projectService.getProjects()).rejects.toThrow('Database query failed');
    });

    it('should handle database errors during project updates', async () => {
      const existingProject = {
        id: 'project-123',
        name: 'Test Project',
        type: 'timeline',
        created_at: 1640995200000,
        updated_at: 1640995200000,
        settings: '{}'
      };

      mockDb.getFirstAsync.mockResolvedValue(existingProject);
      
      const error = new Error('Update failed');
      mockDb.runAsync.mockRejectedValue(error);

      await expect(
        projectService.updateProject('project-123', { name: 'New Name' })
      ).rejects.toThrow('Update failed');
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ProjectService.getInstance();
      const instance2 = ProjectService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('ID Generation', () => {
    it('should generate unique project IDs', async () => {
      const project1 = await projectService.createProject('timeline', 'Project 1');
      const project2 = await projectService.createProject('freestyle', 'Project 2');

      expect(project1.id).not.toBe(project2.id);
      expect(project1.id).toMatch(/^project_\d+_[a-z0-9]+$/);
      expect(project2.id).toMatch(/^project_\d+_[a-z0-9]+$/);
    });
  });
});