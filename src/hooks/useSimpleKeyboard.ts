/**
 * useSimpleKeyboard - Simplified keyboard hook without complex state management
 */

import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

export function useSimpleKeyboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const handleKeyboardShow = (event: KeyboardEvent) => {
      setIsVisible(true);
      setHeight(event.endCoordinates.height);
    };

    const handleKeyboardHide = () => {
      setIsVisible(false);
      setHeight(0);
    };

    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  const dismiss = () => {
    Keyboard.dismiss();
  };

  return {
    isVisible,
    height,
    dismiss,
  };
}