/**
 * CreateProjectStep2 - Project type selection step
 * Background: Lavender color with focus rings and explanations
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, NanumPenScript_400Regular } from '@expo-google-fonts/nanum-pen-script';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, Typography, BorderRadius, TouchTargets } from '../design-system';
import { MineButton } from '../components';
import { useCreateProjectStore } from '../store';
import { ProjectType } from '../types';

interface CreateProjectStep2Props {
  onCreateProject: () => void;
}

export function CreateProjectStep2({ onCreateProject }: CreateProjectStep2Props) {
  const { formData, setProjectType } = useCreateProjectStore();

  // Load Nanum Pen Script font
  const [fontsLoaded] = useFonts({
    NanumPenScript_400Regular,
  });

  const handleTypeSelect = async (type: ProjectType) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setProjectType(type);
  };

  const renderTypeCard = (
    type: ProjectType,
    title: string,
    icon: keyof typeof Ionicons.glyphMap,
    description: string
  ) => {
    const isSelected = formData.type === type;
    
    return (
      <TouchableOpacity
        key={type}
        onPress={() => handleTypeSelect(type)}
        style={[
          styles.typeCard,
          isSelected ? styles.typeCardSelected : styles.typeCardDimmed
        ]}
        activeOpacity={0.8}
      >
        <View style={styles.typeHeader}>
          <View style={[styles.typeIcon, { backgroundColor: isSelected ? Colors.black : Colors.textSecondary }]}>
            <Ionicons name={icon} size={24} color={Colors.white} />
          </View>
          <Text style={[styles.typeTitle, isSelected ? styles.typeTitleSelected : null]}>
            {title}
          </Text>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color={Colors.black} />
          )}
        </View>
        
        {isSelected && (
          <View style={styles.typeDescription}>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose Project Type</Text>
        
        <View style={styles.typeCards}>
          {renderTypeCard(
            'timeline',
            'Timeline Project',
            'calendar',
            'Organize videos by calendar date. Perfect for daily journaling and tracking progress over time. Each video will be automatically sorted by the date it was recorded.'
          )}
          
          {renderTypeCard(
            'freestyle',
            'Freestyle Project',
            'albums',
            'Organize videos manually in any order. Great for themed collections and creative projects. You have full control over the sequence and arrangement of your videos.'
          )}
        </View>
      </View>

      {/* Create Project Button */}
      <View style={styles.buttonContainer}>
        <MineButton
          onPress={onCreateProject}
          disabled={!formData.type}
          style={!formData.type ? styles.createButtonDisabled : styles.createButton}
          textStyle={styles.createButtonText}
        >
          Create Project
        </MineButton>
      </View>
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
    paddingBottom: 100, // Space for button
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
  
  typeCards: {
    gap: Spacing.xl,
  },
  
  typeCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  
  typeCardSelected: {
    borderColor: Colors.black,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  typeCardDimmed: {
    opacity: 0.6,
  },
  
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  
  typeTitle: {
    flex: 1,
    fontFamily: 'NanumPenScript_400Regular',
    fontSize: 28,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
    fontWeight: '400',
  },
  
  typeTitleSelected: {
    color: Colors.textPrimary,
    fontSize: 30,
  },
  
  typeDescription: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  
  descriptionText: {
    fontFamily: 'NanumPenScript_400Regular',
    fontSize: 20,
    color: Colors.textSecondary,
    lineHeight: 28,
    textTransform: 'capitalize',
  },
  
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.mint,
  },
  
  createButton: {
    backgroundColor: Colors.black,
    width: '100%',
  },
  
  createButtonDisabled: {
    backgroundColor: Colors.disabled,
    width: '100%',
  },
  
  createButtonText: {
    color: Colors.white,
    fontFamily: 'NanumPenScript_400Regular',
    fontSize: 24,
    textTransform: 'capitalize',
    fontWeight: '400',
  },
});