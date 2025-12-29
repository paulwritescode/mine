/**
 * MineInput - Reusable input component following Mine design system
 */

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
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
import { keyboardDebugger } from '../utils/debugKeyboard';

export interface MineInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  multiline?: boolean;
  inputId?: string;
  onFocusChange?: (focused: boolean, inputId?: string) => void;
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
  inputId,
  onFocus,
  onBlur,
  onFocusChange,
  ...textInputProps
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  console.log(`📝 [MineInput] Rendering input with ID: ${inputId || 'no-id'}, multiline: ${multiline}`);

  useImperativeHandle(ref, () => ({
    focus: () => {
      console.log(`📝 [MineInput] Imperative focus called for: ${inputId || 'no-id'}`);
      inputRef.current?.focus();
    },
    blur: () => {
      console.log(`📝 [MineInput] Imperative blur called for: ${inputId || 'no-id'}`);
      inputRef.current?.blur();
    },
    isFocused: () => {
      const focused = isFocused;
      console.log(`📝 [MineInput] isFocused check for ${inputId || 'no-id'}: ${focused}`);
      return focused;
    },
  }));

  const handleFocus = (e: any) => {
    console.log(`📝 [MineInput] Focus event for: ${inputId || 'no-id'}`);
    keyboardDebugger.logFocusChange(inputId || 'no-id', true, { multiline, hasLabel: !!label });
    setIsFocused(true);
    onFocusChange?.(true, inputId);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    console.log(`📝 [MineInput] Blur event for: ${inputId || 'no-id'}`);
    keyboardDebugger.logFocusChange(inputId || 'no-id', false, { multiline, hasLabel: !!label });
    setIsFocused(false);
    onFocusChange?.(false, inputId);
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
          textAlignVertical={multiline ? 'top' : 'center'}
          placeholderTextColor={Colors.disabled}
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
    shadowColor: Colors.sage,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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