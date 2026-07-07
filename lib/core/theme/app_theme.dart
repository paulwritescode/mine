import 'package:flutter/material.dart';
import 'tokens.dart';

/// Builds the app's light and dark themes from [AppTokens].
///
/// Design intent (MiniMax language): a minimal, border-light system —
/// flat white cards, black pill CTAs, borderless filled inputs, DM Sans
/// everywhere, and Brand Coral reserved as the single signature accent.
class AppTheme {
  AppTheme._();

  static ThemeData get lightTheme => _build(isDark: false);
  static ThemeData get darkTheme => _build(isDark: true);

  static ThemeData _build({required bool isDark}) {
    final colorScheme = AppTokens.createColorScheme(isDark: isDark);
    final onBg = colorScheme.onSurface;

    // Pill button label — recolored per surface at call sites where needed.
    ButtonStyle pill({
      required Color background,
      required Color foreground,
      BorderSide? side,
    }) {
      return ButtonStyle(
        backgroundColor: WidgetStatePropertyAll(background),
        foregroundColor: WidgetStatePropertyAll(foreground),
        elevation: const WidgetStatePropertyAll(0),
        shadowColor: const WidgetStatePropertyAll(Colors.transparent),
        overlayColor:
            WidgetStatePropertyAll(foreground.withValues(alpha: 0.08)),
        padding: const WidgetStatePropertyAll(
          EdgeInsets.symmetric(
            horizontal: AppTokens.spaceXl,
            vertical: AppTokens.spaceSm,
          ),
        ),
        textStyle: WidgetStatePropertyAll(AppTokens.buttonMd),
        side: side == null ? null : WidgetStatePropertyAll(side),
        shape: const WidgetStatePropertyAll(
          StadiumBorder(),
        ),
        minimumSize: const WidgetStatePropertyAll(Size(0, 44)),
      );
    }

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: colorScheme.surface,
      textTheme: _textTheme(isDark: isDark),
      // Coral is the accent that "wins" on selection controls.
      splashColor: AppTokens.brandCoral.withValues(alpha: 0.10),
      highlightColor: AppTokens.brandCoral.withValues(alpha: 0.06),
      dividerTheme: DividerThemeData(
        color: isDark ? colorScheme.outlineVariant : AppTokens.hairlineSoft,
        thickness: 1,
        space: 1,
      ),

      // -- App bar: flat, borderless, editorial ------------------------------
      appBarTheme: AppBarTheme(
        backgroundColor: colorScheme.surface,
        foregroundColor: onBg,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: AppTokens.cardTitle.copyWith(color: onBg),
      ),

      // -- Cards: flat white, generous radius, NO default border -------------
      cardTheme: CardThemeData(
        elevation: 0,
        margin: EdgeInsets.zero,
        color: colorScheme.surface == AppTokens.canvas
            ? AppTokens.canvas
            : colorScheme.surfaceContainerHighest,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppTokens.radiusXl),
        ),
        clipBehavior: Clip.antiAlias,
      ),

      // -- Buttons: pill-shaped everywhere -----------------------------------
      // Primary: black fill, white label — the dominant CTA.
      filledButtonTheme: FilledButtonThemeData(
        style: pill(
          background: colorScheme.primary,
          foreground: colorScheme.onPrimary,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: pill(
          background: colorScheme.primary,
          foreground: colorScheme.onPrimary,
        ),
      ),
      // Secondary: outlined pill.
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: pill(
          background: Colors.transparent,
          foreground: onBg,
          side: BorderSide(color: onBg),
        ),
      ),
      // Tertiary / inline text pill.
      textButtonTheme: TextButtonThemeData(
        style: pill(
          background: Colors.transparent,
          foreground: onBg,
        ),
      ),

      // -- FAB: the one Brand Coral signature moment -------------------------
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: AppTokens.brandCoral,
        foregroundColor: AppTokens.onDark,
        elevation: 0,
        focusElevation: 0,
        hoverElevation: 0,
        highlightElevation: 0,
        shape: const StadiumBorder(),
        extendedTextStyle: AppTokens.buttonMd,
      ),

      // -- Inputs: borderless filled pill-soft fields ------------------------
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: isDark
            ? colorScheme.surfaceContainerHighest
            : AppTokens.surface,
        hintStyle: AppTokens.bodySm.copyWith(color: AppTokens.stone),
        labelStyle: AppTokens.bodySm.copyWith(color: AppTokens.slate),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppTokens.spaceMd,
          vertical: AppTokens.spaceSm,
        ),
        // No border at rest — the fill alone defines the field.
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTokens.radiusMd),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTokens.radiusMd),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTokens.radiusMd),
          borderSide: const BorderSide(
            color: AppTokens.brandBlueDeep,
            width: 2,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTokens.radiusMd),
          borderSide: const BorderSide(color: AppTokens.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTokens.radiusMd),
          borderSide: const BorderSide(color: AppTokens.error, width: 2),
        ),
      ),

      // -- Chips: pill tabs / tags -------------------------------------------
      chipTheme: ChipThemeData(
        backgroundColor: AppTokens.surface,
        selectedColor: colorScheme.primary,
        secondarySelectedColor: colorScheme.primary,
        labelStyle: AppTokens.bodySmMedium.copyWith(color: onBg),
        secondaryLabelStyle:
            AppTokens.bodySmMedium.copyWith(color: colorScheme.onPrimary),
        side: BorderSide.none,
        shape: const StadiumBorder(),
        padding: const EdgeInsets.symmetric(
          horizontal: AppTokens.spaceMd,
          vertical: AppTokens.spaceXs,
        ),
      ),

      // -- Bottom navigation: flat, borderless -------------------------------
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: colorScheme.surface,
        selectedItemColor: onBg,
        unselectedItemColor: AppTokens.steel,
        selectedLabelStyle: AppTokens.micro.copyWith(color: onBg),
        unselectedLabelStyle: AppTokens.micro,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: colorScheme.surface,
        indicatorColor: AppTokens.brandCoral.withValues(alpha: 0.14),
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        labelTextStyle: WidgetStatePropertyAll(AppTokens.micro),
      ),

      // -- Misc --------------------------------------------------------------
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppTokens.canvas,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(AppTokens.radiusXxl),
          ),
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: isDark ? colorScheme.surface : AppTokens.canvas,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppTokens.radiusXl),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppTokens.ink,
        contentTextStyle: AppTokens.bodySm.copyWith(color: AppTokens.onDark),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppTokens.radiusMd),
        ),
      ),
    );
  }

  static TextTheme _textTheme({required bool isDark}) {
    final base = TextTheme(
      displayLarge: AppTokens.heroDisplay,
      displayMedium: AppTokens.displayLg,
      displaySmall: AppTokens.headingLg,
      headlineLarge: AppTokens.headingMd,
      headlineMedium: AppTokens.headingSm,
      headlineSmall: AppTokens.cardTitle,
      titleLarge: AppTokens.cardTitle,
      titleMedium: AppTokens.bodyMdBold.copyWith(color: AppTokens.ink),
      titleSmall: AppTokens.bodySmMedium,
      bodyLarge: AppTokens.bodyMd,
      bodyMedium: AppTokens.bodySm,
      bodySmall: AppTokens.caption,
      labelLarge: AppTokens.buttonMd.copyWith(color: AppTokens.ink),
      labelMedium: AppTokens.captionBold,
      labelSmall: AppTokens.micro,
    );
    if (!isDark) return base;
    // Flip ink-toned styles to light for dark surfaces.
    return base.apply(
      bodyColor: AppTokens.onDark,
      displayColor: AppTokens.onDark,
    );
  }
}
