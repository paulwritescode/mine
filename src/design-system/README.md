# Mine Design System

The Mine design system provides a consistent, accessible, and beautiful foundation for the Mine video journaling app. It embodies a calm, privacy-first aesthetic with sage green and lavender accents.

## Core Principles

- **Privacy-First Aesthetic**: Clean, uncluttered interfaces that feel like a personal journal
- **Calm Growth**: Sage green evokes serene daily habits and natural progression
- **Gentle Delight**: Lavender adds subtle creativity for celebratory moments
- **Clarity**: White backgrounds ensure video content is the hero

## Usage

```typescript
import { useDesignTokens, Colors, Spacing } from '@/src/design-system';

// In a component
function MyComponent() {
  const tokens = useDesignTokens();
  
  return (
    <View style={{
      backgroundColor: tokens.colors.white,
      padding: tokens.spacing.md,
      borderRadius: tokens.borderRadius.lg
    }}>
      {/* Component content */}
    </View>
  );
}
```

## Design Tokens

### Colors
- **Primary (70%)**: White (#FFFFFF), Off-white (#FAFAFA)
- **Secondary (30%)**: Sage green (#9CAF88) and variants
- **Accent (10%)**: Lavender (#B8A4D5) and variants
- **Neutrals**: Text colors, borders, disabled states
- **Functional**: Success, error, warning, info

### Spacing (8px Grid)
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, xxl: 48px

### Typography
- H1: 32px Bold, H2: 24px Semibold, H3: 18px Semibold
- Body Large: 16px, Body: 14px, Caption: 12px

### Border Radius
- xs: 4px (badges), sm: 8px (thumbnails), md: 12px (inputs)
- lg: 16px (cards), xl: 24px (bottom sheets), xxl: 32px (buttons)
- circle: 50% (FABs, avatars)

## Components

### MineButton
A versatile button component with three variants:
- **Primary**: Sage background, white text
- **Secondary**: White background, sage border/text
- **FAB**: Circular floating action button

```typescript
<MineButton variant="primary" onPress={handlePress}>
  Save Project
</MineButton>
```

## Accessibility

All components meet WCAG 2.1 AA standards:
- Minimum 44x44px touch targets
- 4.5:1 contrast ratios for text
- Semantic structure for screen readers
- Proper focus indicators