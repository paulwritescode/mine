/**
 * MineButton - Reusable button component following Mine design system
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors, BorderRadius, TouchTargets, Typography, Shadows } from '../design-system';

export interface MineButtonProps {
  variant?: 'primary' | 'secondary' | 'fab';
  size?: 'small' | 'medium' | 'large';
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function MineButton({
  variant = 'primary',
  size = 'medium',
  onPress,
  children,
  disabled = false,
  loading = false,
  style,
  textStyle,
}: MineButtonProps) {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? Colors.background : Colors.surface} 
          size="small"
        />
      ) : (
        <Text style={textStyles}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    // Removed shadows for flat design
  },
  secondary: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.surface,
  },
  fab: {
    backgroundColor: Colors.surface,
    borderRadius: TouchTargets.fab / 2,
    width: TouchTargets.fab,
    height: TouchTargets.fab,
    // Removed shadows for flat design
  },
  
  // Sizes - reduced padding
  small: {
    paddingHorizontal: 12,  // Reduced from 16
    paddingVertical: 6,     // Reduced from 8
    minHeight: 32,          // Reduced from 36
  },
  medium: {
    paddingHorizontal: 16,  // Reduced from 24
    paddingVertical: 8,     // Reduced from 12
    minHeight: TouchTargets.button,
  },
  large: {
    paddingHorizontal: 24,  // Reduced from 32
    paddingVertical: 12,    // Reduced from 16
    minHeight: 56,          // Reduced from 64
  },
  
  // Disabled state
  disabled: {
    opacity: 0.3,  // Reduced opacity for better contrast in black/white
  },
  
  // Text styles
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.background,  // Inverted color for contrast
    fontSize: Typography.body.fontSize,
  },
  secondaryText: {
    color: Colors.surface,
    fontSize: Typography.body.fontSize,
  },
  fabText: {
    color: Colors.background,  // Inverted color for contrast
    fontSize: 24,
  },
  
  // Size-specific text
  smallText: {
    fontSize: Typography.caption.fontSize,
  },
  mediumText: {
    fontSize: Typography.body.fontSize,
  },
  largeText: {
    fontSize: Typography.bodyLarge.fontSize,
  },
  
  disabledText: {
    color: Colors.disabled,
  },
});