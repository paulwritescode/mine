/**
 * KeyboardDebugger - Debug component to test keyboard functionality
 * Updated to use professional keyboard system
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useKeyboard } from '../hooks/useKeyboard';
import { useKeyboardController } from '../hooks/useKeyboardController';
import { MineInput } from './MineInput';

export function KeyboardDebugger() {
  const [text, setText] = useState('');
  const keyboard = useKeyboard();
  const { keyboardHeight, rawKeyboardHeight, isKeyboardVisible, getRawHeight } = useKeyboardController();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Keyboard Debug Info</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Platform: {Platform.OS}</Text>
        <Text style={styles.infoText}>
          Built-in Hook - Visible: {keyboard.isVisible ? 'YES' : 'NO'}
        </Text>
        <Text style={styles.infoText}>
          Built-in Hook - Height: {keyboard.height}px
        </Text>
        <Text style={styles.infoText}>
          Controller - Raw Height: {getRawHeight()}px
        </Text>
        <Text style={styles.infoText}>
          Controller - Adjusted Height: {keyboardHeight.value}px
        </Text>
        <Text style={styles.infoText}>
          Controller - Visible: {isKeyboardVisible.value ? 'YES' : 'NO'}
        </Text>
      </View>

      <MineInput
        value={text}
        onChangeText={setText}
        placeholder="Type here to test keyboard..."
        multiline
        numberOfLines={3}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  input: {
    marginBottom: 0, // Override MineInput default margin
  },
});