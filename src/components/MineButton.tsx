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
          color={variant === 'primary' ? Colors.white : Colors.sage} 
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
    backgroundColor: Colors.sage,
    borderRadius: BorderRadius.xxl,
    ...Shadows.card,
  },
  secondary: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sage,
  },
  fab: {
    backgroundColor: Colors.sage,
    borderRadius: TouchTargets.fab / 2,
    width: TouchTargets.fab,
    height: TouchTargets.fab,
    ...Shadows.fab,
  },
  
  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: TouchTargets.button,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 64,
  },
  
  // Disabled state
  disabled: {
    opacity: 0.5,
  },
  
  // Text styles
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.white,
    fontSize: Typography.body.fontSize,
  },
  secondaryText: {
    color: Colors.sage,
    fontSize: Typography.body.fontSize,
  },
  fabText: {
    color: Colors.white,
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