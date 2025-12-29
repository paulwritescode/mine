/**
 * Keyboard Examples - Demonstration of different keyboard handling approaches
 * This file shows how to use the new keyboard handling system
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { 
  useKeyboard, 
  KeyboardAvoidingWrapper, 
  KeyboardAwareForm, 
  KeyboardAnimatedView,
  MineInput,
  type MineInputRef 
} from '../keyboard';

// Example 1: Simple keyboard state tracking
export function BasicKeyboardExample() {
  const { isVisible, height, dismiss } = useKeyboard();

  return (
    <KeyboardAvoidingWrapper>
      <View style={styles.container}>
        <Text>Keyboard visible: {isVisible ? 'Yes' : 'No'}</Text>
        <Text>Keyboard height: {height}px</Text>
        {isVisible && <Button title="Dismiss Keyboard" onPress={dismiss} />}
        <MineInput placeholder="Type here to show keyboard..." />
      </View>
    </KeyboardAvoidingWrapper>
  );
}

// Example 2: Multi-input form with keyboard toolbar
export function FormExample() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <KeyboardAwareForm>
      <Text style={styles.title}>Contact Form</Text>
      <MineInput
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        returnKeyType="next"
      />
      <MineInput
        label="Email"
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
        placeholder="Enter your message"
        multiline
        numberOfLines={4}
        returnKeyType="done"
      />
      <Button title="Submit" onPress={() => console.log('Form submitted')} />
    </KeyboardAwareForm>
  );
}

// Example 3: Chat-like interface with animated keyboard
export function ChatExample() {
  const [messages, setMessages] = useState([
    'Hello!',
    'How are you?',
    'This is a chat example',
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
  };

  return (
    <KeyboardAnimatedView style={styles.chatContainer}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View key={index} style={styles.message}>
            <Text>{message}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <MineInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          style={styles.chatInput}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  message: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-end',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    marginBottom: 0,
  },
});