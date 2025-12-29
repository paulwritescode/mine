/**
 * Debug utilities for keyboard handling
 */

import { Platform, Keyboard } from 'react-native';

export class KeyboardDebugger {
  private static instance: KeyboardDebugger;
  private listeners: any[] = [];
  private isEnabled = __DEV__; // Only enable in development

  static getInstance(): KeyboardDebugger {
    if (!KeyboardDebugger.instance) {
      KeyboardDebugger.instance = new KeyboardDebugger();
    }
    return KeyboardDebugger.instance;
  }

  enable() {
    if (!this.isEnabled) return;

    console.log(`🔧 [KeyboardDebugger] Enabling keyboard debugging for ${Platform.OS}`);

    // Listen to all keyboard events
    const events: Array<'keyboardWillShow' | 'keyboardDidShow' | 'keyboardWillHide' | 'keyboardDidHide' | 'keyboardWillChangeFrame' | 'keyboardDidChangeFrame'> = [
      'keyboardWillShow',
      'keyboardDidShow', 
      'keyboardWillHide',
      'keyboardDidHide',
      'keyboardWillChangeFrame',
      'keyboardDidChangeFrame'
    ];

    events.forEach(eventName => {
      const listener = Keyboard.addListener(eventName, (event) => {
        console.log(`🔧 [KeyboardDebugger] Event: ${eventName}`, {
          timestamp: new Date().toISOString(),
          platform: Platform.OS,
          event: {
            duration: event?.duration,
            easing: event?.easing,
            endCoordinates: event?.endCoordinates,
            startCoordinates: event?.startCoordinates,
          }
        });
      });
      this.listeners.push(listener);
    });

    console.log(`🔧 [KeyboardDebugger] Registered ${events.length} keyboard event listeners`);
  }

  disable() {
    console.log(`🔧 [KeyboardDebugger] Disabling keyboard debugging`);
    this.listeners.forEach(listener => listener?.remove());
    this.listeners = [];
  }

  logInputState(inputId: string, state: any) {
    if (!this.isEnabled) return;
    
    console.log(`🔧 [KeyboardDebugger] Input state for ${inputId}:`, {
      timestamp: new Date().toISOString(),
      ...state
    });
  }

  logFocusChange(inputId: string, focused: boolean, additionalInfo?: any) {
    if (!this.isEnabled) return;
    
    console.log(`🔧 [KeyboardDebugger] Focus change: ${inputId} -> ${focused ? 'FOCUSED' : 'BLURRED'}`, {
      timestamp: new Date().toISOString(),
      inputId,
      focused,
      ...additionalInfo
    });
  }

  logKeyboardAction(action: string, context?: any) {
    if (!this.isEnabled) return;
    
    console.log(`🔧 [KeyboardDebugger] Action: ${action}`, {
      timestamp: new Date().toISOString(),
      action,
      context
    });
  }
}

// Global instance for easy access
export const keyboardDebugger = KeyboardDebugger.getInstance();

// Auto-enable in development
if (__DEV__) {
  keyboardDebugger.enable();
}