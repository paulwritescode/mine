/**
 * Mine Design System - Core Design Tokens
 * 
 * This file contains the foundational design tokens for the Mine video journaling app.
 * Based on the calm, privacy-first aesthetic with sage green and lavender accents.
 */

export const Colors = {
  // Primary Colors (70% Usage - White/Off-White)
  white: '#FFFFFF',
  offWhite: '#FAFAFA',
  
  // Secondary Colors (30% Usage - Sage Green)  
  sage: '#9CAF88',
  sageLight: '#B8C9A8',
  sageDark: '#7A9A6E',
  
  // Accent Colors (10% Usage - Lavender)
  lavender: '#B8A4D5',
  lavenderLight: '#D4C8E8', 
  lavenderDark: '#9B87C0',
  
  // Neutrals
  textPrimary: '#2C2C2C',
  textSecondary: '#6B6B6B',
  border: '#E0E0E0',
  disabled: '#BDBDBD',
  
  // Functional Colors
  success: '#7A9A6E', // Using dark sage
  error: '#D97979',   // Soft red, non-alarming
  warning: '#E8C896', // Warm amber
  info: '#9BB8D5'     // Calm blue
} as const;

export const Spacing = {
  xs: 4,   // Tight spacing (icon-to-text gaps)
  sm: 8,   // Close spacing (within buttons/chips)  
  md: 16,  // Standard spacing (element padding, list items)
  lg: 24,  // Section spacing (between cards/groups)
  xl: 32,  // Major spacing (screen sections, modal padding)
  xxl: 48  // Hero spacing (top margins for immersive feel)
} as const;

export const BorderRadius = {
  xs: 4,   // Badges and tags
  sm: 8,   // Thumbnails, chips, small buttons
  md: 12,  // Inputs, calendar cells, secondary buttons
  lg: 16,  // Cards, modals, project cards
  xl: 24,  // Bottom sheet top corners
  xxl: 32, // Primary buttons (pill-shaped)
  circle: 50 // Record button, avatars (percentage)
} as const;

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 48
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 36
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    lineHeight: 27
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    color: Colors.textPrimary,
    lineHeight: 24
  },
  body: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    color: Colors.textPrimary,
    lineHeight: 21
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    color: Colors.textSecondary,
    lineHeight: 18
  }
} as const;

export const Shadows = {
  card: {
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
    elevation: 2, // Android
  },
  fab: {
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
    elevation: 6, // Android
  }
} as const;

export const ZIndex = {
  background: 0,    // Backgrounds (white surfaces)
  content: 1,       // Content (cards/lists)
  sticky: 2,        // Sticky headers/tabs
  fab: 3,           // FABs (floating action buttons)
  bottomSheet: 4,   // Bottom sheets
  modal: 5,         // Modals
  toast: 6          // Toasts and notifications
} as const;

export const Animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in'
  }
} as const;

export const TouchTargets = {
  minimum: 44, // Minimum touch target size (44x44px)
  button: 56,  // Standard button height
  fab: 64      // FAB size
} as const;