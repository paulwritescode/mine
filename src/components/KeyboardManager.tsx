/**
 * KeyboardManager - Enhanced keyboard handling wrapper component
 */

import React, { useEffect, useRef } from 'react';
import { Keyboard, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useKeyboard, useFocusManager } from '@/src/hooks/useKeyboard';
import { keyboardDebugger } from '@/src/utils/debugKeyboard';

interface KeyboardManagerProps {
  children: React.ReactNode;
  style?: any;
  contentContainerStyle?: any;
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  keyboardVerticalOffset?: number;
  onKeyboardShow?: () => void;
  onKeyboardHide?: () => void;
  dismissKeyboardOnScroll?: boolean;
}

export function KeyboardManager({
  children,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = 'handled',
  keyboardVerticalOffset = 0,
  onKeyboardShow,
  onKeyboardHide,
  dismissKeyboardOnScroll = true,
}: KeyboardManagerProps) {
  const { isVisible: keyboardVisible, dismiss: dismissKeyboard } = useKeyboard();
  const { blurAll } = useFocusManager();
  const previousKeyboardState = useRef(keyboardVisible);

  console.log(`⌨️ [KeyboardManager] Rendering with keyboard visible: ${keyboardVisible}`);

  useEffect(() => {
    if (keyboardVisible !== previousKeyboardState.current) {
      if (keyboardVisible) {
        console.log(`⌨️ [KeyboardManager] Keyboard became visible - calling onKeyboardShow`);
        onKeyboardShow?.();
      } else {
        console.log(`⌨️ [KeyboardManager] Keyboard became hidden - calling onKeyboardHide`);
        onKeyboardHide?.();
      }
      previousKeyboardState.current = keyboardVisible;
    }
  }, [keyboardVisible, onKeyboardShow, onKeyboardHide]);

  const handleScrollBeginDrag = () => {
    console.log(`⌨️ [KeyboardManager] Scroll began, keyboard visible: ${keyboardVisible}, dismissOnScroll: ${dismissKeyboardOnScroll}`);
    keyboardDebugger.logKeyboardAction('scroll_begin_drag', { keyboardVisible, dismissKeyboardOnScroll });
    
    if (dismissKeyboardOnScroll && keyboardVisible) {
      console.log(`⌨️ [KeyboardManager] Dismissing keyboard due to scroll`);
      keyboardDebugger.logKeyboardAction('dismiss_on_scroll');
      dismissKeyboard();
    }
  };

  const handleTouchStart = () => {
    console.log(`⌨️ [KeyboardManager] Touch start event`);
    keyboardDebugger.logKeyboardAction('touch_start', { keyboardVisible });
  };

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        onScrollBeginDrag={handleScrollBeginDrag}
        onTouchStart={handleTouchStart}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}