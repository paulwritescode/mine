import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingsStackParamList } from './types';
import { AppSettings } from '../screens/AppSettings';

// Placeholder screens - will be implemented in later tasks
const ProjectSettingsScreen = () => null;

const Stack = createStackNavigator<SettingsStackParamList>();

export function SettingsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="AppSettings" 
        component={AppSettings}
      />
      <Stack.Screen 
        name="ProjectSettings" 
        component={ProjectSettingsScreen}
        options={{ title: 'Project Settings' }}
      />
    </Stack.Navigator>
  );
}