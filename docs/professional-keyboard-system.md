# Professional-Grade Keyboard Avoidance System

> "Through wisdom is an house builded; and by understanding it is established" - Proverbs 24:3

This document outlines the professional-grade keyboard avoidance system implemented using the React Native Keyboard Controller 'Fake View' approach.

## Quick Start - Default Setup

For most screens, use our **standard configuration**:

```typescript
<KeyboardAvoidingContainer
  containerStyle={styles.content}
  contentContainerStyle={styles.scrollContent}
  hasToolbar={false}
  verticalOffset={0}
  showBlurBackground={true}
>
  {/* Your form content */}
</KeyboardAvoidingContainer>
```

📖 **See [Default Keyboard Setup](./default-keyboard-setup.md) for the complete standard configuration guide.**

## Architecture Overview

### The Foundation
Our keyboard system is built on three core principles:
1. **No Focus Jumping** - Inputs maintain focus during transitions
2. **No UI Flickering** - Smooth frame-by-frame animations
3. **No Content Covering** - Content is always visible above the keyboard

### Core Components

#### 1. useKeyboardController Hook
```typescript
const { keyboardHeight, isKeyboardVisible } = useKeyboardController({
  verticalOffset: 0,     // Additional offset
  hasToolbar: false      // Include 42px toolbar offset
});
```

**Features:**
- Frame-by-frame keyboard height tracking
- Configurable vertical offsets
- Worklet-based for 60fps performance
- Automatic toolbar compensation

#### 2. KeyboardSpacer Component
```typescript
<KeyboardSpacer 
  verticalOffset={0}
  hasToolbar={false}
/>
```

**Purpose:**
- Creates the "fake view" that pushes content up
- Animates smoothly with keyboard height
- Positioned at the bottom of the component tree
- Non-interactive (pointerEvents="none")

#### 3. KeyboardAvoidingContainer Component
```typescript
<KeyboardAvoidingContainer
  containerStyle={styles.container}
  contentContainerStyle={styles.content}
  hasToolbar={false}
  verticalOffset={0}
  showBlurBackground={true}
  blurIntensity={20}
>
  {/* Your content */}
</KeyboardAvoidingContainer>
```

**Architecture:**
- Main container with `flex: 1`
- Optional ScrollView for content
- Blur background that matches keyboard height
- KeyboardSpacer at the bottom
- Professional defaults applied

## Implementation Pattern

### Screen Structure
```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed header content */}
      <View style={styles.header}>
        <Text>Header</Text>
      </View>

      {/* Main content with keyboard avoidance */}
      <KeyboardAvoidingContainer
        containerStyle={styles.content}
        contentContainerStyle={styles.scrollContent}
        hasToolbar={false}
      >
        <MineInput placeholder="Input 1" />
        <MineInput placeholder="Input 2" />
        <MineInput placeholder="Input 3" multiline />
      </KeyboardAvoidingContainer>

      {/* Fixed footer content */}
      <View style={styles.footer}>
        <Button title="Submit" />
      </View>
    </SafeAreaView>
  );
}
```

### Key Principles

1. **Container Structure**
   - Main container: `flex: 1`
   - Content area: Scrollable if needed
   - Spacer: At the very bottom

2. **Input Optimization**
   - `textAlignVertical="top"` for Android
   - `blurOnSubmit={false}` to prevent focus jumping
   - Proper return key handling

3. **Animation Performance**
   - Worklet-based calculations
   - Shared values for 60fps
   - Frame-by-frame updates

## Advanced Configuration

### With Bottom Toolbar
```typescript
<KeyboardAvoidingContainer hasToolbar={true}>
  {/* Content */}
</KeyboardAvoidingContainer>
```

### Custom Vertical Offset
```typescript
<KeyboardAvoidingContainer verticalOffset={20}>
  {/* Content */}
</KeyboardAvoidingContainer>
```

### Non-Scrolling Content
```typescript
<KeyboardAvoidingContainer scrollEnabled={false}>
  {/* Fixed layout content */}
</KeyboardAvoidingContainer>
```

## Migration Guide

### From KeyboardAwareForm
```typescript
// Before
<KeyboardAwareForm showToolbar={false}>
  <MineInput />
</KeyboardAwareForm>

// After
<KeyboardAvoidingContainer hasToolbar={false}>
  <MineInput />
</KeyboardAvoidingContainer>
```

### From KeyboardAvoidingView
```typescript
// Before
<KeyboardAvoidingView behavior="padding">
  <ScrollView>
    <MineInput />
  </ScrollView>
</KeyboardAvoidingView>

// After
<KeyboardAvoidingContainer>
  <MineInput />
</KeyboardAvoidingContainer>
```

## Benefits

### Performance
- **60fps animations** using Reanimated worklets
- **No JavaScript bridge** for keyboard events
- **Minimal re-renders** with shared values

### User Experience
- **Smooth transitions** without jarring movements
- **Consistent behavior** across iOS and Android
- **Professional feel** matching native apps

### Developer Experience
- **Simple API** with sensible defaults
- **Flexible configuration** for edge cases
- **TypeScript support** with full type safety

## Troubleshooting

### Common Issues

1. **Content not moving up**
   - Ensure KeyboardSpacer is at the bottom
   - Check container has `flex: 1`
   - Verify KeyboardProvider is in root

2. **Jerky animations**
   - Confirm Reanimated is properly configured
   - Check for console.log in render cycles
   - Verify worklet usage

3. **Focus jumping**
   - Ensure `blurOnSubmit={false}` on inputs
   - Check for component re-mounting
   - Verify stable references

### Debug Tools
```typescript
const { keyboardHeight, getRawHeight } = useKeyboardController();

// In development
console.log('Keyboard height:', getRawHeight());
```

## Examples

See `src/examples/ProfessionalKeyboardExample.tsx` for a complete implementation example.

---

*Built with wisdom and understanding, this keyboard system provides a solid foundation for professional React Native applications.*