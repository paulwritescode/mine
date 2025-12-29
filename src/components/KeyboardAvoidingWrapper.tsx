/**
 * KeyboardAvoidingWrapper - Simple wrapper using React Native's KeyboardAvoidingView
 * Based on Expo's keyboard handling guide
 */

import React from 'react';
import { KeyboardAvoidingView, Platform, ViewStyle } from 'react-native';

interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  keyboardVerticalOffset?: number;
}

export function KeyboardAvoidingWrapper({
  children,
  style,
  keyboardVerticalOffset = 0,
}: KeyboardAvoidingWrapperProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[{ flex: 1 }, style]}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}