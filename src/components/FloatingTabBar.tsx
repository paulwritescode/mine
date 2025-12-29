/**
 * FloatingTabBar - Premium floating tab bar with elevated capture button
 * 
 * Features:
 * - Pill-shaped container with subtle shadow
 * - 32px top-corner radius
 * - Central floating black circle with white plus icon
 * - Elevated above the tab bar line
 * - Soft white or FAF4F1 background
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../design-system';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface TabItem {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  isActive?: boolean;
}

export interface FloatingTabBarProps {
  tabs: TabItem[];
  onTabPress: (tabKey: string) => void;
  onCapturePress: () => void;
  style?: ViewStyle;
}

export function FloatingTabBar({
  tabs,
  onTabPress,
  onCapturePress,
  style
}: FloatingTabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets.bottom);
  
  const captureButtonScale = useSharedValue(1);

  const handleCapturePress = () => {
    captureButtonScale.value = withSpring(0.9, {
      damping: 15,
      stiffness: 300,
    }, () => {
      captureButtonScale.value = withSpring(1, {
        damping: 15,
        stiffness: 300,
      });
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onCapturePress();
  };

  const captureButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: captureButtonScale.value }],
  }));

  const renderTab = (tab: TabItem, index: number) => {
    const tabScale = useSharedValue(1);

    const handleTabPressIn = () => {
      tabScale.value = withSpring(0.95, {
        damping: 15,
        stiffness: 300,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleTabPressOut = () => {
      tabScale.value = withSpring(1, {
        damping: 15,
        stiffness: 300,
      });
    };

    const handleTabPress = () => {
      onTabPress(tab.key);
    };

    const tabAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: tabScale.value }],
    }));

    return (
      <AnimatedPressable
        key={tab.key}
        style={[styles.tab, tabAnimatedStyle]}
        onPressIn={handleTabPressIn}
        onPressOut={handleTabPressOut}
        onPress={handleTabPress}
      >
        <Ionicons
          name={tab.icon}
          size={24}
          color={tab.isActive ? theme.colors.black : theme.colors.textSecondary}
        />
        <Text style={[
          styles.tabLabel,
          tab.isActive && styles.tabLabelActive
        ]}>
          {tab.title}
        </Text>
      </AnimatedPressable>
    );
  };

  // Split tabs around the center capture button
  const leftTabs = tabs.slice(0, Math.floor(tabs.length / 2));
  const rightTabs = tabs.slice(Math.floor(tabs.length / 2));

  return (
    <View style={[styles.container, style]}>
      {/* Main Tab Bar */}
      <View style={styles.tabBar}>
        {/* Left Tabs */}
        <View style={styles.tabSection}>
          {leftTabs.map(renderTab)}
        </View>

        {/* Center Spacer for Floating Button */}
        <View style={styles.centerSpacer} />

        {/* Right Tabs */}
        <View style={styles.tabSection}>
          {rightTabs.map(renderTab)}
        </View>
      </View>

      {/* Floating Capture Button */}
      <AnimatedPressable
        style={[styles.captureButton, captureButtonAnimatedStyle]}
        onPress={handleCapturePress}
      >
        <Ionicons name="add" size={28} color={theme.colors.white} />
      </AnimatedPressable>
    </View>
  );
}

const createStyles = (theme: any, bottomInset: number) => StyleSheet.create({
  container: {
    position: 'relative',
    paddingBottom: Math.max(bottomInset, 16),
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white, // Pure white background
    borderTopLeftRadius: theme.borderRadius.xl, // 32px top corners
    borderTopRightRadius: theme.borderRadius.xl, // 32px top corners
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  tabSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  centerSpacer: {
    width: 80, // Space for the floating button
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  tabLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontSize: 10,
  },
  tabLabelActive: {
    color: theme.colors.black,
    fontWeight: '600',
  },
  captureButton: {
    position: 'absolute',
    top: -20, // Elevated above the tab bar
    left: '50%',
    marginLeft: -30, // Half of button width (60px)
    width: 60,
    height: 60,
    borderRadius: 30, // Perfect circle
    backgroundColor: theme.colors.black, // Black button
    justifyContent: 'center',
    alignItems: 'center',
  },
});