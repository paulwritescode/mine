/**
 * Professional Keyboard Example - Demonstrates the 'Fake View' approach
 * 
 * "Through wisdom is an house builded; and by understanding it is established" - Proverbs 24:3
 * This example shows the solid structural foundation for keyboard avoidance.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { KeyboardAvoidingContainer, MineInput } from '../keyboard';

export function ProfessionalKeyboardExample() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <KeyboardAvoidingContainer
      containerStyle={styles.container}
      contentContainerStyle={styles.content}
      hasToolbar={false} // Set to true if you have a bottom toolbar
      verticalOffset={0} // Additional offset if needed
    >
      <Text style={styles.title}>Professional Keyboard Avoidance</Text>
      <Text style={styles.subtitle}>
        Built with wisdom and understanding - no focus jumping, no UI flickering
      </Text>

      <MineInput
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your full name"
        returnKeyType="next"
      />

      <MineInput
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        returnKeyType="next"
      />

      <MineInput
        label="Message"
        value={message}
        onChangeText={setMessage}
        placeholder="Enter your message here..."
        multiline
        numberOfLines={6}
        returnKeyType="done"
      />

      <View style={styles.buttonContainer}>
        <Button title="Submit Form" onPress={() => console.log('Form submitted')} />
      </View>

      <Text style={styles.footer}>
        Notice how the content smoothly moves up as you focus on inputs,
        with frame-by-frame animation and no jarring transitions.
      </Text>
    </KeyboardAvoidingContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  footer: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});