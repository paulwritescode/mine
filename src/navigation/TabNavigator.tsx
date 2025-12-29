import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TabParamList } from './types';
import { ProjectsStackNavigator } from './ProjectsStackNavigator';
import { CaptureStackNavigator } from './CaptureStackNavigator';
import { SettingsStackNavigator } from './SettingsStackNavigator';
import { Colors } from '../design-system';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'ProjectsStack') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'CaptureStack') {
            iconName = focused ? 'videocam' : 'videocam-outline';
          } else if (route.name === 'SettingsStack') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.sage,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="ProjectsStack" 
        component={ProjectsStackNavigator}
        options={{ tabBarLabel: 'Projects' }}
      />
      <Tab.Screen 
        name="CaptureStack" 
        component={CaptureStackNavigator}
        options={{ tabBarLabel: 'Capture' }}
      />
      <Tab.Screen 
        name="SettingsStack" 
        component={SettingsStackNavigator}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}