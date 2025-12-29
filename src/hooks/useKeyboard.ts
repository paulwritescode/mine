/**
 * useKeyboard - Modern keyboard handling hook using React Native's built-in APIs
 * Based on Expo's keyboard handling guide
 */

import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

export interface KeyboardState {
  isVisible: boolean;
  height: number;
}

export function useKeyboard() {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isVisible: false,
    height: 0,
  });

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleKeyboardShow = (event: KeyboardEvent) => {
    setKeyboardState({
      isVisible: true,
      height: event.endCoordinates.height,
    });
  };

  const handleKeyboardHide = () => {
    setKeyboardState({
      isVisible: false,
      height: 0,
    });
  };

  const dismiss = () => {
    Keyboard.dismiss();
  };

  return {
    ...keyboardState,
    dismiss,
  };
}