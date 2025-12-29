/**
 * Mine Design System - Theme Provider
 * 
 * React context provider for the Mine design system theme.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { Theme, ThemeMode, getTheme } from './theme';

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  mode?: ThemeMode;
}

export function ThemeProvider({ children, mode = 'light' }: ThemeProviderProps) {
  const theme = getTheme(mode);

  const value: ThemeContextValue = {
    theme,
    themeMode: mode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Convenience hook to get just the theme object
export function useDesignTokens(): Theme {
  const { theme } = useTheme();
  return theme;
}