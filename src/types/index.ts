// Core type definitions for Mine app

export interface Project {
  id: string;
  name: string;
  label?: string; // Project label/tag
  type: 'timeline' | 'freestyle';
  createdAt: Date;
  updatedAt: Date;
  thumbnailPath?: string;
  settings: ProjectSettings;
}

export interface ProjectSettings {
  clipDuration: 1 | 2 | 3;
  aspectRatio: '16:9' | '4:3' | '1:1';
  themeColor: string;
  musicPath?: string;
  autoDeleteAfterMonths?: number;
}

export interface VideoSnippet {
  id: string;
  projectId: string;
  filePath: string;
  thumbnailPath: string;
  duration: number;
  recordedDate: Date;
  calendarDate?: string; // For timeline projects
  note?: string;
  createdAt: Date;
  orderIndex?: number; // For freestyle projects
  metadata: SnippetMetadata;
}

export interface SnippetMetadata {
  location?: {
    latitude: number;
    longitude: number;
  };
  weather?: string;
  mood?: string;
}

export interface AppSettings {
  reminderEnabled: boolean;
  reminderTime: string;
  defaultClipDuration: 1 | 2 | 3;
  theme: 'light' | 'dark' | 'system';
}

export type ProjectType = 'timeline' | 'freestyle';
export type CompressionQuality = 'high' | 'medium' | 'low';

export interface CompilationOptions {
  quality: CompressionQuality;
  aspectRatio: '16:9' | '4:3' | '1:1';
  includeMusic?: boolean;
  musicPath?: string;
}