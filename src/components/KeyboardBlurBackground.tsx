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
import { useRawKeyboardHeight } from '../hooks/useRawKeyboardHeight';

interface KeyboardBlurBackgroundProps {
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
  intensity = 20,
  tint = 'systemMaterial'
}: KeyboardBlurBackgroundProps) {
  const { rawKeyboardHeight } = useRawKeyboardHeight();

  // Animated style that matches keyboard height exactly
  const blurStyle = useAnimatedStyle(() => {
    return {
      height: rawKeyboardHeight.value,
      opacity: rawKeyboardHeight.value > 0 ? 1 : 0,
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