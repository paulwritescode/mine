/**
 * Mine Design System - Theme Configuration
 * 
 * Soft-Tech minimalist theme with high-contrast dual-tone design.
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

// Light theme - Soft-Tech aesthetic (primary theme)
export const lightTheme: Theme = {
  colors: {
    ...Colors,
    background: Colors.white,          // Pure white background
    surface: Colors.white,             // Pure white surfaces
    surfaceElevated: Colors.white,     // White elevated surfaces
    textPrimary: Colors.black,         // Black text
    textSecondary: Colors.textSecondary, // Gray secondary text
    textTertiary: Colors.textTertiary,   // Light gray tertiary text
    textInverse: Colors.white,         // White text for dark surfaces
    border: Colors.border,             // Light borders
    borderStrong: Colors.borderStrong, // Strong black borders
  },
  spacing: Spacing,
  borderRadius: BorderRadius,
  typography: Typography,
  shadows: Shadows,
  zIndex: ZIndex,
  animation: Animation,
  touchTargets: TouchTargets
};

// Dark theme - High contrast version
export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...Colors,
    background: Colors.black,          // Black background
    surface: Colors.black,             // Black surfaces
    surfaceElevated: Colors.black,     // Black elevated surfaces
    textPrimary: Colors.white,         // White text
    textSecondary: '#CCCCCC',          // Light gray secondary text
    textTertiary: '#999999',           // Gray tertiary text
    textInverse: Colors.black,         // Black text for light surfaces
    border: '#333333',                 // Dark borders
    borderStrong: Colors.white,        // Strong white borders
  }
};

export type ThemeMode = 'light' | 'dark' | 'system';

export const getTheme = (mode: ThemeMode = 'light'): Theme => {
  switch (mode) {
    case 'dark':
      return darkTheme;
    case 'light':
    case 'system': // Default to light for the Soft-Tech aesthetic
    default:
      return lightTheme;
  }
};