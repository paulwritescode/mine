# Mine - Soft-Tech Design System

## Overview

Mine has been upgraded to a premium "Soft-Tech" aesthetic inspired by high-end financial applications and modern minimalism. This design system emphasizes ultra-rounded corners, stark high contrast, and a signature mint accent color.

## Core Principles

### 1. Dual-Tone Philosophy
- **High Contrast**: Pure black (#000000) paired with mint accent (#D1EDC0)
- **Soft Background**: Warm soft white (#FAF4F1) for comfortable viewing
- **Financial-Grade Typography**: Inter font family with precise letter spacing

### 2. Generous Spacing
- **24px spacing** between major elements for breathing room
- **32px border radius** for large containers and cards
- **16px border radius** for buttons and smaller elements

### 3. Premium Interactions
- Subtle scale animations using react-native-reanimated
- Haptic feedback on all interactive elements
- Floating elements with sophisticated shadows

## Color Palette

```typescript
export const Colors = {
  // Core Soft-Tech Palette
  black: '#000000',      // Pure black - primary brand color
  white: '#FFFFFF',      // Pure white - contrast color
  mint: '#D1EDC0',       // Mint accent - signature brand color
  softWhite: '#FAF4F1',  // Soft white background - warm neutral
  
  // Semantic Usage
  background: '#FAF4F1',     // Main app background
  surface: '#FFFFFF',        // Card and surface backgrounds
  textPrimary: '#000000',    // Primary text color
  textSecondary: '#666666',  // Secondary text with good contrast
  textTertiary: '#999999',   // Tertiary text for subtle information
}
```

## Typography

All text uses the **Inter** font family with specific weight and spacing configurations:

- **Headlines**: Inter-Bold with -0.5px letter spacing
- **Body Text**: Inter-Regular with optimized line heights
- **Display Text**: Large Inter-Bold for financial-grade displays (timers, counters)

## Key Components

### 1. DualToneProjectCard

The signature component featuring:
- **Top Half**: Black background with white title text
- **Bottom Half**: Mint background with black metadata text
- **Height**: 200px with 32px border radius
- **Animation**: Subtle scale-up effect on press
- **Overlay**: 10% opacity sunburst pattern on black section

```tsx
<DualToneProjectCard
  project={project}
  snippetCount={14}
  totalDuration={168}
  onPress={handleProjectPress}
/>
```

### 2. TimelineBubbleFlow

High-contrast timeline with bubble flow design:
- **Captured Days**: 70px circular video thumbnail with 4px mint border
- **Empty Days**: 70px circle with black outline and centered date
- **Spacing**: Generous 24px spacing between elements
- **Layouts**: Horizontal or vertical flow options

```tsx
<TimelineBubbleFlow
  days={timelineData}
  onDayPress={handleDayPress}
  orientation="horizontal"
/>
```

### 3. FinancialGradeCaptureUI

Premium capture interface with financial-grade aesthetics:
- **Background**: Pure black for camera chrome
- **Record Button**: Large 80px white circle with black center
- **Timer**: Floating numeric countdown in Inter-Bold
- **Animations**: Pulse effects and scale interactions

```tsx
<FinancialGradeCaptureUI
  isRecording={isRecording}
  recordingDuration={duration}
  onRecordPress={handleRecord}
  onStopPress={handleStop}
/>
```

### 4. FloatingTabBar

Pill-shaped tab bar with elevated capture button:
- **Background**: Soft white with 32px top-corner radius
- **Capture Button**: Floating black circle elevated above tab bar
- **Shadow**: Subtle floating shadow for depth
- **Animation**: Scale effects on all interactions

```tsx
<FloatingTabBar
  tabs={tabItems}
  onTabPress={handleTabPress}
  onCapturePress={handleCapture}
/>
```

### 5. ThemedText

Theme-aware text component for consistent rendering:
- Automatically switches colors based on theme mode
- Supports all typography variants
- Ensures readability in both light and dark modes

```tsx
<ThemedText variant="h1" color="primary">
  My Projects
</ThemedText>
```

## Layout Guidelines

### Spacing System
- **xs**: 4px - Tight spacing for inline elements
- **sm**: 8px - Close spacing within components  
- **md**: 16px - Standard spacing between elements
- **lg**: 24px - Generous spacing between sections (key spacing)
- **xl**: 32px - Major spacing for layout sections
- **xxl**: 48px - Hero spacing for major separations

### Border Radius System
- **xs**: 4px - Small elements like badges
- **sm**: 8px - Buttons and small components
- **md**: 16px - Standard buttons
- **lg**: 24px - Medium cards and containers
- **xl**: 32px - Large containers/cards (signature radius)
- **circle**: 50% - Perfect circles

### Touch Targets
- **minimum**: 44px - Minimum touch target size
- **button**: 56px - Standard button height
- **fab**: 80px - Large FAB size (record button)
- **timeline**: 70px - Timeline bubble size

## Animation Guidelines

### Scale Animations
```typescript
const scale = useSharedValue(1);

const handlePressIn = () => {
  scale.value = withSpring(0.98, {
    damping: 15,
    stiffness: 300,
  });
};
```

### Haptic Feedback
- **Light**: For subtle interactions (tab switches, small buttons)
- **Medium**: For primary actions (record button, main CTAs)
- **Heavy**: For significant state changes (project creation)

## Implementation Notes

### Theme Integration
The design system is fully integrated with React Context for theme switching:

```tsx
const { theme } = useTheme();
const styles = createStyles(theme);
```

### Accessibility
- High contrast ratios for all text combinations
- Minimum 44px touch targets
- Semantic color usage with proper fallbacks
- Screen reader friendly component structure

### Performance
- Optimized animations using react-native-reanimated
- Efficient re-renders with proper memoization
- Minimal shadow usage for better performance

## Migration Guide

### From Legacy Components
1. Replace `MineCard` with `DualToneProjectCard`
2. Update color references to use theme-aware colors
3. Replace static `Text` with `ThemedText`
4. Update spacing to use the new generous 24px system
5. Replace FABs with `FloatingTabBar` capture button

### Color Migration
```typescript
// Old
backgroundColor: Colors.sage

// New  
backgroundColor: theme.colors.mint
```

### Typography Migration
```typescript
// Old
<Text style={styles.title}>Title</Text>

// New
<ThemedText variant="h2">Title</ThemedText>
```

This Soft-Tech design system elevates Mine to a premium, professional aesthetic while maintaining excellent usability and accessibility standards.