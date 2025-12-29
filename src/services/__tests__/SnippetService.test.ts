/**
 * SnippetService Test
 * Tests snippet CRUD operations, note management, and metadata handling
 * Validates Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6
 */

import { SnippetService } from '../SnippetService';
import { databaseService } from '../DatabaseService';
import { FileSystemManager } from '../../utils/fileSystem';
import { VideoSnippet, SnippetMetadata } from '../../types';

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
    deleteFile: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('SnippetService', () => {
  let snippetService: SnippetService;
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
    
    // Get SnippetService instance
    snippetService = SnippetService.getInstance();
  });

  describe('Snippet Creation', () => {
    it('should add a new snippet with all properties', async () => {
      const projectId = 'project-123';
      const filePath = '/videos/snippet.mp4';
      const thumbnailPath = '/thumbnails/snippet.jpg';
      const duration = 2.5;
      const recordedDate = new Date('2024-01-15T10:30:00Z');
      const calendarDate = '2024-01-15';
      const note = 'Test snippet note';
      const orderIndex = 1;
      const metadata: SnippetMetadata = {
        location: { latitude: 40.7128, longitude: -74.0060 },
        mood: 'happy',
        weather: 'sunny'
      };

      const snippet = await snippetService.addSnippet(
        projectId,
        filePath,
        thumbnailPath,
        duration,
        recordedDate,
        calendarDate,
        note,
        orderIndex,
        metadata
      );

      expect(snippet.projectId).toBe(projectId);
      expect(snippet.filePath).toBe(filePath);
      expect(snippet.thumbnailPath).toBe(thumbnailPath);
      expect(snippet.duration).toBe(duration);
      expect(snippet.recordedDate).toEqual(recordedDate);
      expect(snippet.calendarDate).toBe(calendarDate);
      expect(snippet.note).toBe(note);
      expect(snippet.orderIndex).toBe(orderIndex);
      expect(snippet.metadata).toEqual(metadata);
      expect(snippet.id).toMatch(/^snippet_\d+_[a-z0-9]+$/);

      // Verify database insertion
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO snippets'),
        expect.arrayContaining([
          snippet.id,
          projectId,
          filePath,
          thumbnailPath,
          duration,
          recordedDate.getTime(),
          calendarDate,
          note,
          expect.any(Number), // created_at
          orderIndex,
          JSON.stringify(metadata)
        ])
      );
    });

    it('should add a snippet with minimal properties', async () => {
      const projectId = 'project-123';
      const filePath = '/videos/snippet.mp4';
      const thumbnailPath = '/thumbnails/snippet.jpg';
      const duration = 1.5;
      const recordedDate = new Date();

      const snippet = await snippetService.addSnippet(
        projectId,
        filePath,
        thumbnailPath,
        duration,
        recordedDate
      );

      expect(snippet.projectId).toBe(projectId);
      expect(snippet.filePath).toBe(filePath);
      expect(snippet.duration).toBe(duration);
      expect(snippet.calendarDate).toBeUndefined();
      expect(snippet.note).toBeUndefined();
      expect(snippet.orderIndex).toBeUndefined();
      expect(snippet.metadata).toEqual({});
    });

    it('should return mock snippet on web platform', async () => {
      // Mock Platform.OS to be 'web'
      jest.doMock('react-native', () => ({
        Platform: { OS: 'web' },
      }));

      const snippet = await snippetService.addSnippet(
        'project-123',
        '/videos/test.mp4',
        '/thumbnails/test.jpg',
        2.0,
        new Date()
      );

      expect(snippet.projectId).toBe('project-123');
      expect(snippet.filePath).toBe('/videos/test.mp4');
      
      // Should not call database operations on web
      expect(mockDb.runAsync).not.toHaveBeenCalled();
    });
  });

  describe('Snippet Retrieval', () => {
    it('should get all snippets for a project', async () => {
      const mockSnippets = [
        {
          id: 'snippet-1',
          project_id: 'project-123',
          file_path: '/videos/snippet1.mp4',
          thumbnail_path: '/thumbnails/snippet1.jpg',
          duration: 2.0,
          recorded_date: 1640995200000,
          calendar_date: '2024-01-15',
          note: 'First snippet',
          created_at: 1640995200000,
          order_index: 1,
          metadata: '{"mood": "happy"}'
        },
        {
          id: 'snippet-2',
          project_id: 'project-123',
          file_path: '/videos/snippet2.mp4',
          thumbnail_path: '/thumbnails/snippet2.jpg',
          duration: 1.5,
          recorded_date: 1640995300000,
          calendar_date: '2024-01-16',
          note: null,
          created_at: 1640995300000,
          order_index: 2,
          metadata: '{}'
        }
      ];

      mockDb.getAllAsync.mockResolvedValue(mockSnippets);

      const snippets = await snippetService.getSnippetsForProject('project-123');

      expect(snippets).toHaveLength(2);
      expect(snippets[0].id).toBe('snippet-1');
      expect(snippets[0].note).toBe('First snippet');
      expect(snippets[0].metadata.mood).toBe('happy');
      expect(snippets[1].id).toBe('snippet-2');
      expect(snippets[1].note).toBeUndefined();
      expect(snippets[1].metadata).toEqual({});

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM snippets'),
        ['project-123']
      );
    });

    it('should get a specific snippet by id', async () => {
      const mockSnippet = {
        id: 'snippet-123',
        project_id: 'project-123',
        file_path: '/videos/snippet.mp4',
        thumbnail_path: '/thumbnails/snippet.jpg',
        duration: 2.5,
        recorded_date: 1640995200000,
        calendar_date: '2024-01-15',
        note: 'Test snippet',
        created_at: 1640995200000,
        order_index: 1,
        metadata: '{"location": {"latitude": 40.7128, "longitude": -74.0060}}'
      };

      mockDb.getFirstAsync.mockResolvedValue(mockSnippet);

      const snippet = await snippetService.getSnippet('snippet-123');

      expect(snippet).not.toBeNull();
      expect(snippet!.id).toBe('snippet-123');
      expect(snippet!.note).toBe('Test snippet');
      expect(snippet!.metadata.location).toEqual({
        latitude: 40.7128,
        longitude: -74.0060
      });

      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        'SELECT * FROM snippets WHERE id = ?',
        ['snippet-123']
      );
    });

    it('should return null for non-existent snippet', async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);

      const snippet = await snippetService.getSnippet('non-existent');

      expect(snippet).toBeNull();
    });

    it('should return empty array on web platform', async () => {
      // Mock Platform.OS to be 'web'
      jest.doMock('react-native', () => ({
        Platform: { OS: 'web' },
      }));

      const snippets = await snippetService.getSnippetsForProject('project-123');

      expect(snippets).toEqual([]);
      expect(mockDb.getAllAsync).not.toHaveBeenCalled();
    });
  });

  describe('Snippet Updates', () => {
    it('should update snippet properties', async () => {
      const existingSnippet = {
        id: 'snippet-123',
        project_id: 'project-123',
        file_path: '/videos/snippet.mp4',
        thumbnail_path: '/thumbnails/snippet.jpg',
        duration: 2.0,
        recorded_date: 1640995200000,
        calendar_date: '2024-01-15',
        note: 'Original note',
        created_at: 1640995200000,
        order_index: 1,
        metadata: '{}'
      };

      mockDb.getFirstAsync.mockResolvedValue(existingSnippet);

      const updates = {
        note: 'Updated note',
        orderIndex: 2,
        metadata: { mood: 'excited' }
      };

      const updatedSnippet = await snippetService.updateSnippet('snippet-123', updates);

      expect(updatedSnippet.note).toBe('Updated note');
      expect(updatedSnippet.orderIndex).toBe(2);
      expect(updatedSnippet.metadata.mood).toBe('excited');

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE snippets SET'),
        expect.arrayContaining(['Updated note', 2, JSON.stringify({ mood: 'excited' }), 'snippet-123'])
      );
    });

    it('should update snippet note with validation', async () => {
      const existingSnippet = {
        id: 'snippet-123',
        project_id: 'project-123',
        file_path: '/videos/snippet.mp4',
        thumbnail_path: '/thumbnails/snippet.jpg',
        duration: 2.0,
        recorded_date: 1640995200000,
        calendar_date: '2024-01-15',
        note: 'Original note',
        created_at: 1640995200000,
        order_index: 1,
        metadata: '{}'
      };

      mockDb.getFirstAsync.mockResolvedValue(existingSnippet);

      const newNote = 'This is a valid note under 500 characters';
      const updatedSnippet = await snippetService.updateSnippetNote('snippet-123', newNote);

      expect(updatedSnippet.note).toBe(newNote);
    });

    it('should reject notes exceeding 500 characters', async () => {
      const longNote = 'a'.repeat(501); // Exceeds 500 character limit

      await expect(
        snippetService.updateSnippetNote('snippet-123', longNote)
      ).rejects.toThrow('Note cannot exceed 500 characters');
    });

    it('should throw error when updating non-existent snippet', async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);

      await expect(
        snippetService.updateSnippet('non-existent', { note: 'New note' })
      ).rejects.toThrow('Snippet with id non-existent not found');
    });
  });

  describe('Snippet Deletion', () => {
    it('should delete snippet and associated files', async () => {
      const mockSnippet = {
        id: 'snippet-123',
        project_id: 'project-123',
        file_path: '/videos/snippet.mp4',
        thumbnail_path: '/thumbnails/snippet.jpg',
        duration: 2.0,
        recorded_date: 1640995200000,
        calendar_date: '2024-01-15',
        note: 'Test snippet',
        created_at: 1640995200000,
        order_index: 1,
        metadata: '{}'
      };

      mockDb.getFirstAsync.mockResolvedValue(mockSnippet);

      await snippetService.deleteSnippet('snippet-123');

      // Verify database deletion
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'DELETE FROM snippets WHERE id = ?',
        ['snippet-123']
      );

      // Verify file deletion
      expect(FileSystemManager.deleteFile).toHaveBeenCalledWith('/videos/snippet.mp4');
      expect(FileSystemManager.deleteFile).toHaveBeenCalledWith('/thumbnails/snippet.jpg');
    });

    it('should handle file deletion errors gracefully', async () => {
      const mockSnippet = {
        id: 'snippet-123',
        project_id: 'project-123',
        file_path: '/videos/snippet.mp4',
        thumbnail_path: '/thumbnails/snippet.jpg',
        duration: 2.0,
        recorded_date: 1640995200000,
        calendar_date: '2024-01-15',
        note: 'Test snippet',
        created_at: 1640995200000,
        order_index: 1,
        metadata: '{}'
      };

      mockDb.getFirstAsync.mockResolvedValue(mockSnippet);
      (FileSystemManager.deleteFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      // Should not throw error even if file deletion fails
      await expect(snippetService.deleteSnippet('snippet-123')).resolves.not.toThrow();

      // Database deletion should still occur
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'DELETE FROM snippets WHERE id = ?',
        ['snippet-123']
      );
    });
  });

  describe('Search Functionality', () => {
    it('should search snippets by note content', async () => {
      const mockSnippets = [
        {
          id: 'snippet-1',
          project_id: 'project-123',
          file_path: '/videos/snippet1.mp4',
          thumbnail_path: '/thumbnails/snippet1.jpg',
          duration: 2.0,
          recorded_date: 1640995200000,
          calendar_date: '2024-01-15',
          note: 'Beautiful sunset at the beach',
          created_at: 1640995200000,
          order_index: 1,
          metadata: '{}'
        }
      ];

      mockDb.getAllAsync.mockResolvedValue(mockSnippets);

      const results = await snippetService.searchSnippetsByNote('sunset');

      expect(results).toHaveLength(1);
      expect(results[0].note).toBe('Beautiful sunset at the beach');

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining('WHERE note LIKE ?'),
        ['%sunset%']
      );
    });

    it('should search snippets by note within specific project', async () => {
      const mockSnippets = [
        {
          id: 'snippet-1',
          project_id: 'project-123',
          file_path: '/videos/snippet1.mp4',
          thumbnail_path: '/thumbnails/snippet1.jpg',
          duration: 2.0,
          recorded_date: 1640995200000,
          calendar_date: '2024-01-15',
          note: 'Morning coffee routine',
          created_at: 1640995200000,
          order_index: 1,
          metadata: '{}'
        }
      ];

      mockDb.getAllAsync.mockResolvedValue(mockSnippets);

      const results = await snippetService.searchSnippetsByNote('coffee', 'project-123');

      expect(results).toHaveLength(1);
      expect(results[0].note).toBe('Morning coffee routine');

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining('WHERE note LIKE ? AND project_id = ?'),
        ['%coffee%', 'project-123']
      );
    });
  });

  describe('Date Range Queries', () => {
    it('should get snippets by date range', async () => {
      const mockSnippets = [
        {
          id: 'snippet-1',
          project_id: 'project-123',
          file_path: '/videos/snippet1.mp4',
          thumbnail_path: '/thumbnails/snippet1.jpg',
          duration: 2.0,
          recorded_date: 1640995200000,
          calendar_date: '2024-01-15',
          note: 'Day 1',
          created_at: 1640995200000,
          order_index: 1,
          metadata: '{}'
        }
      ];

      mockDb.getAllAsync.mockResolvedValue(mockSnippets);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const results = await snippetService.getSnippetsByDateRange('project-123', startDate, endDate);

      expect(results).toHaveLength(1);
      expect(results[0].note).toBe('Day 1');

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining('WHERE project_id = ? AND recorded_date >= ? AND recorded_date <= ?'),
        ['project-123', startDate.getTime(), endDate.getTime()]
      );
    });

    it('should get snippets by calendar date', async () => {
      const mockSnippets = [
        {
          id: 'snippet-1',
          project_id: 'project-123',
          file_path: '/videos/snippet1.mp4',
          thumbnail_path: '/thumbnails/snippet1.jpg',
          duration: 2.0,
          recorded_date: 1640995200000,
          calendar_date: '2024-01-15',
          note: 'January 15th',
          created_at: 1640995200000,
          order_index: 1,
          metadata: '{}'
        }
      ];

      mockDb.getAllAsync.mockResolvedValue(mockSnippets);

      const results = await snippetService.getSnippetsByCalendarDate('project-123', '2024-01-15');

      expect(results).toHaveLength(1);
      expect(results[0].calendarDate).toBe('2024-01-15');

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining('WHERE project_id = ? AND calendar_date = ?'),
        ['project-123', '2024-01-15']
      );
    });
  });

  describe('Metadata Management', () => {
    it('should update snippet metadata', async () => {
      const existingSnippet = {
        id: 'snippet-123',
        project_id: 'project-123',
        file_path: '/videos/snippet.mp4',
        thumbnail_path: '/thumbnails/snippet.jpg',
        duration: 2.0,
        recorded_date: 1640995200000,
        calendar_date: '2024-01-15',
        note: 'Test snippet',
        created_at: 1640995200000,
        order_index: 1,
        metadata: '{"mood": "happy"}'
      };

      mockDb.getFirstAsync.mockResolvedValue(existingSnippet);

      const newMetadata = { weather: 'sunny', temperature: '75°F' };
      const updatedSnippet = await snippetService.updateSnippetMetadata('snippet-123', newMetadata);

      expect(updatedSnippet.metadata).toEqual({
        mood: 'happy',
        weather: 'sunny',
        temperature: '75°F'
      });
    });

    it('should add mood tag to snippet', async () => {
      const existingSnippet = {
        id: 'snippet-123',
        project_id: 'project-123',
        file_path: '/videos/snippet.mp4',
        thumbnail_path: '/thumbnails/snippet.jpg',
        duration: 2.0,
        recorded_date: 1640995200000,
        calendar_date: '2024-01-15',
        note: 'Test snippet',
        created_at: 1640995200000,
        order_index: 1,
        metadata: '{}'
      };

      mockDb.getFirstAsync.mockResolvedValue(existingSnippet);

      const updatedSnippet = await snippetService.addMoodTag('snippet-123', 'excited');

      expect(updatedSnippet.metadata.mood).toBe('excited');
    });

    it('should add location metadata to snippet', async () => {
      const existingSnippet = {
        id: 'snippet-123',
        project_id: 'project-123',
        file_path: '/videos/snippet.mp4',
        thumbnail_path: '/thumbnails/snippet.jpg',
        duration: 2.0,
        recorded_date: 1640995200000,
        calendar_date: '2024-01-15',
        note: 'Test snippet',
        created_at: 1640995200000,
        order_index: 1,
        metadata: '{}'
      };

      mockDb.getFirstAsync.mockResolvedValue(existingSnippet);

      const location = { latitude: 40.7128, longitude: -74.0060 };
      const updatedSnippet = await snippetService.addLocationMetadata('snippet-123', location);

      expect(updatedSnippet.metadata.location).toEqual(location);
    });

    it('should filter snippets by mood', async () => {
      const mockSnippets = [
        {
          id: 'snippet-1',
          project_id: 'project-123',
          file_path: '/videos/snippet1.mp4',
          thumbnail_path: '/thumbnails/snippet1.jpg',
          duration: 2.0,
          recorded_date: 1640995200000,
          calendar_date: '2024-01-15',
          note: 'Happy moment',
          created_at: 1640995200000,
          order_index: 1,
          metadata: '{"mood": "happy"}'
        },
        {
          id: 'snippet-2',
          project_id: 'project-123',
          file_path: '/videos/snippet2.mp4',
          thumbnail_path: '/thumbnails/snippet2.jpg',
          duration: 1.5,
          recorded_date: 1640995300000,
          calendar_date: '2024-01-16',
          note: 'Sad moment',
          created_at: 1640995300000,
          order_index: 2,
          metadata: '{"mood": "sad"}'
        }
      ];

      mockDb.getAllAsync.mockResolvedValue(mockSnippets);

      const happySnippets = await snippetService.getSnippetsWithMood('project-123', 'happy');

      expect(happySnippets).toHaveLength(1);
      expect(happySnippets[0].metadata.mood).toBe('happy');
    });
  });

  describe('Snippet Reordering', () => {
    it('should reorder snippets for freestyle projects', async () => {
      const snippetIds = ['snippet-3', 'snippet-1', 'snippet-2'];

      await snippetService.reorderSnippets('project-123', snippetIds);

      // Verify each snippet was updated with correct order_index
      expect(mockDb.runAsync).toHaveBeenCalledTimes(3);
      expect(mockDb.runAsync).toHaveBeenNthCalledWith(1,
        'UPDATE snippets SET order_index = ? WHERE id = ? AND project_id = ?',
        [0, 'snippet-3', 'project-123']
      );
      expect(mockDb.runAsync).toHaveBeenNthCalledWith(2,
        'UPDATE snippets SET order_index = ? WHERE id = ? AND project_id = ?',
        [1, 'snippet-1', 'project-123']
      );
      expect(mockDb.runAsync).toHaveBeenNthCalledWith(3,
        'UPDATE snippets SET order_index = ? WHERE id = ? AND project_id = ?',
        [2, 'snippet-2', 'project-123']
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors during snippet creation', async () => {
      const error = new Error('Database insertion failed');
      mockDb.runAsync.mockRejectedValue(error);

      await expect(
        snippetService.addSnippet('project-123', '/videos/test.mp4', '/thumbnails/test.jpg', 2.0, new Date())
      ).rejects.toThrow('Database insertion failed');
    });

    it('should handle database errors during snippet retrieval', async () => {
      const error = new Error('Database query failed');
      mockDb.getAllAsync.mockRejectedValue(error);

      await expect(
        snippetService.getSnippetsForProject('project-123')
      ).rejects.toThrow('Database query failed');
    });

    it('should handle database errors during snippet updates', async () => {
      const existingSnippet = {
        id: 'snippet-123',
        project_id: 'project-123',
        file_path: '/videos/snippet.mp4',
        thumbnail_path: '/thumbnails/snippet.jpg',
        duration: 2.0,
        recorded_date: 1640995200000,
        calendar_date: '2024-01-15',
        note: 'Test snippet',
        created_at: 1640995200000,
        order_index: 1,
        metadata: '{}'
      };

      mockDb.getFirstAsync.mockResolvedValue(existingSnippet);
      
      const error = new Error('Update failed');
      mockDb.runAsync.mockRejectedValue(error);

      await expect(
        snippetService.updateSnippet('snippet-123', { note: 'New note' })
      ).rejects.toThrow('Update failed');
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = SnippetService.getInstance();
      const instance2 = SnippetService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('ID Generation', () => {
    it('should generate unique snippet IDs', async () => {
      const snippet1 = await snippetService.addSnippet(
        'project-123', '/videos/1.mp4', '/thumbnails/1.jpg', 2.0, new Date()
      );
      const snippet2 = await snippetService.addSnippet(
        'project-123', '/videos/2.mp4', '/thumbnails/2.jpg', 1.5, new Date()
      );

      expect(snippet1.id).not.toBe(snippet2.id);
      expect(snippet1.id).toMatch(/^snippet_\d+_[a-z0-9]+$/);
      expect(snippet2.id).toMatch(/^snippet_\d+_[a-z0-9]+$/);
    });
  });
});