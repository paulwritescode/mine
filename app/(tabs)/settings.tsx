import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, Typography, TouchTargets, BorderRadius } from '@/src/design-system';
import { MineCard } from '@/src/components';
import { ThemeToggle, ThemeMode } from '@/src/components/ThemeToggle';

interface AppSettings {
  reminderEnabled: boolean;
  reminderTime: string;
  defaultClipDuration: number;
  theme: ThemeMode;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    reminderEnabled: true,
    reminderTime: '20:00',
    defaultClipDuration: 2,
    theme: 'dark'  // Default to dark theme
  });

  const handleToggleSetting = async (key: keyof AppSettings, value: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAbout = () => {
    Alert.alert(
      'About Mine',
      'Mine is a video journaling app that helps you capture and organize your daily moments.\n\nVersion 1.0.0',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Privacy',
      'Mine keeps all your data local on your device. No data is sent to external servers.',
      [{ text: 'OK' }]
    );
  };

  const renderSettingCard = (
    title: string,
    description: string,
    icon: keyof typeof Ionicons.glyphMap,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <MineCard onPress={onPress} style={styles.settingCard}>
      <View style={styles.settingContent}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={20} color={Colors.surface} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
        {rightElement}
      </View>
    </MineCard>
  );

  const renderToggle = (enabled: boolean, onToggle: () => void) => (
    <TouchableOpacity
      onPress={onToggle}
      style={[styles.toggle, enabled && styles.toggleEnabled]}
    >
      <View style={[styles.toggleThumb, enabled && styles.toggleThumbEnabled]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recording Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recording</Text>
          
          {renderSettingCard(
            'Default Clip Duration',
            `${settings.defaultClipDuration} seconds`,
            'time',
            () => Alert.alert('Coming Soon', 'Clip duration settings will be available soon')
          )}
          
          {renderSettingCard(
            'Daily Reminders',
            settings.reminderEnabled ? `Enabled at ${settings.reminderTime}` : 'Disabled',
            'notifications',
            () => handleToggleSetting('reminderEnabled', !settings.reminderEnabled),
            renderToggle(settings.reminderEnabled, () => handleToggleSetting('reminderEnabled', !settings.reminderEnabled))
          )}
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <MineCard style={styles.settingCard}>
            <ThemeToggle
              currentMode={settings.theme}
              onModeChange={(mode) => handleToggleSetting('theme', mode)}
            />
          </MineCard>
        </View>

        {/* Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          
          {renderSettingCard(
            'Storage Usage',
            'View and manage storage',
            'folder',
            () => Alert.alert('Coming Soon', 'Storage management will be available soon')
          )}
          
          {renderSettingCard(
            'Auto-cleanup',
            'Automatically remove old videos',
            'trash',
            () => Alert.alert('Coming Soon', 'Auto-cleanup settings will be available soon')
          )}
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          {renderSettingCard(
            'Privacy Policy',
            'Your data stays on your device',
            'shield-checkmark',
            handlePrivacy
          )}
          
          {renderSettingCard(
            'About Mine',
            'Version and app information',
            'information-circle',
            handleAbout
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header - removed separator line
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    // Removed border separator
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.background,  // Black text on white header
  },
  
  // Content
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  
  // Sections
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  
  // Setting Cards - reduced padding
  settingCard: {
    marginBottom: Spacing.md,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 32,  // Reduced from 40
    height: 32, // Reduced from 40
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background,  // Black icon background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.body,
    color: Colors.background,  // Black text on white surface
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    ...Typography.caption,
    color: Colors.background,  // Black text on white surface
    opacity: 0.7,  // Slightly faded for hierarchy
  },
  
  // Toggle - updated colors
  toggle: {
    width: 44,  // Reduced from 50
    height: 26, // Reduced from 30
    borderRadius: 13,
    backgroundColor: Colors.background,
    padding: 2,
    justifyContent: 'center',
    opacity: 0.3,  // Disabled state
  },
  toggleEnabled: {
    backgroundColor: Colors.background,
    opacity: 1,  // Enabled state
  },
  toggleThumb: {
    width: 22, // Reduced from 26
    height: 22, // Reduced from 26
    borderRadius: 11,
    backgroundColor: Colors.surface,
    // Removed shadow
  },
  toggleThumbEnabled: {
    transform: [{ translateX: 18 }], // Adjusted for smaller size
  },
});