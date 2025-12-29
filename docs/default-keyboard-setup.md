# Default Keyboard Setup - Mine App Standard

> "Through wisdom is an house builded; and by understanding it is established" - Proverbs 24:3

This document defines the **standard keyboard configuration** for the Mine app. Use this as the default setup for all screens with keyboard input.

## 🎯 Standard Configuration

### Default Implementation
```typescript
import { KeyboardAvoidingContainer } from '@/src/components';

export default function MyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed header */}
      <View style={styles.header}>
        <Text>Header Content</Text>
      </View>

      {/* Main content with keyboard avoidance */}
      <KeyboardAvoidingContainer
        containerStyle={styles.content}
        contentContainerStyle={styles.scrollContent}
        hasToolbar={false}
        verticalOffset={0}
        showBlurBackground={true}
        blurIntensity={20}
      >
        {/* Your form content */}
        <TextInput placeholder="Input field" />
      </KeyboardAvoidingContainer>

      {/* Fixed footer */}
      <View style={styles.footer}>
        <Button title="Submit" />
      </View>
    </SafeAreaView>
  );
}
```

### Standard Props
- **hasToolbar**: `false` (no bottom toolbar by default)
- **verticalOffset**: `0` (no additional offset)
- **showBlurBackground**: `true` (professional blur effect)
- **blurIntensity**: `20` (subtle but visible blur)
- **scrollEnabled**: `true` (content can scroll)

## 🎨 Visual Features

### Blur Background
- **Height**: Matches raw keyboard height exactly (no offsets)
- **Intensity**: 20 (subtle professional look)
- **Tint**: `systemMaterial` (adapts to system theme)
- **Animation**: Smooth fade in/out with keyboard
- **Performance**: Hardware-accelerated blur

### Animation Characteristics
- **Frame Rate**: 60fps using Reanimated worklets
- **Timing**: Matches native keyboard animation curve
- **Smoothness**: No jarring movements or jumps
- **Responsiveness**: Frame-by-frame height updates

## 📱 Screen Structure

### Layout Hierarchy
```
SafeAreaView (flex: 1)
├── Header (fixed)
├── KeyboardAvoidingContainer (flex: 1)
│   ├── ScrollView (content)
│   ├── KeyboardBlurBackground (raw keyboard height)
│   └── KeyboardSpacer (keyboard height + offsets)
└── Footer (fixed)
```

### Key Principles
1. **Container**: Always use `flex: 1` for main container
2. **Content**: Scrollable area for form inputs
3. **Spacer**: Invisible view that pushes content up (includes offsets)
4. **Blur**: Visual separation using raw keyboard height (no offsets)

## 🔧 Technical Implementation

### Dual Height System
The keyboard system uses two different height measurements:

1. **Raw Keyboard Height** (`useRawKeyboardHeight`)
   - Used by: `KeyboardBlurBackground`
   - Purpose: Match keyboard dimensions exactly
   - Value: Pure keyboard height from system

2. **Adjusted Keyboard Height** (`useKeyboardController`)
   - Used by: `KeyboardSpacer`
   - Purpose: Push content up with proper spacing
   - Value: Keyboard height + verticalOffset + toolbar offset

This ensures the blur background matches the keyboard perfectly while the spacer provides appropriate content positioning.

## ⚙️ Configuration Options

### With Bottom Toolbar
```typescript
<KeyboardAvoidingContainer
  hasToolbar={true}  // Adds 42px offset
  // ... other props
>
```

### Custom Vertical Offset
```typescript
<KeyboardAvoidingContainer
  verticalOffset={20}  // Additional 20px offset
  // ... other props
>
```

### Disable Blur Background
```typescript
<KeyboardAvoidingContainer
  showBlurBackground={false}  // No blur effect
  // ... other props
>
```

### Custom Blur Intensity
```typescript
<KeyboardAvoidingContainer
  blurIntensity={40}  // Stronger blur effect
  // ... other props
>
```

### Non-Scrolling Content
```typescript
<KeyboardAvoidingContainer
  scrollEnabled={false}  // Fixed layout
  // ... other props
>
```

## 🔧 Input Field Best Practices

### Standard TextInput Configuration
```typescript
<TextInput
  placeholder="Enter text..."
  style={styles.input}
  autoFocus={false}           // Don't auto-focus unless needed
  returnKeyType="done"        // Appropriate return key
  autoCapitalize="sentences"  // Proper capitalization
  autoCorrect={true}          // Enable auto-correct
  blurOnSubmit={false}        // Prevent focus jumping
  textAlignVertical="top"     // Android compatibility
  onSubmitEditing={() => {
    // Handle submission
  }}
/>
```

### Input Styling
```typescript
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    fontSize: 16,
    minHeight: TouchTargets.button,
  },
});
```

## 📋 Implementation Checklist

When implementing keyboard handling on a new screen:

- [ ] Import `KeyboardAvoidingContainer` from components
- [ ] Wrap form content in `KeyboardAvoidingContainer`
- [ ] Use standard props: `hasToolbar={false}`, `verticalOffset={0}`
- [ ] Keep blur background enabled: `showBlurBackground={true}`
- [ ] Set appropriate `containerStyle` and `contentContainerStyle`
- [ ] Configure inputs with `blurOnSubmit={false}`
- [ ] Test on both iOS and Android
- [ ] Verify smooth animations
- [ ] Check blur background appears correctly

## 🚀 Performance Considerations

### Optimizations Applied
- **Worklet-based**: All animations run on UI thread
- **Shared Values**: Minimal JavaScript bridge usage
- **Hardware Blur**: Native blur implementation
- **Pointer Events**: Non-interactive overlays don't block touches

### Memory Usage
- **Blur View**: Automatically managed by system
- **Animation Values**: Cleaned up on unmount
- **Event Listeners**: Properly disposed

## 🐛 Troubleshooting

### Common Issues

**Blur not appearing**
- Check if `expo-blur` is installed
- Verify `showBlurBackground={true}`
- Ensure container has proper layout

**Jerky animations**
- Confirm Reanimated is configured
- Check for console.log in render cycles
- Verify worklet usage in hooks

**Content not moving up**
- Ensure KeyboardSpacer is at bottom
- Check container has `flex: 1`
- Verify KeyboardProvider in root

**Focus jumping between inputs**
- Set `blurOnSubmit={false}` on inputs
- Check for component re-mounting
- Use stable references

## 📖 Related Documentation

- [Professional Keyboard System](./professional-keyboard-system.md) - Complete technical details
- [Keyboard Handling Guide](./keyboard-handling-guide.md) - Implementation patterns
- [Component API Reference](../src/components/README.md) - Full component docs

## 🎯 Success Criteria

A properly implemented keyboard setup should:

1. **Smooth Animation**: 60fps keyboard transitions
2. **No Focus Jumping**: Inputs maintain focus during transitions
3. **No Content Covering**: All content visible above keyboard
4. **Professional Appearance**: Blur background provides visual separation
5. **Cross-Platform**: Consistent behavior on iOS and Android
6. **Performance**: No lag or stuttering during animations

---

**This is our standard. Use it consistently across all screens for a professional, cohesive user experience.**