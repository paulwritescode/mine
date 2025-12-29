import { create } from 'zustand';
import { ProjectType } from '../types';

interface CreateProjectFormData {
  name: string;
  label: string;
  type: ProjectType | null;
}

interface CreateProjectState {
  currentStep: number;
  totalSteps: number;
  formData: CreateProjectFormData;
  isLoading: boolean;
  error: string | null;
}

interface CreateProjectActions {
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateFormData: (updates: Partial<CreateProjectFormData>) => void;
  setProjectName: (name: string) => void;
  setProjectLabel: (label: string) => void;
  setProjectType: (type: ProjectType) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetForm: () => void;
}

type CreateProjectStore = CreateProjectState & CreateProjectActions;

const initialFormData: CreateProjectFormData = {
  name: '',
  label: '',
  type: null,
};

export const useCreateProjectStore = create<CreateProjectStore>((set, get) => ({
  // State
  currentStep: 1,
  totalSteps: 2,
  formData: initialFormData,
  isLoading: false,
  error: null,

  // Actions
  setCurrentStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, state.totalSteps)
  })),
  
  previousStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1)
  })),
  
  updateFormData: (updates) => set((state) => ({
    formData: { ...state.formData, ...updates }
  })),
  
  setProjectName: (name) => set((state) => ({
    formData: { ...state.formData, name }
  })),
  
  setProjectLabel: (label) => set((state) => ({
    formData: { ...state.formData, label }
  })),
  
  setProjectType: (type) => set((state) => ({
    formData: { ...state.formData, type }
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  resetForm: () => set({
    currentStep: 1,
    formData: initialFormData,
    isLoading: false,
    error: null,
  }),
}));