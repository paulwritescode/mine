/**
 * KeyboardAwareForm - Form component using react-native-keyboard-controller
 * For screens with multiple inputs that need advanced keyboard handling
 */

import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';

interface KeyboardAwareFormProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  bottomOffset?: number;
  showToolbar?: boolean;
}

export function KeyboardAwareForm({
  children,
  style,
  contentContainerStyle,
  bottomOffset = 62,
  showToolbar = true,
}: KeyboardAwareFormProps) {
  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={bottomOffset}
        contentContainerStyle={[styles.container, contentContainerStyle]}
        style={style}
      >
        {children}
      </KeyboardAwareScrollView>
      {showToolbar && <KeyboardToolbar />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
});