/**
 * AppSettings - Settings screen with grouped white cards and sage toggles
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { SettingsStackParamList } from '../navigation/types';
import { Colors, Spacing, Typography, TouchTargets, BorderRadius } from '../design-system';
import { MineCard } from '../components';

type Props = StackScreenProps<SettingsStackParamList, 'AppSettings'>;

interface AppSettings {
  reminderEnabled: boolean;
  reminderTime: string;
  defaultClipDuration: number;
  theme: 'light' | 'dark' | 'system';
}

export function AppSettings({ navigation }: Props) {
  const [settings, setSettings] = useState<AppSettings>({
    reminderEnabled: true,
    reminderTime: '20:00',
    defaultClipDuration: 2,
    theme: 'system',
  });

  const handleToggleReminder = async (value: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings(prev => ({ ...prev, reminderEnabled: value }));
  };

  const handleClipDurationChange = async (duration: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings(prev => ({ ...prev, defaultClipDuration: duration }));
  };

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings(prev => ({ ...prev, theme }));
  };

  const handleReminderTimePress = () => {
    Alert.alert(
      'Reminder Time',
      'Time picker will be implemented in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Data export functionality will be implemented in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Mine',
      'Mine v1.0.0\nPrivacy-first video journaling app\n\nAll your data stays on your device.',
      [{ text: 'OK' }]
    );
  };

  const renderSettingRow = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={20} color={Colors.sage} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      {rightElement || (onPress && (
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      ))}
    </TouchableOpacity>
  );

  const renderDurationSelector = () => (
    <View style={styles.durationSelector}>
      {[1, 2, 3].map((duration) => (
        <TouchableOpacity
          key={duration}
          style={[
            styles.durationOption,
            settings.defaultClipDuration === duration && styles.durationOptionSelected
          ]}
          onPress={() => handleClipDurationChange(duration)}
        >
          <Text style={[
            styles.durationText,
            settings.defaultClipDuration === duration && styles.durationTextSelected
          ]}>
            {duration}s
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderThemeSelector = () => (
    <View style={styles.themeSelector}>
      {[
        { key: 'light', label: 'Light', icon: 'sunny' },
        { key: 'dark', label: 'Dark', icon: 'moon' },
        { key: 'system', label: 'System', icon: 'phone-portrait' }
      ].map((theme) => (
        <TouchableOpacity
          key={theme.key}
          style={[
            styles.themeOption,
            settings.theme === theme.key && styles.themeOptionSelected
          ]}
          onPress={() => handleThemeChange(theme.key as any)}
        >
          <Ionicons 
            name={theme.icon as any} 
            size={16} 
            color={settings.theme === theme.key ? Colors.white : Colors.sage} 
          />
          <Text style={[
            styles.themeText,
            settings.theme === theme.key && styles.themeTextSelected
          ]}>
            {theme.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <MineCard style={styles.settingsCard}>
            {renderSettingRow(
              'notifications',
              'Daily Reminders',
              'Get reminded to capture your daily moment',
              undefined,
              <Switch
                value={settings.reminderEnabled}
                onValueChange={handleToggleReminder}
                trackColor={{ false: Colors.border, true: Colors.sageLight }}
                thumbColor={settings.reminderEnabled ? Colors.sage : Colors.disabled}
              />
            )}
            
            {settings.reminderEnabled && (
              <>
                <View style={styles.settingDivider} />
                {renderSettingRow(
                  'time',
                  'Reminder Time',
                  settings.reminderTime,
                  handleReminderTimePress
                )}
              </>
            )}
          </MineCard>
        </View>

        {/* Video Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video Settings</Text>
          <MineCard style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="videocam" size={20} color={Colors.sage} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Default Clip Duration</Text>
                  <Text style={styles.settingSubtitle}>
                    How long new video clips should be
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.settingCustomContent}>
              {renderDurationSelector()}
            </View>
          </MineCard>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <MineCard style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="color-palette" size={20} color={Colors.sage} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Theme</Text>
                  <Text style={styles.settingSubtitle}>
                    Choose your preferred appearance
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.settingCustomContent}>
              {renderThemeSelector()}
            </View>
          </MineCard>
        </View>

        {/* Data & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          <MineCard style={styles.settingsCard}>
            {renderSettingRow(
              'download',
              'Export Data',
              'Export all your projects and videos',
              handleExportData
            )}
            
            <View style={styles.settingDivider} />
            
            {renderSettingRow(
              'shield-checkmark',
              'Privacy Policy',
              'Your data stays on your device',
              () => Alert.alert('Privacy', 'Mine is completely local. No data is sent to any servers.')
            )}
          </MineCard>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <MineCard style={styles.settingsCard}>
            {renderSettingRow(
              'information-circle',
              'About Mine',
              'Version 1.0.0',
              handleAbout
            )}
            
            <View style={styles.settingDivider} />
            
            {renderSettingRow(
              'heart',
              'Rate Mine',
              'Help us improve the app',
              () => Alert.alert('Rate Mine', 'App Store rating will be implemented.')
            )}
          </MineCard>
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
    paddingHorizontal: Spacing.xs,
  },
  
  // Settings Card
  settingsCard: {
    marginBottom: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  
  // Setting Row
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: TouchTargets.button,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  settingSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 56, // Icon width + margin
  },
  settingCustomContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  
  // Duration Selector
  durationSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  durationOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  durationOptionSelected: {
    borderColor: Colors.sage,
    backgroundColor: Colors.sage,
  },
  durationText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  durationTextSelected: {
    color: Colors.white,
  },
  
  // Theme Selector
  themeSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: Spacing.xs,
  },
  themeOptionSelected: {
    borderColor: Colors.sage,
    backgroundColor: Colors.sage,
  },
  themeText: {
    ...Typography.caption,
    color: Colors.sage,
    fontWeight: '600',
  },
  themeTextSelected: {
    color: Colors.white,
  },
});