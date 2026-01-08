import 'package:flutter/material.dart';

/// Design tokens for the Mine app
/// Contains color palette, typography, spacing, and other design constants
class AppTokens {
  // Private constructor to prevent instantiation
  AppTokens._();

  // ============================================================================
  // COLOR PALETTE
  // ============================================================================
  
  /// Primary color palette based on the provided design
  static const Color primary900 = Color(0xFF051F20); // Darkest green
  static const Color primary800 = Color(0xFF0B2B26); // Dark green
  static const Color primary700 = Color(0xFF163832); // Medium dark green
  static const Color primary600 = Color(0xFF235347); // Medium green
  static const Color primary500 = Color(0xFF8EB69B); // Light green
  static const Color primary400 = Color(0xFFDAF1DE); // Very light green
  
  /// Semantic colors
  static const Color backgroundLight = Color(0xFFFFFFFF);
  static const Color backgroundDark = primary900;
  static const Color surface = Color(0xFFF8F9FA);
  static const Color surfaceDark = primary800;
  
  /// Text colors
  static const Color textPrimary = Color(0xFF1A1A1A);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textOnPrimary = Color(0xFFFFFFFF);
  static const Color textOnDark = Color(0xFFFFFFFF);
  
  /// Status colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);
  
  // ============================================================================
  // SPACING
  // ============================================================================
  
  static const double spacing4 = 4.0;
  static const double spacing8 = 8.0;
  static const double spacing12 = 12.0;
  static const double spacing16 = 16.0;
  static const double spacing20 = 20.0;
  static const double spacing24 = 24.0;
  static const double spacing32 = 32.0;
  static const double spacing40 = 40.0;
  static const double spacing48 = 48.0;
  static const double spacing64 = 64.0;
  
  // ============================================================================
  // BORDER RADIUS
  // ============================================================================
  
  static const double radiusSmall = 4.0;
  static const double radiusMedium = 8.0;
  static const double radiusLarge = 12.0;
  static const double radiusXLarge = 16.0;
  static const double radiusRound = 999.0;
  
  // ============================================================================
  // ELEVATION
  // ============================================================================
  
  static const double elevationLow = 2.0;
  static const double elevationMedium = 4.0;
  static const double elevationHigh = 8.0;
  
  // ============================================================================
  // ANIMATION DURATIONS
  // ============================================================================
  
  static const Duration animationFast = Duration(milliseconds: 150);
  static const Duration animationMedium = Duration(milliseconds: 300);
  static const Duration animationSlow = Duration(milliseconds: 500);
  
  // ============================================================================
  // HELPER METHODS
  // ============================================================================
  
  /// Returns the appropriate text color for the given background color
  static Color getTextColorForBackground(Color backgroundColor) {
    final luminance = backgroundColor.computeLuminance();
    return luminance > 0.5 ? textPrimary : textOnDark;
  }
  
  /// Creates a color scheme for the app theme
  static ColorScheme createColorScheme({bool isDark = false}) {
    if (isDark) {
      return ColorScheme.dark(
        primary: primary500,
        primaryContainer: primary900, // Use primary900 for cards in dark mode
        secondary: primary600,
        secondaryContainer: primary800,
        surface: Colors.black, // System black for background
        onSurface: Colors.white, // White text on black background
        error: error,
      );
    } else {
      return ColorScheme.light(
        primary: primary700,
        primaryContainer: primary400, // Use primary400 for cards in light mode
        secondary: primary600,
        secondaryContainer: primary500,
        surface: Colors.white, // System white for background
        onSurface: Colors.black, // Dark text on white background
        error: error,
      );
    }
  }
}