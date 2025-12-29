/**
 * MineCard - Reusable card component following Mine design system
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../design-system';

export interface MineCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export function MineCard({
  children,
  onPress,
  style,
  disabled = false,
}: MineCardProps) {
  const cardStyles = [
    styles.base,
    disabled && styles.disabled,
    style,
  ];

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    // Removed shadows for flat design
  },
  disabled: {
    opacity: 0.5,
  },
});