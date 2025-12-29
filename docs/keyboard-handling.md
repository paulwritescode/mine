# Keyboard Handling in Mine App

## Overview

The Mine app now includes comprehensive keyboard handling to ensure smooth text input experiences across all screens. This document outlines the improvements made to fix keyboard focus issues.

## Key Components

### 1. useKeyboard Hook (`src/hooks/useKeyboard.ts`)

Custom hook that provides:
- **Keyboard state tracking**: `isVisible`, `height`, `animationDuration`
- **Platform-specific event handling**: iOS uses `keyboardWillShow/Hide`, Android uses `keyboardDidShow/Hide`
- **Keyboard dismissal**: `dismiss()` function
- **Focus management**: `useFocusManager` for programmatic focus control

```typescript
const { isVisible, height, dismiss } = useKeyboard();
```

### 2. Enhanced MineInput Component

Improvements made:
- **Forward ref support**: Allows parent components to control focus programmatically
- **Focus state callbacks**: `onFocusChange` prop for external focus tracking
- **Input ID system**: `inputId` prop for focus management
- **Removed deprecated props**: Removed `blurOnSubmit` (deprecated in React Native)

```typescript
<MineInput
  ref={inputRef}
  inputId="note"
  onFocusChange={(focused, id) => console.log(`Input ${id} focused: ${focused}`)}
  // ... other props
/>
```

### 3. KeyboardManager Component

Wrapper component that provides:
- **Enhanced keyboard avoidance**: Built on `react-native-keyboard-controller`
- **Automatic scroll management**: Prevents content from being hidden
- **Keyboard dismissal on scroll**: Configurable via `dismissKeyboardOnScroll`
- **Event callbacks**: `onKeyboardShow` and `onKeyboardHide`

```typescript
<KeyboardManager
  bottomOffset={20}
  dismissKeyboardOnScroll={true}
  onKeyboardShow={() => console.log('Keyboard shown')}
>
  {/* Your content */}
</KeyboardManager>
```

## Implementation Details

### Screens Updated

1. **Post-Capture Screen** (`app/post-capture.tsx`)
   - Uses `KeyboardManager` for scroll management
   - Note input has proper focus handling
   - Keyboard dismisses before saving

2. **Create Project Screen** (`app/create-project.tsx`)
   - Auto-focus on project name input
   - Keyboard dismisses on form submission
   - Enhanced validation with focus management

### Root Level Setup

The app uses `KeyboardProvider` from `react-native-keyboard-controller` in `app/_layout.tsx`:

```typescript
<KeyboardProvider>
  <DesignThemeProvider>
    {/* App content */}
  </DesignThemeProvider>
</KeyboardProvider>
```

## Key Features

### ✅ Fixed Issues

1. **Focus Management**: Inputs now properly manage focus state
2. **Keyboard Dismissal**: Consistent keyboard dismissal across screens
3. **Scroll Behavior**: Content scrolls appropriately when keyboard appears
4. **Platform Consistency**: Works correctly on both iOS and Android
5. **Accessibility**: Better keyboard navigation support

### ✅ New Capabilities

1. **Programmatic Focus Control**: Parent components can focus/blur inputs
2. **Focus State Tracking**: Real-time focus state monitoring
3. **Keyboard Event Handling**: Custom callbacks for keyboard show/hide
4. **Enhanced Scroll Management**: Automatic content adjustment
5. **Input Validation Integration**: Focus management works with validation

## Usage Examples

### Basic Input with Focus Management

```typescript
const MyScreen = () => {
  const inputRef = useRef<MineInputRef>(null);
  const { dismiss } = useKeyboard();

  const handleSubmit = () => {
    dismiss();
    // Process form
  };

  return (
    <KeyboardManager>
      <MineInput
        ref={inputRef}
        inputId="myInput"
        onSubmitEditing={handleSubmit}
        // ... other props
      />
    </KeyboardManager>
  );
};
```

### Multi-Input Form with Focus Navigation

```typescript
const FormScreen = () => {
  const { focusNext, registerInput } = useFocusManager();
  const input1Ref = useRef<MineInputRef>(null);
  const input2Ref = useRef<MineInputRef>(null);

  useEffect(() => {
    registerInput('input1', input1Ref);
    registerInput('input2', input2Ref);
  }, []);

  return (
    <KeyboardManager>
      <MineInput
        ref={input1Ref}
        inputId="input1"
        returnKeyType="next"
        onSubmitEditing={() => focusNext('input1', ['input1', 'input2'])}
      />
      <MineInput
        ref={input2Ref}
        inputId="input2"
        returnKeyType="done"
      />
    </KeyboardManager>
  );
};
```

## Best Practices

1. **Always use KeyboardManager** for screens with text inputs
2. **Set inputId** on all MineInput components for better debugging
3. **Use refs** when you need programmatic focus control
4. **Dismiss keyboard** before navigation or form submission
5. **Test on both platforms** to ensure consistent behavior

## Troubleshooting

### Common Issues

1. **Keyboard not dismissing**: Ensure you're using the `dismiss()` function from `useKeyboard`
2. **Focus not working**: Check that the input ref is properly attached
3. **Scroll issues**: Verify `KeyboardManager` is wrapping your content
4. **Platform differences**: Use the keyboard event utilities for platform-specific handling

### Debug Tips

- Use the `onFocusChange` callback to track focus state
- Check keyboard visibility with the `isVisible` property
- Verify input refs are properly connected
- Test keyboard behavior on both iOS and Android simulators