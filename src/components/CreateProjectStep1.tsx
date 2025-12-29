/**
 * CreateProjectStep1 - Project name and label input step
 * Background: Mint color with Nanum Pen Script font
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useFonts, NanumPenScript_400Regular } from '@expo-google-fonts/nanum-pen-script';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, Typography, BorderRadius, TouchTargets } from '../design-system';
import { MineButton, KeyboardSpacer } from '../components';
import { useCreateProjectStore } from '../store';

interface CreateProjectStep1Props {
  onNext: () => void;
}

export function CreateProjectStep1({ onNext }: CreateProjectStep1Props) {
  const { formData, setProjectName, setProjectLabel } = useCreateProjectStore();
  const [nameError, setNameError] = useState('');

  // Load Nanum Pen Script font
  const [fontsLoaded] = useFonts({
    NanumPenScript_400Regular,
  });

  const validateAndProceed = async () => {
    if (!formData.name.trim()) {
      setNameError('Project name is required');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    if (formData.name.trim().length < 2) {
      setNameError('Project name must be at least 2 characters');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setNameError('');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNext();
  };

  const handleNameChange = (text: string) => {
    setProjectName(text);
    if (nameError) {
      setNameError('');
    }
  };

  if (!fontsLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <View style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.title}>Create Your Project</Text>
          
          {/* Project Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Project Name</Text>
            <TextInput
              value={formData.name}
              onChangeText={handleNameChange}
              placeholder="Enter project name..."
              maxLength={50}
              style={[styles.textInput, nameError ? styles.inputError : null]}
              autoFocus={true}
              returnKeyType="next"
              autoCapitalize="words"
              autoCorrect={false}
              placeholderTextColor={Colors.textSecondary}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          {/* Project Label Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Label</Text>
            <TextInput
              value={formData.label}
              onChangeText={setProjectLabel}
              placeholder="travel, growth, fitness..."
              maxLength={20}
              style={styles.textInput}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={Colors.textSecondary}
              onSubmitEditing={validateAndProceed}
            />
          </View>
        </View>
      </View>

      {/* Next Button - positioned above keyboard */}
      <View style={styles.buttonContainer}>
        <MineButton
          onPress={validateAndProceed}
          disabled={!formData.name.trim()}
          style={styles.nextButton}
          textStyle={styles.nextButtonText}
        >
          Next
        </MineButton>
      </View>

      {/* Keyboard spacer */}
      <KeyboardSpacer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mint,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  
  formSection: {
    flex: 1,
  },
  
  title: {
    fontFamily: 'NanumPenScript_400Regular',
    fontSize: 36,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: '400',
  },
  
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  
  label: {
    fontFamily: 'NanumPenScript_400Regular',
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textTransform: 'capitalize',
    fontWeight: '400',
  },
  
  textInput: {
    borderWidth: 2,
    borderColor: Colors.textPrimary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    fontSize: 20,
    minHeight: TouchTargets.button + 8,
    color: Colors.textPrimary,
    fontFamily: 'NanumPenScript_400Regular',
    textTransform: 'capitalize',
  },
  
  inputError: {
    borderColor: Colors.error,
  },
  
  errorText: {
    fontSize: 16,
    color: Colors.error,
    marginTop: Spacing.sm,
    fontFamily: 'NanumPenScript_400Regular',
    textTransform: 'capitalize',
  },
  
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.mint,
  },
  
  nextButton: {
    backgroundColor: Colors.black,
    width: '100%',
  },
  
  nextButtonText: {
    color: Colors.white,
    fontFamily: 'NanumPenScript_400Regular',
    fontSize: 24,
    textTransform: 'capitalize',
    fontWeight: '400',
  },
});