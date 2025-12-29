/**
 * useKeyboardController - Professional-grade keyboard handling using react-native-keyboard-controller
 * Implements the 'Fake View' approach for smooth, frame-by-frame keyboard animations
 * 
 * "Through wisdom is an house builded; and by understanding it is established" - Proverbs 24:3
 * Building a solid structural foundation for keyboard avoidance
 */

import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useSharedValue } from 'react-native-reanimated';

interface UseKeyboardControllerOptions {
  /**
   * Additional vertical offset for toolbars or bottom navigation
   * Default: 0px
   */
  verticalOffset?: number;
  
  /**
   * Whether to include toolbar offset (approximately 42px)
   * Default: false
   */
  hasToolbar?: boolean;
}

export function useKeyboardController(options: UseKeyboardControllerOptions = {}) {
  const { verticalOffset = 0, hasToolbar = false } = options;
  
  // Calculate total offset including toolbar
  const totalOffset = verticalOffset + (hasToolbar ? 42 : 0);
  
  // Shared value for keyboard height - this drives the animation
  const keyboardHeight = useSharedValue(0);
  
  // Track keyboard state for additional logic if needed
  const isKeyboardVisible = useSharedValue(false);

  useKeyboardHandler({
    onStart: (event) => {
      'worklet';
      // Keyboard animation is starting
      isKeyboardVisible.value = event.height > 0;
    },
    onMove: (event) => {
      'worklet';
      // Frame-by-frame keyboard height updates
      // Apply offset and ensure non-negative values
      keyboardHeight.value = Math.max(event.height + totalOffset, 0);
    },
    onEnd: (event) => {
      'worklet';
      // Keyboard animation completed
      keyboardHeight.value = Math.max(event.height + totalOffset, 0);
      isKeyboardVisible.value = event.height > 0;
    },
  }, [totalOffset]);

  return { 
    keyboardHeight,
    isKeyboardVisible,
    /**
     * For debugging - access the raw height value
     */
    getRawHeight: () => keyboardHeight.value - totalOffset
  };
}