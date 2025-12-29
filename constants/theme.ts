/**
 * Legacy theme constants for Expo Router compatibility
 * 
 * This file maintains compatibility with existing Expo Router theming
 * while integrating with the Mine design system.
 */

import { Platform } from 'react-native';
import { Colors as DesignColors } from '@/src/design-system';

// Use sage green as the primary tint color
const tintColorLight = DesignColors.sage;
const tintColorDark = DesignColors.white;

export const Colors = {
  light: {
    text: DesignColors.textPrimary,
    background: DesignColors.white,
    tint: tintColorLight,
    icon: DesignColors.textSecondary,
    tabIconDefault: DesignColors.textSecondary,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: DesignColors.white,
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
