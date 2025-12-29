import { create } from 'zustand';
import { AppSettings } from '../types';

interface AppState {
  settings: AppSettings;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AppActions {
  setSettings: (settings: AppSettings) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  setInitialized: (initialized: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AppStore = AppState & AppActions;

const defaultSettings: AppSettings = {
  reminderEnabled: true,
  reminderTime: '20:00',
  defaultClipDuration: 2,
  theme: 'system'
};

export const useAppStore = create<AppStore>((set) => ({
  // State
  settings: defaultSettings,
  isInitialized: false,
  isLoading: false,
  error: null,

  // Actions
  setSettings: (settings) => set({ settings }),
  
  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates }
  })),
  
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null })
}));