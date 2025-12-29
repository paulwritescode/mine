/**
 * KeyboardSpacer - Professional-grade keyboard spacer using the 'Fake View' approach
 * 
 * This component creates a bottom spacer that smoothly animates with the keyboard,
 * pushing content up without focus jumping or UI flickering.
 * 
 * "Through wisdom is an house builded; and by understanding it is established" - Proverbs 24:3
 */

import React from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useKeyboardController } from '../hooks/useKeyboardController';

interface KeyboardSpacerProps {
  /**
   * Additional vertical offset for toolbars or bottom navigation
   */
  verticalOffset?: number;
  
  /**
   * Whether to include standard toolbar offset (42px)
   */
  hasToolbar?: boolean;
  
  /**
   * Custom style for the spacer (rarely needed)
   */
  style?: any;
}

export function KeyboardSpacer({ 
  verticalOffset = 0, 
  hasToolbar = false,
  style 
}: KeyboardSpacerProps) {
  const { keyboardHeight } = useKeyboardController({ 
    verticalOffset, 
    hasToolbar 
  });

  // Animated style that binds to keyboard height
  const spacerStyle = useAnimatedStyle(() => {
    return {
      height: keyboardHeight.value,
    };
  }, []);

  return (
    <Animated.View 
      style={[spacerStyle, style]}
      pointerEvents="none" // Don't interfere with touch events
    />
  );
}