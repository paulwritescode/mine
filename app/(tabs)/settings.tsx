import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, Typography, TouchTargets, BorderRadius } from '@/src/design-system';
import { MineCard } from '@/src/components';

interface AppSettings {
  reminderEnabled: boolean;
  reminderTime: string;
  defaultClipDuration: number;
  theme: 'light' | 'dark' | 'system';
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    reminderEnabled: true,
    reminderTime: '20:00',
    defaultClipDuration: 2,
    theme: 'system'
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
    onPress: () => void,
    rightElement?: React.ReactNode
  ) => (
    <MineCard onPress={onPress} style={styles.settingCard}>
      <View style={styles.settingContent}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={24} color={Colors.sage} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
        {rightElement || (
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        )}
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
          
          {renderSettingCard(
            'Theme',
            'System',
            'color-palette',
            () => Alert.alert('Coming Soon', 'Theme settings will be available soon')
          )}
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
    backgroundColor: Colors.offWhite,
  },
  
  // Header
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
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
  
  // Setting Cards
  settingCard: {
    marginBottom: Spacing.md,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  
  // Toggle
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.disabled,
    padding: 2,
    justifyContent: 'center',
  },
  toggleEnabled: {
    backgroundColor: Colors.sage,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbEnabled: {
    transform: [{ translateX: 20 }],
  },
});