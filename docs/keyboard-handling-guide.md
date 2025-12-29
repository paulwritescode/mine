# Keyboard Handling Guide

This guide covers modern keyboard handling in the Mine app, based on Expo's keyboard handling best practices.

## Overview

The Mine app uses a combination of React Native's built-in keyboard APIs and `react-native-keyboard-controller` for advanced keyboard interactions.

## Basic Keyboard Handling

### 1. useKeyboard Hook

For simple keyboard state tracking:

```typescript
import { useKeyboard } from '@/src/hooks/useKeyboard';

function MyScreen() {
  const { isVisible, height, dismiss } = useKeyboard();

  return (
    <View>
      {isVisible && <Button title="Dismiss keyboard" onPress={dismiss} />}
      <TextInput placeholder="Type here..." />
    </View>
  );
}
```

### 2. KeyboardAvoidingWrapper

For simple screens with basic keyboard avoidance:

```typescript
import { KeyboardAvoidingWrapper } from '@/src/components/KeyboardAvoidingWrapper';

function SimpleForm() {
  return (
    <KeyboardAvoidingWrapper>
      <TextInput placeholder="Type here..." />
    </KeyboardAvoidingWrapper>
  );
}
```

## Advanced Keyboard Handling

### 1. KeyboardAwareForm

For forms with multiple inputs:

```typescript
import { KeyboardAwareForm } from '@/src/components/KeyboardAwareForm';
import { MineInput } from '@/src/components/MineInput';

function MultiInputForm() {
  return (
    <KeyboardAwareForm>
      <MineInput placeholder="First input..." />
      <MineInput placeholder="Second input..." />
      <MineInput placeholder="Third input..." />
    </KeyboardAwareForm>
  );
}
```

### 2. KeyboardAnimatedView

For chat-like interfaces with smooth keyboard animations:

```typescript
import { KeyboardAnimatedView } from '@/src/components/KeyboardAnimatedView';

function ChatScreen() {
  return (
    <KeyboardAnimatedView>
      <FlatList data={messages} renderItem={renderMessage} />
      <TextInput placeholder="Type a message..." />
    </KeyboardAnimatedView>
  );
}
```

## Configuration

### Android Configuration

The app.json already includes the required Android configuration:

```json
{
  "expo": {
    "android": {
      "softwareKeyboardLayoutMode": "pan"
    }
  }
}
```

### Root Layout Setup

The KeyboardProvider is already configured in `app/_layout.tsx`:

```typescript
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function RootLayout() {
  return (
    <KeyboardProvider>
      {/* Your app content */}
    </KeyboardProvider>
  );
}
```

## Components

### MineInput

Updated input component with modern keyboard handling:

```typescript
<MineInput
  ref={inputRef}
  label="Project Name"
  placeholder="Enter project name"
  onSubmitEditing={handleSubmit}
/>
```

### KeyboardAwareForm Features

- Automatic scrolling to focused inputs
- Built-in keyboard toolbar with navigation
- Customizable bottom offset
- Native-like performance

### KeyboardAnimatedView Features

- Smooth animations synced with keyboard
- Perfect for chat interfaces
- Uses Reanimated for 60fps animations

## Best Practices

1. **Use KeyboardAvoidingWrapper** for simple screens
2. **Use KeyboardAwareForm** for multi-input forms
3. **Use KeyboardAnimatedView** for chat-like interfaces
4. **Always dismiss keyboard** before navigation
5. **Test on both platforms** for consistent behavior

## Migration from Old System

The old keyboard handling system has been completely replaced with this modern approach:

- ✅ Removed complex focus management
- ✅ Removed debug logging
- ✅ Simplified component APIs
- ✅ Better performance
- ✅ More reliable keyboard behavior

## Troubleshooting

### Common Issues

1. **Keyboard not dismissing**: Use the `dismiss()` function from `useKeyboard`
2. **Content not scrolling**: Ensure you're using `KeyboardAwareForm` for multi-input screens
3. **Animation issues**: Check that `react-native-reanimated` is properly configured

### Platform Differences

- **iOS**: Uses `padding` behavior by default
- **Android**: Uses `pan` layout mode, no behavior needed
- **Toolbar**: Only shows on screens with multiple inputs

## Examples

See the updated screens for implementation examples:
- Simple forms: Use `KeyboardAvoidingWrapper`
- Multi-input forms: Use `KeyboardAwareForm`
- Chat interfaces: Use `KeyboardAnimatedView`