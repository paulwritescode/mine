import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProjectsStackParamList } from './types';
import { ProjectsList } from '../screens/ProjectsList';
import { ProjectDetail } from '../screens/ProjectDetail';
import { CreateProject } from '../screens/CreateProject';

const Stack = createStackNavigator<ProjectsStackParamList>();

export function ProjectsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="ProjectsList" 
        component={ProjectsList}
      />
      <Stack.Screen 
        name="ProjectDetail" 
        component={ProjectDetail}
      />
      <Stack.Screen 
        name="CreateProject" 
        component={CreateProject}
      />
    </Stack.Navigator>
  );
}