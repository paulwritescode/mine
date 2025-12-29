/**
 * ThemeToggle - Auto-detecting theme toggle component
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Appearance,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, Typography, BorderRadius } from '../design-system';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  currentMode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
}

export function ThemeToggle({ currentMode, onModeChange }: ThemeToggleProps) {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(
    Appearance.getColorScheme() || 'dark'
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme || 'dark');
    });

    return () => subscription?.remove();
  }, []);

  const handleModeChange = async (mode: ThemeMode) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onModeChange(mode);
  };

  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (currentMode === 'system') {
      return systemTheme;
    }
    return currentMode;
  };

  const getModeDescription = (): string => {
    switch (currentMode) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      case 'system':
        return `System (${systemTheme})`;
      default:
        return 'Dark mode';
    }
  };

  const effectiveTheme = getEffectiveTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={effectiveTheme === 'dark' ? 'moon' : 'sunny'} 
            size={20} 
            color={Colors.textPrimary} 
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>Theme</Text>
          <Text style={styles.description}>{getModeDescription()}</Text>
        </View>
      </View>
      
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleOption,
            currentMode === 'dark' && styles.toggleOptionActive
          ]}
          onPress={() => handleModeChange('dark')}
        >
          <Ionicons name="moon" size={16} color={
            currentMode === 'dark' ? Colors.surface : Colors.background
          } />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.toggleOption,
            currentMode === 'system' && styles.toggleOptionActive
          ]}
          onPress={() => handleModeChange('system')}
        >
          <Ionicons name="phone-portrait" size={16} color={
            currentMode === 'system' ? Colors.surface : Colors.background
          } />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.toggleOption,
            currentMode === 'light' && styles.toggleOptionActive
          ]}
          onPress={() => handleModeChange('light')}
        >
          <Ionicons name="sunny" size={16} color={
            currentMode === 'light' ? Colors.surface : Colors.background
          } />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  
  info: {
    flex: 1,
  },
  
  title: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 2,
  },
  
  toggleOption: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  toggleOptionActive: {
    backgroundColor: Colors.background,
  },
});