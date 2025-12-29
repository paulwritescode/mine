/**
 * CreateProject - Multi-step project creation form
 * Step 1: Project name and label (mint background)
 * Step 2: Project type selection (lavender background)
 */

import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useFonts, NanumPenScript_400Regular } from '@expo-google-fonts/nanum-pen-script';

import { Colors, Spacing, Typography, TouchTargets } from '@/src/design-system';
import { CreateProjectStep1, CreateProjectStep2 } from '@/src/components';
import { useCreateProjectStore, useProjectStore } from '@/src/store';
import { ProjectService } from '@/src/services/ProjectService';

export default function CreateProject() {
  const { 
    currentStep, 
    totalSteps, 
    formData, 
    isLoading,
    nextStep, 
    previousStep, 
    setLoading, 
    resetForm 
  } = useCreateProjectStore();
  
  const { addProject } = useProjectStore();
  const projectService = ProjectService.getInstance();

  // Load Nanum Pen Script font
  const [fontsLoaded] = useFonts({
    NanumPenScript_400Regular,
  });

  // Reset form when component mounts
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleBack = useCallback(async () => {
    if (currentStep === 1) {
      router.back();
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      previousStep();
    }
  }, [currentStep, previousStep]);

  const handleNext = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nextStep();
  }, [nextStep]);

  const handleCreateProject = useCallback(async () => {
    if (!formData.name.trim() || !formData.type) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const project = await projectService.createProject(
        formData.type, 
        formData.name.trim(),
        formData.label.trim() || undefined
      );
      
      // Add to store
      addProject(project);
      
      // Navigate to the new project
      router.replace(`/project/${project.id}`);
      
    } catch (error) {
      console.error('Failed to create project:', error);
      Alert.alert('Error', 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData, setLoading, addProject, projectService]);

  if (!fontsLoaded) {
    return null; // Or a loading spinner
  }

  const getCurrentStepBackground = () => {
    switch (currentStep) {
      case 1:
        return Colors.mint;
      case 2:
        return Colors.mint;
      default:
        return Colors.white;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getCurrentStepBackground() }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: getCurrentStepBackground() }]}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
        >
          <FontAwesome6 name="chevron-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.stepIndicator}>
            Step {currentStep} of {totalSteps}
          </Text>
        </View>
      </View>

      {/* Step Content */}
      <View style={styles.stepContainer}>
        {currentStep === 1 && (
          <CreateProjectStep1 onNext={handleNext} />
        )}
        
        {currentStep === 2 && (
          <CreateProjectStep2 onCreateProject={handleCreateProject} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minHeight: 60,
  },
  
  backButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerCenter: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: TouchTargets.minimum, // Balance the back button
  },
  
  stepIndicator: {
    fontFamily: 'NanumPenScript_400Regular',
    fontSize: 22,
    color: Colors.textPrimary,
    textTransform: 'capitalize',
    fontWeight: '400',
  },
  
  stepContainer: {
    flex: 1,
  },
});