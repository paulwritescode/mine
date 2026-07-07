import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Design tokens for the Mine app.
///
/// Modeled on the MiniMax design language: a stark monochrome canvas
/// (black + white) broken open by saturated brand-color moments — with
/// the signature Brand Coral as the star accent. DM Sans across every
/// surface, pill-shaped buttons, and a flat, border-light system.
class AppTokens {
  AppTokens._();

  // ==========================================================================
  // COLORS — Monochrome anchor
  // ==========================================================================

  /// Pure black. Promo banners, hero displays, dominant CTA fill. (primary)
  static const Color inkStrong = Color(0xFF000000);

  /// Near-black brand anchor. Primary headline + CTA text. (ink)
  static const Color ink = Color(0xFF141414);

  /// Body text on light surfaces. (charcoal)
  static const Color charcoal = Color(0xFF2E2E2E);

  /// Secondary text, metadata. (slate)
  static const Color slate = Color(0xFF5C5C5C);

  /// Tertiary text, table headers, inactive sidebar. (steel)
  static const Color steel = Color(0xFF7A7A7A);

  /// Muted captions, inactive tab labels. (stone)
  static const Color stone = Color(0xFF969696);

  /// Footer links, de-emphasized labels. (muted)
  static const Color muted = Color(0xFFB0B0B0);

  /// Dominant CTA fill — the brand's black pill. (primary)
  static const Color primary = inkStrong;

  /// Text on primary/dark surfaces. (on-primary / on-dark)
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color onDark = Color(0xFFFFFFFF);

  // ==========================================================================
  // COLORS — Surface
  // ==========================================================================

  /// Primary page background and card surface. (canvas)
  static const Color canvas = Color(0xFFFFFFFF);

  /// Subtle section backgrounds, search-pill rest, active sidebar. (surface)
  static const Color surface = Color(0xFFF6F6F6);

  /// Quieter section divisions. (surface-soft)
  static const Color surfaceSoft = Color(0xFFFAFAFA);

  /// 1px input border, primary divider — used sparingly. (hairline)
  static const Color hairline = Color(0xFFE6E6E6);

  /// Quieter table-row divider, secondary section break. (hairline-soft)
  static const Color hairlineSoft = Color(0xFFF0F0F0);

  /// Dense footer canvas. (footer-bg)
  static const Color footerBg = Color(0xFF0A0A0A);

  // ==========================================================================
  // COLORS — Brand & accent (reserve for product-identity moments only)
  // ==========================================================================

  /// Signature high-impact accent — coral-red. The star of the system.
  static const Color brandCoral = Color(0xFFFF5A3C);

  /// Music/audio product identity. (brand-magenta)
  static const Color brandMagenta = Color(0xFFE63E96);

  /// Video product identity; primary blue accent. (brand-blue)
  static const Color brandBlue = Color(0xFF2F6BFF);

  /// Form-control activation, link emphasis. (brand-blue-deep)
  static const Color brandBlueDeep = Color(0xFF1D4ED8);

  /// Documentation tag / reference text. (brand-blue-700)
  static const Color brandBlue700 = Color(0xFF1D4ED8);

  /// Atmospheric blue for gradients / decorative wash. (brand-cyan)
  static const Color brandCyan = Color(0xFF46C4E6);

  /// Code badges, info-tag backgrounds. (brand-blue-200)
  static const Color brandBlue200 = Color(0xFFDCE9FF);

  /// Speech / purple product identity. (brand-purple)
  static const Color brandPurple = Color(0xFF6C4CF1);

  // ==========================================================================
  // COLORS — Semantic
  // ==========================================================================

  /// Pale-green wash for success badges. (success-bg)
  static const Color successBg = Color(0xFFE7F6EC);

  /// Deep-green ink for success labels. (success-text)
  static const Color successText = Color(0xFF1B7A43);

  /// Input border error state.
  static const Color error = Color(0xFFD45656);

  // Legacy semantic aliases (kept so existing screens keep compiling).
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = brandBlue;
  static const Color success = successText;
  static const Color textPrimary = ink;
  static const Color textSecondary = slate;
  static const Color textOnPrimary = onPrimary;
  static const Color textOnDark = onDark;

  // ==========================================================================
  // SPACING — 4px base, 8px primary increment
  // ==========================================================================

  static const double spaceXxs = 4.0; // xxs
  static const double spaceXs = 8.0; // xs
  static const double spaceSm = 12.0; // sm
  static const double spaceMd = 16.0; // md
  static const double spaceLg = 20.0; // lg
  static const double spaceXl = 24.0; // xl
  static const double spaceXxl = 32.0; // xxl
  static const double spaceXxxl = 40.0; // xxxl
  static const double spaceSectionSm = 48.0; // section-sm
  static const double spaceSection = 64.0; // section
  static const double spaceSectionLg = 80.0; // section-lg
  static const double spaceHero = 96.0; // hero

  // Legacy spacing aliases.
  static const double spacing4 = spaceXxs;
  static const double spacing8 = spaceXs;
  static const double spacing12 = spaceSm;
  static const double spacing16 = spaceMd;
  static const double spacing20 = spaceLg;
  static const double spacing24 = spaceXl;
  static const double spacing32 = spaceXxl;
  static const double spacing40 = spaceXxxl;
  static const double spacing48 = spaceSectionSm;
  static const double spacing64 = spaceSection;

  // ==========================================================================
  // BORDER RADIUS
  // ==========================================================================

