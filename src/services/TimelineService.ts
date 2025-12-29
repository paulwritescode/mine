/**
 * TimelineService - Manages timeline compilation and video sequence operations
 * Implements Requirements 5.1, 5.2, 5.3, 5.7, 6.5
 */

import { VideoSnippet, Project, CompilationOptions } from '../types';
import { SnippetService } from './SnippetService';
import { ProjectService } from './ProjectService';

export interface VideoSequence {
  snippets: VideoSnippet[];
  currentIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface TimelineCompilationProgress {
  progress: number; // 0-100
  stage: 'preparing' | 'merging' | 'finalizing' | 'complete' | 'error';
  message?: string;
}

export class TimelineService {
  private static instance: TimelineService;
  private snippetService: SnippetService;
  private projectService: ProjectService;

  private constructor() {
    this.snippetService = SnippetService.getInstance();
    this.projectService = ProjectService.getInstance();
  }

  public static getInstance(): TimelineService {
    if (!TimelineService.instance) {
      TimelineService.instance = new TimelineService();
    }
    return TimelineService.instance;
  }

  /**
   * Get video sequence for timeline auto-play
   */
  public async getVideoSequence(
    projectId: string, 
    currentSnippetId: string
  ): Promise<VideoSequence> {
    try {
      const project = await this.projectService.getProject(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      const snippets = await this.snippetService.getSnippetsForProject(projectId);
      
      // Sort snippets by date for timeline projects, by order for freestyle
      const sortedSnippets = project.type === 'timeline' 
        ? snippets.sort((a, b) => {
            const dateA = a.calendarDate || a.recordedDate.toISOString().split('T')[0];
            const dateB = b.calendarDate || b.recordedDate.toISOString().split('T')[0];
            return dateA.localeCompare(dateB);
          })
        : snippets.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

      const currentIndex = sortedSnippets.findIndex(s => s.id === currentSnippetId);
      
      return {
        snippets: sortedSnippets,
        currentIndex: currentIndex >= 0 ? currentIndex : 0,
        hasNext: currentIndex < sortedSnippets.length - 1,
        hasPrevious: currentIndex > 0,
      };
    } catch (error) {
      console.error('Failed to get video sequence:', error);
      throw error;
    }
  }

  /**
   * Get next video in sequence
   */
  public async getNextVideo(
    projectId: string, 
    currentSnippetId: string
  ): Promise<VideoSnippet | null> {
    try {
      const sequence = await this.getVideoSequence(projectId, currentSnippetId);
      
      if (sequence.hasNext) {
        return sequence.snippets[sequence.currentIndex + 1];
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get next video:', error);
      return null;
    }
  }

  /**
   * Get previous video in sequence
   */
  public async getPreviousVideo(
    projectId: string, 
    currentSnippetId: string
  ): Promise<VideoSnippet | null> {
    try {
      const sequence = await this.getVideoSequence(projectId, currentSnippetId);
      
      if (sequence.hasPrevious) {
        return sequence.snippets[sequence.currentIndex - 1];
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get previous video:', error);
      return null;
    }
  }

  /**
   * Get timeline gaps (missing dates for timeline projects)
   */
  public async getTimelineGaps(projectId: string): Promise<Date[]> {
    try {
      const project = await this.projectService.getProject(projectId);
      if (!project || project.type !== 'timeline') {
        return [];
      }

      const snippets = await this.snippetService.getSnippetsForProject(projectId);
      const existingDates = new Set(
        snippets
          .map(s => s.calendarDate)
          .filter(date => date !== undefined)
      );

      // Calculate gaps for the last 30 days (or project duration)
      const gaps: Date[] = [];
      const today = new Date();
      const startDate = new Date(project.createdAt);
      
      for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        if (!existingDates.has(dateString)) {
          gaps.push(new Date(d));
        }
      }

      return gaps;
    } catch (error) {
      console.error('Failed to get timeline gaps:', error);
      return [];
    }
  }

  /**
   * Compile timeline (placeholder for future implementation)
   */
  public async compileTimeline(
    projectId: string,
    options: CompilationOptions,
    onProgress?: (progress: TimelineCompilationProgress) => void
  ): Promise<string> {
    try {
      onProgress?.({ progress: 0, stage: 'preparing', message: 'Preparing compilation...' });
      
      // This is a placeholder implementation
      // In a real app, you'd use FFmpeg or similar to merge videos
      
      onProgress?.({ progress: 50, stage: 'merging', message: 'Merging videos...' });
      
      // Simulate compilation time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onProgress?.({ progress: 100, stage: 'complete', message: 'Compilation complete!' });
      
      // Return placeholder path
      return '/path/to/compiled/timeline.mp4';
    } catch (error) {
      onProgress?.({ progress: 0, stage: 'error', message: 'Compilation failed' });
      throw error;
    }
  }

  /**
   * Calculate compilation progress (placeholder)
   */
  public calculateCompilationProgress(): Promise<number> {
    // This would be implemented with actual video processing
    return Promise.resolve(0);
  }
}