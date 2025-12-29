/**
 * Keyboard Utilities - Helper functions for keyboard management
 */

import { Keyboard, Platform } from 'react-native';

/**
 * Dismiss the keyboard with platform-specific handling
 */
export const dismissKeyboard = () => {
  Keyboard.dismiss();
};

/**
 * Check if keyboard is likely to be visible based on platform
 */
export const isKeyboardSupported = () => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

/**
 * Get keyboard event names based on platform
 */
export const getKeyboardEvents = () => {
  const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
  const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
  
  return { showEvent, hideEvent };
};

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Focus an input with a small delay to ensure proper rendering
   */
  focusWithDelay: (inputRef: any, delay: number = 100) => {
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.focus();
      }
    }, delay);
  },

  /**
   * Blur an input safely
   */
  blurSafely: (inputRef: any) => {
    if (inputRef?.current) {
      inputRef.current.blur();
    }
  },

  /**
   * Check if an input is focused
   */
  isFocused: (inputRef: any): boolean => {
    return inputRef?.current?.isFocused?.() || false;
  },
};