  static const double radiusXs = 4.0; // code chips, micro-controls
  static const double radiusSm = 6.0; // compact controls, table cells
  static const double radiusMd = 8.0; // inputs, secondary buttons
  static const double radiusLg = 12.0; // documentation cards
  static const double radiusXl = 16.0; // standard feature cards
  static const double radiusXxl = 20.0; // larger feature panels
  static const double radiusXxxl = 24.0; // product-tile feature variants
  static const double radiusHero = 32.0; // vibrant gradient product cards
  static const double radiusFull = 9999.0; // all buttons, pills, badges

  // Legacy radius aliases.
  static const double radiusSmall = radiusXs;
  static const double radiusMedium = radiusMd;
  static const double radiusLarge = radiusLg;
  static const double radiusXLarge = radiusXl;
  static const double radiusRound = radiusFull;

  // ==========================================================================
  // ELEVATION — flat by default; shadows reserved for floating surfaces
  // ==========================================================================

  /// Level 1 (subtle) — hover-elevated tiles.
  static const List<BoxShadow> shadowSubtle = [
    BoxShadow(color: Color(0x0A000000), blurRadius: 2, offset: Offset(0, 1)),
  ];

  /// Level 2 (card) — standard feature cards, dropdowns.
  static const List<BoxShadow> shadowCard = [
    BoxShadow(color: Color(0x14000000), blurRadius: 6, offset: Offset(0, 4)),
  ];

  /// Level 3 (atmospheric) — diffuse glow on featured product cards.
  static const List<BoxShadow> shadowAtmospheric = [
    BoxShadow(color: Color(0x14000000), blurRadius: 22, offset: Offset(0, 0)),
  ];

  /// Level 4 (modal) — modals, sticky panels.
  static const List<BoxShadow> shadowModal = [
    BoxShadow(color: Color(0x14242424), blurRadius: 16, offset: Offset(0, 12)),
  ];

  // Legacy numeric elevation (Material elevation values).
  static const double elevationLow = 1.0;
  static const double elevationMedium = 2.0;
  static const double elevationHigh = 6.0;

  // ==========================================================================
  // ANIMATION
  // ==========================================================================

  static const Duration animationFast = Duration(milliseconds: 150);
  static const Duration animationMedium = Duration(milliseconds: 200);
  static const Duration animationSlow = Duration(milliseconds: 400);

  // ==========================================================================
  // TYPOGRAPHY — DM Sans across every role, weight-based emphasis
  // ==========================================================================

  static TextStyle _dm(
    double size,
    FontWeight weight, {
    double height = 1.5,
    double letterSpacing = 0,
    Color color = ink,
  }) {
    return GoogleFonts.dmSans(
      fontSize: size,
      fontWeight: weight,
      height: height,
      letterSpacing: letterSpacing,
      color: color,
    );
  }

  static TextStyle get heroDisplay =>
      _dm(80, FontWeight.w600, height: 1.10, letterSpacing: -2);
  static TextStyle get displayLg =>
      _dm(56, FontWeight.w600, height: 1.10, letterSpacing: -1.5);
  static TextStyle get headingLg =>
      _dm(40, FontWeight.w600, height: 1.20, letterSpacing: -1);
  static TextStyle get headingMd =>
      _dm(32, FontWeight.w600, height: 1.25, letterSpacing: -0.5);
  static TextStyle get headingSm => _dm(24, FontWeight.w600, height: 1.30);
  static TextStyle get cardTitle => _dm(20, FontWeight.w600, height: 1.40);
  static TextStyle get subtitle =>
      _dm(18, FontWeight.w500, height: 1.50, color: steel);
  static TextStyle get bodyMd => _dm(16, FontWeight.w400, color: charcoal);
  static TextStyle get bodyMdBold => _dm(16, FontWeight.w700, color: charcoal);
  static TextStyle get bodySm => _dm(14, FontWeight.w400, color: charcoal);
  static TextStyle get bodySmMedium => _dm(14, FontWeight.w500);
  static TextStyle get caption =>
      _dm(13, FontWeight.w400, height: 1.70, color: slate);
  static TextStyle get captionBold =>
      _dm(13, FontWeight.w600, color: steel);
  static TextStyle get micro => _dm(12, FontWeight.w400, color: stone);
  static TextStyle get buttonMd =>
      _dm(14, FontWeight.w600, height: 1.40, color: onPrimary);

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  /// Returns the appropriate text color for the given background color.
  static Color getTextColorForBackground(Color backgroundColor) {
    return backgroundColor.computeLuminance() > 0.5 ? ink : onDark;
  }

  /// Builds the app color scheme. Monochrome-anchored with coral as the
  /// accent; brand colors stay reserved for product-identity moments.
  static ColorScheme createColorScheme({bool isDark = false}) {
    if (isDark) {
      return const ColorScheme.dark(
        primary: Color(0xFFFFFFFF),
        onPrimary: inkStrong,
        secondary: brandCoral,
        onSecondary: onDark,
        surface: Color(0xFF0A0A0A),
        onSurface: Color(0xFFF6F6F6),
        surfaceContainerHighest: Color(0xFF161616),
        outline: Color(0xFF2A2A2A),
        outlineVariant: Color(0xFF1E1E1E),
        error: error,
      );
    }
    return const ColorScheme.light(
      primary: inkStrong,
      onPrimary: onPrimary,
      secondary: brandCoral,
      onSecondary: onDark,
      surface: canvas,
      onSurface: ink,
      surfaceContainerHighest: surface,
      outline: hairline,
      outlineVariant: hairlineSoft,
      error: error,
    );
  }
}
