/**
 * KeyboardBlurBackground - Blur background that matches keyboard height
 * 
 * Creates a blur overlay that appears behind the keyboard with the exact same height,
 * providing a professional visual separation between content and keyboard.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useKeyboardController } from '../hooks/useKeyboardController';

interface KeyboardBlurBackgroundProps {
  /**
   * Additional vertical offset for toolbars or bottom navigation
   */
  verticalOffset?: number;
  
  /**
   * Whether to include standard toolbar offset (42px)
   */
  hasToolbar?: boolean;
  
  /**
   * Blur intensity (default: 20)
   */
  intensity?: number;
  
  /**
   * Blur tint color (default: 'systemMaterial')
   */
  tint?: 'light' | 'dark' | 'default' | 'systemMaterial' | 'systemThickMaterial' | 'systemThinMaterial' | 'systemUltraThinMaterial' | 'systemChromeMaterial' | 'prominent' | 'regular';
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function KeyboardBlurBackground({ 
  verticalOffset = 0, 
  hasToolbar = false,
  intensity = 20,
  tint = 'systemMaterial'
}: KeyboardBlurBackgroundProps) {
  const { keyboardHeight } = useKeyboardController({ 
    verticalOffset, 
    hasToolbar 
  });

  // Animated style that matches keyboard height exactly
  const blurStyle = useAnimatedStyle(() => {
    return {
      height: keyboardHeight.value,
      opacity: keyboardHeight.value > 0 ? 1 : 0,
    };
  }, []);

  return (
    <AnimatedBlurView
      style={[styles.blurBackground, blurStyle]}
      intensity={intensity}
      tint={tint}
      pointerEvents="none" // Don't interfere with touch events
    />
  );
}

const styles = StyleSheet.create({
  blurBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1, // Behind content but above background
  },
});