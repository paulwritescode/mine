/**
 * Mine Design System - Core Design Tokens
 * 
 * Neo-Minimalist 'Soft-Tech' aesthetic with high-contrast dual-tone design.
 * Inspired by premium financial apps and modern minimalism.
 */

export const Colors = {
  // Core Soft-Tech Palette
  black: '#000000',      // Pure black - primary brand color
  white: '#FFFFFF',      // Pure white - contrast color
  mint: '#D1EDC0',       // Mint accent - signature brand color
  softWhite: '#FAF4F1',  // Soft white background - warm neutral
  offWhite: '#F8F8F8',   // Off white for subtle backgrounds
  
  // Semantic colors for different contexts
  background: '#FFFFFF',     // Pure white background
  surface: '#FFFFFF',        // Pure white surfaces/cards
  surfaceElevated: '#FFFFFF', // Elevated surfaces
  
  // Text colors with high contrast
  textPrimary: '#000000',    // Black text on light backgrounds
  textSecondary: '#666666',  // Medium gray for secondary text
  textTertiary: '#999999',   // Light gray for tertiary text
  textInverse: '#FFFFFF',    // White text on dark backgrounds
  
  // Border and divider colors
  border: '#E5E5E5',         // Light gray borders
  borderStrong: '#000000',   // Strong black borders for emphasis
  disabled: '#CCCCCC',       // Disabled state color
  
  // Functional Colors - high contrast
  success: '#00AA00',        // Green for success states
  error: '#FF0000',          // Red for error states
  warning: '#FF8800',        // Orange for warning states
  info: '#0088FF',           // Blue for info states
  
  // Accent variations
  mintLight: '#E8F5DC',      // Lighter mint for subtle backgrounds
  mintDark: '#B8D4A0',       // Darker mint for hover states
  
  // Project type colors
  sage: '#87A96B',           // Sage green for timeline projects
  lavender: '#B19CD9',       // Lavender purple for freestyle projects
} as const;

export const Spacing = {
  xs: 4,   // Tight spacing for inline elements
  sm: 8,   // Close spacing within components
  md: 16,  // Standard spacing between elements
  lg: 24,  // Generous spacing between sections (as specified)
  xl: 32,  // Major spacing for layout sections
  xxl: 48  // Hero spacing for major separations
} as const;

export const BorderRadius = {
  xs: 4,   // Small elements like badges
  sm: 8,   // Buttons and small components
  md: 16,  // Standard buttons (as specified)
  lg: 24,  // Medium cards and containers
  xl: 32,  // Large containers/cards (as specified)
  xxl: 40, // Extra large elements
  circle: 50 // Perfect circles (percentage)
} as const;

export const Typography = {
  // Headlines - Inter Bold with tight letter spacing
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 40
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 28
  },
  
  // Body text - Inter Regular
  bodyLarge: {
    fontSize: 18,
    fontWeight: 'normal' as const,
    fontFamily: 'Inter-Regular',
    color: Colors.textPrimary,
    lineHeight: 26
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    fontFamily: 'Inter-Regular',
    color: Colors.textPrimary,
    lineHeight: 24
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20
  },
  
  // Captions and metadata
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    fontFamily: 'Inter-Regular',
    color: Colors.textTertiary,
    lineHeight: 16
  },
  
  // Special styles for financial-grade displays
  display: {
    fontSize: 48,
    fontWeight: 'bold' as const,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    letterSpacing: -1,
    lineHeight: 56
  }
} as const;

export const Shadows = {
  // Subtle shadows for floating elements
  card: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  fab: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  floating: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
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
  minimum: 44,    // Minimum touch target size
  button: 56,     // Standard button height
  buttonLarge: 64, // Large button height
  fab: 80,        // Large FAB size (as specified for record button)
  timeline: 70    // Timeline bubble size (as specified)
} as const;