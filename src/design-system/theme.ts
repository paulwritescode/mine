/**
 * Mine Design System - Theme Configuration
 * 
 * Provides theme context and utilities for the Mine app design system.
 */

import { Colors, Spacing, BorderRadius, Typography, Shadows, ZIndex, Animation, TouchTargets } from './tokens';

export interface Theme {
  colors: typeof Colors;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  typography: typeof Typography;
  shadows: typeof Shadows;
  zIndex: typeof ZIndex;
  animation: typeof Animation;
  touchTargets: typeof TouchTargets;
}

export const lightTheme: Theme = {
  colors: Colors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  typography: Typography,
  shadows: Shadows,
  zIndex: ZIndex,
  animation: Animation,
  touchTargets: TouchTargets
};

// Dark theme adjustments (for future implementation)
export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...Colors,
    // Adjust colors for dark mode
    white: '#121212' as any,
    offWhite: '#1E1E1E' as any,
    textPrimary: '#E0E0E0' as any,
    textSecondary: '#BDBDBD' as any,
    border: '#333333' as any,
    // Sage and lavender remain the same for brand consistency
  }
};

export type ThemeMode = 'light' | 'dark' | 'system';

export const getTheme = (mode: ThemeMode = 'light'): Theme => {
  switch (mode) {
    case 'dark':
      return darkTheme;
    case 'light':
    default:
      return lightTheme;
  }
};