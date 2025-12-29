/**
 * useRawKeyboardHeight - Get the exact keyboard height without any offsets
 * 
 * This hook provides the raw keyboard height for components that need to match
 * the keyboard dimensions exactly (like blur backgrounds).
 */

import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useSharedValue } from 'react-native-reanimated';

export function useRawKeyboardHeight() {
  // Raw keyboard height without any offsets
  const rawKeyboardHeight = useSharedValue(0);
  
  // Track keyboard visibility
  const isKeyboardVisible = useSharedValue(false);

  useKeyboardHandler({
    onStart: (event) => {
      'worklet';
      isKeyboardVisible.value = event.height > 0;
    },
    onMove: (event) => {
      'worklet';
      // Store the exact keyboard height without any modifications
      rawKeyboardHeight.value = Math.max(event.height, 0);
    },
    onEnd: (event) => {
      'worklet';
      rawKeyboardHeight.value = Math.max(event.height, 0);
      isKeyboardVisible.value = event.height > 0;
    },
  }, []);

  return { 
    rawKeyboardHeight,
    isKeyboardVisible
  };
}