/**
 * MineInput - Reusable input component following Mine design system
 * Updated to use modern keyboard handling approach
 */

import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Typography, TouchTargets } from '../design-system';

export interface MineInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  multiline?: boolean;
}

export interface MineInputRef {
  focus: () => void;
  blur: () => void;
  isFocused: () => boolean;
}

export const MineInput = forwardRef<MineInputRef, MineInputProps>(({
  label,
  error,
  style,
  inputStyle,
  multiline = false,
  onFocus,
  onBlur,
  ...textInputProps
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    isFocused: () => {
      return isFocused;
    },
  }));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const containerStyles = [
    styles.container,
    style,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    isFocused && styles.focused,
    error && styles.error,
  ];

  const inputStyles = [
    styles.input,
    multiline && styles.multilineInput,
    inputStyle,
  ];

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <View style={inputContainerStyles}>
        <TextInput
          ref={inputRef}
          style={inputStyles}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'} // Android compatibility
          placeholderTextColor={Colors.disabled}
          blurOnSubmit={false} // Prevent focus jumping
          {...textInputProps}
        />
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    minHeight: TouchTargets.button,
  },
  focused: {
    borderColor: Colors.sage,
    boxShadow: '0px 0px 4px rgba(156, 175, 136, 0.2)',
    elevation: 2,
  },
  error: {
    borderColor: Colors.error,
  },
  input: {
    ...Typography.body,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: TouchTargets.button,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});