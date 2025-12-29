/**
 * KeyboardAnimatedView - Component that animates in sync with keyboard height
 * Based on Expo's advanced keyboard handling guide
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useKeyboardController } from '../hooks/useKeyboardController';

interface KeyboardAnimatedViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function KeyboardAnimatedView({ children, style }: KeyboardAnimatedViewProps) {
  const { keyboardHeight } = useKeyboardController();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: Math.abs(keyboardHeight.value),
    };
  }, []);

  return (
    <View style={[styles.container, style]}>
      {children}
      <Animated.View style={animatedStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});