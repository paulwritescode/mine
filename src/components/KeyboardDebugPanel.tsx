/**
 * KeyboardDebugPanel - Development-only component to debug keyboard issues
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, Typography } from '../design-system';
import { useKeyboard, useFocusManager } from '../hooks/useKeyboard';
import { MineInput, MineInputRef } from './MineInput';
import { keyboardDebugger } from '../utils/debugKeyboard';

export function KeyboardDebugPanel() {
  const [debugVisible, setDebugVisible] = useState(false);
  const [testValue1, setTestValue1] = useState('');
  const [testValue2, setTestValue2] = useState('');
  
  const { isVisible, height, dismiss } = useKeyboard();
  const { focusInput, blurAll, focusedInput } = useFocusManager();
  
  const input1Ref = useRef<MineInputRef>(null);
  const input2Ref = useRef<MineInputRef>(null);

  if (!__DEV__) {
    return null; // Only show in development
  }

  if (!debugVisible) {
    return (
      <TouchableOpacity 
        style={styles.debugToggle}
        onPress={() => setDebugVisible(true)}
      >
        <Text style={styles.debugToggleText}>🔧 Debug</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.debugPanel}>
      <View style={styles.debugHeader}>
        <Text style={styles.debugTitle}>Keyboard Debug Panel</Text>
        <TouchableOpacity onPress={() => setDebugVisible(false)}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.debugContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keyboard State</Text>
          <Text style={styles.debugText}>Visible: {isVisible ? '✅' : '❌'}</Text>
          <Text style={styles.debugText}>Height: {height}px</Text>
          <Text style={styles.debugText}>Focused Input: {focusedInput || 'none'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Inputs</Text>
          
          <MineInput
            ref={input1Ref}
            label="Test Input 1"
            value={testValue1}
            onChangeText={setTestValue1}
            placeholder="Single line input"
            inputId="debug-input-1"
            style={styles.testInput}
          />
          
          <MineInput
            ref={input2Ref}
            label="Test Input 2"
            value={testValue2}
            onChangeText={setTestValue2}
            placeholder="Multiline input"
            multiline
            numberOfLines={3}
            inputId="debug-input-2"
            style={styles.testInput}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => {
              keyboardDebugger.logKeyboardAction('manual_dismiss');
              dismiss();
            }}
          >
            <Text style={styles.buttonText}>Dismiss Keyboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => {
              keyboardDebugger.logKeyboardAction('focus_input_1');
              input1Ref.current?.focus();
            }}
          >
            <Text style={styles.buttonText}>Focus Input 1</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => {
              keyboardDebugger.logKeyboardAction('focus_input_2');
              input2Ref.current?.focus();
            }}
          >
            <Text style={styles.buttonText}>Focus Input 2</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => {
              keyboardDebugger.logKeyboardAction('blur_all');
              blurAll();
            }}
          >
            <Text style={styles.buttonText}>Blur All</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  debugToggle: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: Colors.sage,
    padding: Spacing.xs,
    borderRadius: 20,
    zIndex: 1000,
  },
  debugToggleText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  debugPanel: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 300,
    maxHeight: 400,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.sage,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  debugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.sage,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  debugTitle: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  closeButton: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugContent: {
    padding: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
    color: Colors.sage,
  },
  debugText: {
    fontSize: 12,
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  testInput: {
    marginBottom: Spacing.sm,
  },
  debugButton: {
    backgroundColor: Colors.sageLight,
    padding: Spacing.xs,
    borderRadius: 4,
    marginBottom: Spacing.xs,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
});