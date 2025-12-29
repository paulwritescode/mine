import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CaptureStackParamList } from './types';
import { CameraView } from '../screens/CameraView';
import { PostCapture } from '../screens/PostCapture';

const Stack = createStackNavigator<CaptureStackParamList>();

export function CaptureStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CameraView" 
        component={CameraView}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PostCapture" 
        component={PostCapture}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}