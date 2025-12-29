/**
 * ThemedText - Theme-aware text component
 * 
 * Automatically switches between black and white text based on theme mode.
 * Ensures text is always readable in both light and dark modes.
 */

import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../design-system';

export interface ThemedTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'bodyLarge' | 'body' | 'bodySmall' | 'caption' | 'display';
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse';
  style?: TextStyle;
}

export function ThemedText({
  variant = 'body',
  color = 'primary',
  style,
  children,
  ...props
}: ThemedTextProps) {
  const { theme } = useTheme();

  const getTextColor = () => {
    switch (color) {
      case 'primary':
        return theme.colors.textPrimary;
      case 'secondary':
        return theme.colors.textSecondary;
      case 'tertiary':
        return theme.colors.textTertiary;
      case 'inverse':
        return theme.colors.textInverse;
      default:
        return theme.colors.textPrimary;
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return theme.typography.h1;
      case 'h2':
        return theme.typography.h2;
      case 'h3':
        return theme.typography.h3;
      case 'bodyLarge':
        return theme.typography.bodyLarge;
      case 'body':
        return theme.typography.body;
      case 'bodySmall':
        return theme.typography.bodySmall;
      case 'caption':
        return theme.typography.caption;
      case 'display':
        return theme.typography.display;
      default:
        return theme.typography.body;
    }
  };

  const textStyle = [
    getVariantStyle(),
    { color: getTextColor() },
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
}