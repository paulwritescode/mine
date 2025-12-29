import { create } from 'zustand';
import { Project, VideoSnippet } from '../types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  snippets: VideoSnippet[];
  isLoading: boolean;
  error: string | null;
}

interface ProjectActions {
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setSnippets: (snippets: VideoSnippet[]) => void;
  addSnippet: (snippet: VideoSnippet) => void;
  updateSnippet: (id: string, updates: Partial<VideoSnippet>) => void;
  removeSnippet: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type ProjectStore = ProjectState & ProjectActions;

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // State
  projects: [],
  currentProject: null,
  snippets: [],
  isLoading: false,
  error: null,

  // Actions
  setProjects: (projects) => set({ projects }),
  
  setCurrentProject: (project) => set({ currentProject: project }),
  
  addProject: (project) => set((state) => ({
    projects: [project, ...state.projects]
  })),
  
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ),
    currentProject: state.currentProject?.id === id 
      ? { ...state.currentProject, ...updates, updatedAt: new Date() }
      : state.currentProject
  })),
  
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject
  })),
  
  setSnippets: (snippets) => set({ snippets }),
  
  addSnippet: (snippet) => set((state) => ({
    snippets: [...state.snippets, snippet]
  })),
  
  updateSnippet: (id, updates) => set((state) => ({
    snippets: state.snippets.map(s => 
      s.id === id ? { ...s, ...updates } : s
    )
  })),
  
  removeSnippet: (id) => set((state) => ({
    snippets: state.snippets.filter(s => s.id !== id)
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null })
}));