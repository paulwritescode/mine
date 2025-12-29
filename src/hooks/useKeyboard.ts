/**
 * useKeyboard - Custom hook for keyboard state management and focus handling
 */

import { useEffect, useState, useRef } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

export interface KeyboardState {
  isVisible: boolean;
  height: number;
  animationDuration: number;
}

export function useKeyboard() {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isVisible: false,
    height: 0,
    animationDuration: 250,
  });

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    console.log(`🎹 [useKeyboard] Setting up keyboard listeners for ${Platform.OS}:`, {
      showEvent,
      hideEvent
    });

    const handleKeyboardShow = (event: KeyboardEvent) => {
      console.log(`🎹 [useKeyboard] Keyboard SHOW event:`, {
        height: event.endCoordinates.height,
        duration: event.duration,
        screenX: event.endCoordinates.screenX,
        screenY: event.endCoordinates.screenY,
        width: event.endCoordinates.width
      });

      setKeyboardState({
        isVisible: true,
        height: event.endCoordinates.height,
        animationDuration: event.duration || 250,
      });
    };

    const handleKeyboardHide = (event: KeyboardEvent) => {
      console.log(`🎹 [useKeyboard] Keyboard HIDE event:`, {
        duration: event.duration,
        endCoordinates: event.endCoordinates
      });

      setKeyboardState({
        isVisible: false,
        height: 0,
        animationDuration: event.duration || 250,
      });
    };

    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);

    console.log(`🎹 [useKeyboard] Keyboard listeners registered successfully`);

    return () => {
      console.log(`🎹 [useKeyboard] Cleaning up keyboard listeners`);
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  const dismiss = () => {
    console.log(`🎹 [useKeyboard] Dismissing keyboard manually`);
    Keyboard.dismiss();
  };

  return {
    ...keyboardState,
    dismiss,
  };
}

/**
 * useFocusManager - Hook for managing focus between inputs
 */
export function useFocusManager() {
  const focusedInputRef = useRef<string | null>(null);
  const inputRefs = useRef<Map<string, any>>(new Map());

  const registerInput = (id: string, ref: any) => {
    console.log(`🎯 [useFocusManager] Registering input:`, id);
    inputRefs.current.set(id, ref);
  };

  const unregisterInput = (id: string) => {
    console.log(`🎯 [useFocusManager] Unregistering input:`, id);
    inputRefs.current.delete(id);
  };

  const focusInput = (id: string) => {
    console.log(`🎯 [useFocusManager] Attempting to focus input:`, id);
    const inputRef = inputRefs.current.get(id);
    if (inputRef?.current) {
      console.log(`🎯 [useFocusManager] Focusing input ${id} - ref found`);
      inputRef.current.focus();
      focusedInputRef.current = id;
    } else {
      console.warn(`🎯 [useFocusManager] Cannot focus input ${id} - ref not found or invalid`);
    }
  };

  const blurInput = (id: string) => {
    console.log(`🎯 [useFocusManager] Attempting to blur input:`, id);
    const inputRef = inputRefs.current.get(id);
    if (inputRef?.current) {
      console.log(`🎯 [useFocusManager] Blurring input ${id} - ref found`);
      inputRef.current.blur();
      if (focusedInputRef.current === id) {
        focusedInputRef.current = null;
      }
    } else {
      console.warn(`🎯 [useFocusManager] Cannot blur input ${id} - ref not found or invalid`);
    }
  };

  const focusNext = (currentId: string, inputOrder: string[]) => {
    console.log(`🎯 [useFocusManager] Focus next from ${currentId}, order:`, inputOrder);
    const currentIndex = inputOrder.indexOf(currentId);
    if (currentIndex >= 0 && currentIndex < inputOrder.length - 1) {
      const nextId = inputOrder[currentIndex + 1];
      console.log(`🎯 [useFocusManager] Moving focus from ${currentId} to ${nextId}`);
      focusInput(nextId);
    } else {
      console.log(`🎯 [useFocusManager] No next input to focus from ${currentId}`);
    }
  };

  const focusPrevious = (currentId: string, inputOrder: string[]) => {
    console.log(`🎯 [useFocusManager] Focus previous from ${currentId}, order:`, inputOrder);
    const currentIndex = inputOrder.indexOf(currentId);
    if (currentIndex > 0) {
      const previousId = inputOrder[currentIndex - 1];
      console.log(`🎯 [useFocusManager] Moving focus from ${currentId} to ${previousId}`);
      focusInput(previousId);
    } else {
      console.log(`🎯 [useFocusManager] No previous input to focus from ${currentId}`);
    }
  };

  const blurAll = () => {
    console.log(`🎯 [useFocusManager] Blurring all inputs, count:`, inputRefs.current.size);
    inputRefs.current.forEach((ref, id) => {
      if (ref?.current) {
        console.log(`🎯 [useFocusManager] Blurring input: ${id}`);
        ref.current.blur();
      }
    });
    focusedInputRef.current = null;
  };

  return {
    registerInput,
    unregisterInput,
    focusInput,
    blurInput,
    focusNext,
    focusPrevious,
    blurAll,
    focusedInput: focusedInputRef.current,
  };
}