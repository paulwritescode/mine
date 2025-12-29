import { NavigatorScreenParams } from '@react-navigation/native';

// Tab Navigator Params
export type TabParamList = {
  ProjectsStack: NavigatorScreenParams<ProjectsStackParamList>;
  CaptureStack: NavigatorScreenParams<CaptureStackParamList>;
  SettingsStack: NavigatorScreenParams<SettingsStackParamList>;
};

// Projects Stack Params
export type ProjectsStackParamList = {
  ProjectsList: undefined;
  ProjectDetail: { projectId: string };
  CreateProject: undefined;
};

// Capture Stack Params
export type CaptureStackParamList = {
  CameraView: { projectId?: string; date?: string };
  PostCapture: { videoPath: string; projectId: string };
};

// Settings Stack Params
export type SettingsStackParamList = {
  AppSettings: undefined;
  ProjectSettings: { projectId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TabParamList {}
  }
}